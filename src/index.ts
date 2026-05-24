import express, { Request, Response } from 'express';
import cors from 'cors';
import decksRouter from './routes/decks';
import authRouter from './routes/auth';
import flashcardsRouter from './routes/flashcards';

const app = express();
const PORT = process.env.PORT || 3000;
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors());
app.use(cors(corsOptions));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Flashcards API!');
});

app.use('/auth', authRouter);
app.use('/decks', decksRouter);
app.use('/flashcards', flashcardsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});