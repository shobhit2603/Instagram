import { body, validationResult } from 'express-validator';

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export const registerValidation = [
    body('username')
        .notEmpty().withMessage('Username is required')
        .isString().withMessage('Username must be a string')
        .toLowerCase()
        .trim()
        .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters')
        .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),

    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail()
        .trim(),

    body('fullName')
        .notEmpty().withMessage('Full name is required')
        .isString().withMessage('Full name must be a string')
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage('Full name must be between 2 and 50 characters'),

    body("password")
        .notEmpty().withMessage("Password is required")
        .isString().withMessage("Password must be a string")
        .trim()
        .isLength({ min: 6, max: 30 }).withMessage("Password must be at least 6 and at most 30 characters long")
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
        .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
        .matches(/[0-9]/).withMessage("Password must contain at least one number")
        .matches(/[@#$!%*?&]/).withMessage("Password must contain at least one special character"),

    validate,
]

export const loginValidation = [
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail()
        .trim(),
    body('password')
        .notEmpty().withMessage('Password is required'),
    validate
];