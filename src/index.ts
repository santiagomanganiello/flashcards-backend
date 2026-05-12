import express, { Request, Response } from 'express';
import cors from 'cors';
import decksRouter from './routes/decks';
import authRouter from './routes/auth';
import flashcardsRouter from './routes/flashcards';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Flashcards API!');
});

app.use('/auth', authRouter);
app.use('/decks', decksRouter);
app.use('/flashcards', flashcardsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});