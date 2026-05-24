import request from 'supertest';
import express from 'express';
import authRouter from '../../routes/auth';

process.env.JWT_SECRET = 'testsecret';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';

jest.mock('../../lib/prisma');

const app = express();
app.use(express.json());
app.use('/auth', authRouter);

// Register
describe('POST /auth/register', () => {
    
    // Arrange
    it('should register a new user', async () => {
        // Act
        const res = await request(app)
            .post('/auth/register')
            .send({ email: 'test@example.com', password: 'Testpassword1' });
        // Assert
        expect(res.statusCode).toBe(201);
        expect(res.body.userId).toBeDefined();
        expect(res.body.message).toBe('Usuario registrado exitosamente');
    });
    // Negative test cases
    it ('should return 400 if email is missing', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({ password: 'testpassword'});
        expect(res.statusCode).toBe(400);
        expect(res.body.errors).toBeDefined();
        expect(res.body.errors.length).toBeGreaterThan(0);
    });
});

