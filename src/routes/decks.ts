import { Router, Request, Response } from 'express'
import prisma from '../lib/prisma'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()

router.use(authMiddleware)

// GET /decks - traer todos los mazos
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const decks = await prisma.deck.findMany({
      include: { cards: true },
      where: { userId: req.userId }
    })
    res.json(decks)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los mazos' })
  }
})

// POST /decks - crear un mazo
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { title } = req.body

    if (!title) {
      res.status(400).json({ error: 'El título es requerido' })
      return
    }

    const deckCount = await prisma.deck.count({
      where: { userId: req.userId }
    })

    if (deckCount >= 6) {
      res.status(400).json({ error: 'Has alcanzado el límite de mazos' })
      return
    }

    const deck = await prisma.deck.create({
      data: { title, userId: req.userId as number }
    })

    res.status(201).json(deck)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el mazo' })
  }
})

// GET /decks/:id - traer un mazo específico
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params

    const deck = await prisma.deck.findUnique({
      where: { id: Number(id) },
      include: { cards: true }
    })

    if (!deck) {
      res.status(404).json({ error: 'Mazo no encontrado' })
      return
    }

    res.json(deck)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el mazo' })
  }
})

// DELETE /decks/:id - borrar un mazo
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params

    await prisma.deck.delete({
      where: { id: Number(id) }
    })

    res.status(200).json({ message: 'Mazo eliminado' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el mazo' })
  }
})

export default router