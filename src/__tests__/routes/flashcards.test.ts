import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import flashCardsRouter from '../../routes/flashcards';

process.env.JWT_SECRET = 'testsecret';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
process.env.GEMINI_API_KEY = 'test-key';

jest.mock('../../lib/prisma');

const app = express();
app.use(express.json());
app.use('/flashcards', flashCardsRouter);

// Generar flashcards con IA
describe('POST /generate/:deckId', () => {
    // Arrange
    it.skip('should generate flashcards', async () => {
        // Act
        const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET!);
        const res = await request(app)
            .post('/flashcards/generate/1')
            .set('Authorization', `Bearer ${token}`)
            .send({ text: 'Test text' });
        // Assert
        expect(res.statusCode).toBe(201);
        expect(res.body).toBeDefined();
    });
});

// GET /flashcards/:deckId - traer todas las flashcards de un mazo
describe('GET /flashcards/:deckId', () => {
    // Arrange
    it('should get all flashcards', async () => {
        // Act
        const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET!);
        const res = await request(app)
            .get('/flashcards/1')
            .set('Authorization', `Bearer ${token}`);
        // Assert
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeDefined();
    });
});