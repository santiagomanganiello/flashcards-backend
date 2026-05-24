import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import decksRouter from '../../routes/decks';

process.env.JWT_SECRET = 'testsecret';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';

jest.mock('../../lib/prisma');

const app = express();
app.use(express.json());
app.use('/decks', decksRouter);

// crear un mazo
describe('POST /decks', () => {
    //token
    const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET!);

    //Arrange
    it ('should create a new deck', async () => {
        //Act
        const res = await request(app)
        .post('/decks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Test Deck', userId: 1,});
        //Assert
        expect(res.statusCode).toBe(201);
        expect(res.body.id).toBeDefined();
    });
})

// borrar un mazo
describe('DELETE /decks/:id', () => {
    //token
    const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET!);

    //Arrange
    it ('should delete a deck', async () => {
        //Act
        const res = await request(app)
        .delete('/decks/1')
        .set('Authorization', `Bearer ${token}`)
        //Assert
        expect(res.statusCode).toBe(200);
    });
})

