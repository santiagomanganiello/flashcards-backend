"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const decks_1 = __importDefault(require("../../routes/decks"));
process.env.JWT_SECRET = 'testsecret';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
jest.mock('../../lib/prisma');
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/decks', decks_1.default);
// crear un mazo
describe('POST /decks', () => {
    //token
    const token = jsonwebtoken_1.default.sign({ userId: 1 }, process.env.JWT_SECRET);
    //Arrange
    it('should create a new deck', async () => {
        //Act
        const res = await (0, supertest_1.default)(app)
            .post('/decks')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Test Deck', userId: 1, });
        //Assert
        expect(res.statusCode).toBe(201);
        expect(res.body.id).toBeDefined();
    });
});
// borrar un mazo
describe('DELETE /decks/:id', () => {
    //token
    const token = jsonwebtoken_1.default.sign({ userId: 1 }, process.env.JWT_SECRET);
    //Arrange
    it('should delete a deck', async () => {
        //Act
        const res = await (0, supertest_1.default)(app)
            .delete('/decks/1')
            .set('Authorization', `Bearer ${token}`);
        //Assert
        expect(res.statusCode).toBe(200);
    });
});
