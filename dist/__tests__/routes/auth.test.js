"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../routes/auth"));
process.env.JWT_SECRET = 'testsecret';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
jest.mock('../../lib/prisma');
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/auth', auth_1.default);
// Register
describe('POST /auth/register', () => {
    // Arrange
    it('should register a new user', async () => {
        // Act
        const res = await (0, supertest_1.default)(app)
            .post('/auth/register')
            .send({ email: 'test@example.com', password: 'testpass' });
        // Assert
        expect(res.statusCode).toBe(201);
        expect(res.body.userId).toBeDefined();
        expect(res.body.message).toBe('Usuario registrado exitosamente');
    });
    // Negative test cases
    it('should return 400 if email is missing', async () => {
        const res = await (0, supertest_1.default)(app)
            .post('/auth/register')
            .send({ password: 'testpassword' });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Email y contraseña son requeridos');
    });
});
