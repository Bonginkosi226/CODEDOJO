import express from 'express';
import { body } from 'express-validator';
import {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword
} from '../controllers/authController.js';
import protect from '../middleware/auth.js';
import { forgotPasswordIpLimiter, forgotPasswordEmailLimiter } from '../middleware/rateLimiters.js';

const router = express.Router();

const registerValidation = [
    body('username')
    .trim()
    .isLength({ min: 3} )
    .withMessage('Username must be at least 3 character'),
    body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Password must be at least 6 characters')
] ;

const loginValidation = [
    body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
    body('password')
    .notEmpty()
    .withMessage('Password is required')
] ;

// Same normalization as register/login, so the lookup matches how emails are stored
const forgotPasswordValidation = [
    body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
];

//Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post(
    '/forgot-password',
    forgotPasswordIpLimiter,
    forgotPasswordValidation,
    forgotPasswordEmailLimiter,
    forgotPassword
);
router.post('/reset-password', resetPassword);

//Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/change-password', protect, changePassword);

export default router;