"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../../middleware/auth");
process.env.JWT_SECRET = 'test-secret'; // Configurar variable de entorno para pruebas
// Mocking jsonwebtoken
jest.mock('jsonwebtoken');
//describe() agrupa test relacionados
// partial significa "puede tener algunas propiedades, no todas"
describe('authMiddleware', () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
        jest.clearAllMocks(); // Limpiar mocks antes de cada test
        req = {
            headers: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });
    it('should return 401 when token is missing', () => {
        req.headers = {}; // No Authorization header
        (0, auth_1.authMiddleware)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Token requerido' });
        expect(next).not.toHaveBeenCalled();
    });
    it('should extract userId when token is valid', () => {
        const mockUser = { userId: 123 };
        const mockToken = 'valid-token';
        req.headers = { authorization: `Bearer ${mockToken}` };
        jsonwebtoken_1.default.verify.mockReturnValue(mockUser);
        (0, auth_1.authMiddleware)(req, res, next);
        expect(jsonwebtoken_1.default.verify).toHaveBeenCalledWith(mockToken, expect.any(String));
        expect(req.userId).toBe(123);
        expect(next).toHaveBeenCalled();
    });
    it('should return 401 when token is invalid', () => {
        const mockToken = 'invalid-token';
        req.headers = { authorization: `Bearer ${mockToken}` };
        jsonwebtoken_1.default.verify.mockImplementation(() => {
            throw new Error('Invalid token');
        });
        (0, auth_1.authMiddleware)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido' });
        expect(next).not.toHaveBeenCalled();
    });
});
