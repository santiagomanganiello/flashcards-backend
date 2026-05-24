"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const flashcards_1 = __importDefault(require("../../routes/flashcards"));
process.env.JWT_SECRET = 'testsecret';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
process.env.GEMINI_API_KEY = 'test-key';
jest.mock('../../lib/prisma');
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/flashcards', flashcards_1.default);
// Generar flashcards con IA
describe('POST /generate/:deckId', () => {
    // Arrange
    it('should generate flashcards', async () => {
        // Act
        const token = jsonwebtoken_1.default.sign({ userId: 1 }, process.env.JWT_SECRET);
        const res = await (0, supertest_1.default)(app)
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
        const token = jsonwebtoken_1.default.sign({ userId: 1 }, process.env.JWT_SECRET);
        const res = await (0, supertest_1.default)(app)
            .get('/flashcards/1')
            .set('Authorization', `Bearer ${token}`);
        // Assert
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeDefined();
    });
});
