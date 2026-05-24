"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
// GET /decks - traer todos los mazos
router.get('/', async (req, res) => {
    try {
        const decks = await prisma_1.default.deck.findMany({
            include: { cards: true },
            where: { userId: req.userId }
        });
        res.json(decks);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener los mazos' });
    }
});
// POST /decks - crear un mazo
router.post('/', async (req, res) => {
    try {
        const { title } = req.body;
        if (!title) {
            res.status(400).json({ error: 'El título es requerido' });
            return;
        }
        const deckCount = await prisma_1.default.deck.count({
            where: { userId: req.userId }
        });
        if (deckCount >= 6) {
            res.status(400).json({ error: 'Has alcanzado el límite de mazos' });
            return;
        }
        const deck = await prisma_1.default.deck.create({
            data: { title, userId: req.userId }
        });
        res.status(201).json(deck);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al crear el mazo' });
    }
});
// GET /decks/:id - traer un mazo específico
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deck = await prisma_1.default.deck.findUnique({
            where: { id: Number(id) },
            include: { cards: true }
        });
        if (!deck) {
            res.status(404).json({ error: 'Mazo no encontrado' });
            return;
        }
        res.json(deck);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener el mazo' });
    }
});
// DELETE /decks/:id - borrar un mazo
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.default.deck.delete({
            where: { id: Number(id) }
        });
        res.status(200).json({ message: 'Mazo eliminado' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error al eliminar el mazo' });
    }
});
exports.default = router;
