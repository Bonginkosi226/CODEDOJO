import express from 'express';
import { logBulkTelemetry } from '../controllers/telemetryController.js';
// We use a middleware that sets req.user if authenticated, but doesn't block if not
import protect from '../middleware/auth.js'; 

const router = express.Router();

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// A generic "soft protect" middleware to attach user if token exists, but allow if it doesn't
const softProtect = async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
        } catch (e) {
            // ignore auth error for telemetry and proceed as unauthenticated
        }
    }
    next();
};

router.post('/bulk', softProtect, logBulkTelemetry);

export default router;
