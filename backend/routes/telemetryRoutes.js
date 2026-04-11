import express from 'express';
import { logBulkTelemetry } from '../controllers/telemetryController.js';
// We use a middleware that sets req.user if authenticated, but doesn't block if not
import protect from '../middleware/auth.js'; 

const router = express.Router();

// A generic "soft protect" middleware to attach user if token exists, but allow if it doesn't
const softProtect = async (req, res, next) => {
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // It has a token, run through the standard protect logic
        try {
            await protect(req, res, () => {});
        } catch(e) {
            // ignore auth error for telemetry
        }
    }
    next();
};

router.post('/bulk', softProtect, logBulkTelemetry);

export default router;
