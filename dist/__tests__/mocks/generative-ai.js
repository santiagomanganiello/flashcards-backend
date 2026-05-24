"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleGenerativeAI = void 0;
class GoogleGenerativeAI {
    constructor(apiKey) { }
    getGenerativeModel(config) {
        return {
            generateContent: jest.fn().mockResolvedValue({
                response: {
                    text: jest.fn().mockReturnValue(JSON.stringify([{ question: 'Test Q', answer: 'Test A' }])),
                },
            }),
        };
    }
}
exports.GoogleGenerativeAI = GoogleGenerativeAI;
