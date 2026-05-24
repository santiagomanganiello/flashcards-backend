"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middleware/auth");
const generative_ai_1 = require("@google/generative-ai");
// inicializa el router
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
// POST / flashcards/generate/:deckId - generar flashcards con IA
router.post('/generate/:deckId', async (req, res) => {
    try {
        const { deckId } = req.params;
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Text is required to generate flashcards' });
        }
        const deck = await prisma_1.default.deck.findFirst({
            where: { id: Number(deckId), userId: req.userId }
        });
        if (!deck) {
            return res.status(404).json({ error: 'Mazo no encontrado' });
        }
        const cardCount = await prisma_1.default.flashcard.count({
            where: { deckId: Number(deckId) }
        });
        if (cardCount >= 20) {
            return res.status(400).json({ error: 'Has alcanzado el límite de flashcards para este mazo' });
        }
        const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const prompt = `Analizá el siguiente texto y generá 5 flashcards de estudio.
        Respondé SOLO con un JSON válido, sin explicaciones ni backticks, con este formato exacto:
        [
        { 
            "question": "pregunta",
            "answer": "respuesta correcta",
            "wrongAnswers": ["respuesta incorrecta 1", "respuesta incorrecta 2", "respuesta incorrecta 3"]
        }
        ]
        Texto: ${text}`;
        const result = await model.generateContent(prompt);
        let responseText = result.response.text();
        // Remove markdown code blocks if present
        responseText = responseText.replace(/^```(?:json)?\s*/m, '').replace(/```\s*$/m, '').trim();
        let cards;
        try {
            cards = JSON.parse(responseText);
        }
        catch (parseError) {
            console.error('Invalid JSON from generative model:', responseText, parseError);
            return res.status(500).json({
                error: 'Respuesta inválida de la IA',
                details: 'No se pudo interpretar el JSON recibido del modelo generativo.'
            });
        }
        if (!Array.isArray(cards)) {
            console.error('Unexpected AI response format:', responseText);
            return res.status(500).json({
                error: 'Respuesta inválida de la IA',
                details: 'El modelo no respondió con un arreglo de tarjetas.'
            });
        }
        const saveCards = await prisma_1.default.flashcard.createMany({
            data: cards.map((card) => ({
                question: card.question,
                answer: card.answer,
                wrongAnswers: card.wrongAnswers,
                deckId: Number(deckId)
            }))
        });
        res.status(201).json({ message: `${saveCards.count} flashcards generadas y guardadas exitosamente`, cards });
    }
    catch (error) {
        console.error('Error generating flashcards:', error);
        res.status(500).json({ error: 'Error al generar flashcards' });
    }
});
// GET /flashcards/:deckId - traer todas las flashcards de un mazo
router.get('/:deckId', async (req, res) => {
    try {
        const cards = await prisma_1.default.flashcard.findMany({
            where: { deckId: Number(req.params.deckId) },
        });
        res.json(cards);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener las flashcards' });
    }
});
exports.default = router;
