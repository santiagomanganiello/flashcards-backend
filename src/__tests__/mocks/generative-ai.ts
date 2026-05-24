export class GoogleGenerativeAI {
  constructor(apiKey: string) {}

  getGenerativeModel(config: any) {
    return {
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: jest.fn().mockReturnValue(
            JSON.stringify([{ question: 'Test Q', answer: 'Test A' }])
          ),
        },
      }),
    };
  }
}
