import { Router, Response} from 'express';
import prisma from '../lib/prisma';
import{ authMiddleware, AuthRequest } from '../middleware/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';

// inicializa el router
const router = Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

router.use(authMiddleware);

// POST / flashcards/generate/:deckId - generar flashcards con IA
router.post('/generate/:deckId', async (req: AuthRequest, res: Response) => {
    try {
        const { deckId } = req.params;
        const { text } = req.body;
        
        if (!text) {
            return res.status(400).json({ error: 'Text is required to generate flashcards' });
        }

        const deck = await prisma.deck.findFirst({
            where: { id: Number(deckId), userId: req.userId }
        })

        if (!deck) {
            return res.status(404).json({ error: 'Mazo no encontrado' });
        }

        const cardCount = await prisma.flashcard.count({
            where: { deckId: Number(deckId) }
        });

        if (cardCount >= 20) {
            return res.status(400).json({ error: 'Has alcanzado el límite de flashcards para este mazo' });
        }
    
        const model = genAI.getGenerativeModel({model: 'gemini-2.5-flash'});

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
        const responseText = result.response.text();

        const cards = JSON.parse(responseText);

        const saveCards = await prisma.flashcard.createMany({
            data: cards.map((card: { question: string; answer: string; wrongAnswers: string[]}) => ({
                question: card.question,
                answer: card.answer,
                wrongAnswers: card.wrongAnswers,
                deckId: Number(deckId)
            }))
        });
    
        res.status(201).json({ message: `${saveCards.count} flashcards generadas y guardadas exitosamente`, cards });
    
    } catch (error) {
        console.error('Error generating flashcards:', error);
        res.status(500).json({ error: 'Error al generar flashcards' });
    }
});

// GET /flashcards/:deckId - traer todas las flashcards de un mazo
router.get('/:deckId', async (req: AuthRequest, res: Response) => {
    try {
        const cards = await prisma.flashcard.findMany({
            where: { deckId: Number(req.params.deckId) },
        });
        res.json(cards);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las flashcards' });
    }
});

export default router;