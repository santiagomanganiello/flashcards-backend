// imports
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authMiddleware, AuthRequest } from '../../middleware/auth';
process.env.JWT_SECRET = 'test-secret'; // Configurar variable de entorno para pruebas

// Mocking jsonwebtoken
jest.mock('jsonwebtoken');


//describe() agrupa test relacionados
// partial significa "puede tener algunas propiedades, no todas"
describe('authMiddleware', () => {
    let req: Partial<AuthRequest>;
    let res: Partial<Response>;
    let next: NextFunction;


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

    authMiddleware(req as AuthRequest, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token requerido' });
    expect(next).not.toHaveBeenCalled();
    });

  it('should extract userId when token is valid', () => {
    const mockUser = { userId: 123 };
    const mockToken = 'valid-token';

    req.headers = { authorization: `Bearer ${mockToken}` };

    (jwt.verify as jest.Mock).mockReturnValue(mockUser);

    authMiddleware(req as AuthRequest, res as Response, next);

    expect(jwt.verify).toHaveBeenCalledWith(mockToken, expect.any(String));
    expect(req.userId).toBe(123);
    expect(next).toHaveBeenCalled();
  });
      it('should return 401 when token is invalid', () => {
    const mockToken = 'invalid-token';

    req.headers = { authorization: `Bearer ${mockToken}` };

    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    authMiddleware(req as AuthRequest, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido' });
    expect(next).not.toHaveBeenCalled();
  });
});