import express, { Request, Response } from 'express';
import cors from 'cors';
import decksRouter from './routes/decks';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Flashcards API!');
});

app.use('/decks', decksRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});