import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';


//middleware para manejar errores de validación
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

//validaciones para el registro
export const validateRegister = [
    body('email')
        .isEmail()
        .withMessage('El correo electrónico no es válido')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 8 })
        .withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/)
        .withMessage('La contraseña debe tener al menos una letra mayúscula y un número')
        .matches(/[0-9]/)
        .withMessage('La contraseña debe tener al menos un número')
];

//validaciones para el login
export const validateLogin = [
    body('email')
        .isEmail()
        .withMessage('El correo electrónico no es válido'),
    body('password')
        .notEmpty()
        .withMessage('La contraseña es requerida')
];
