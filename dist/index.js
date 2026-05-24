"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const decks_1 = __importDefault(require("./routes/decks"));
const auth_1 = __importDefault(require("./routes/auth"));
const flashcards_1 = __importDefault(require("./routes/flashcards"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Hello, Flashcards API!');
});
app.use('/auth', auth_1.default);
app.use('/decks', decks_1.default);
app.use('/flashcards', flashcards_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
