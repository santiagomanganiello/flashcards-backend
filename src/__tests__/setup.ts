process.env.JWT_SECRET = 'test-secret-key';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/flashcards_test';
process.env.GEMINI_API_KEY = 'test-gemini-api-key';

jest.mock('../lib/prisma', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com' }),
    },
    deck: {
      findMany: jest.fn(),
      findFirst: jest.fn().mockResolvedValue({ 
        id: 1, 
        title: 'Test Deck', 
        userId: 1
      }),
      create: jest.fn().mockResolvedValue({ 
        id: 1, 
        title: 'Test Deck', 
        userId: 1
      }),
      count: jest.fn().mockResolvedValue(0),
      delete: jest.fn().mockResolvedValue({ id: 1 }),
    },
    flashcard: {
      createMany: jest.fn().mockResolvedValue({ count: 1 }),
      findMany: jest.fn().mockResolvedValue([]),
      count: jest.fn().mockResolvedValue(0),
    },
  },
}));