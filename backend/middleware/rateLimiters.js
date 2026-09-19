import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

// In-memory counters: they reset when the server restarts and are per server
// process. Fine for a single instance; use a shared store (e.g. Redis) if this
// is ever scaled out. Behind a reverse proxy, set `app.set('trust proxy', ...)`
// so req.ip is the real client and not the proxy.
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_PER_IP = 15;
const MAX_PER_EMAIL = 5;

const tooMany = (req, res) =>
  res.status(429).json({
    success: false,
    error: 'Too many password reset requests. Please try again later.',
    statusCode: 429,
  });

// Per IP: stops one machine spraying requests across many addresses.
export const forgotPasswordIpLimiter = rateLimit({
  windowMs: WINDOW_MS,
  limit: MAX_PER_IP,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  keyGenerator: (req) => `ip:${ipKeyGenerator(req.ip)}`,
  handler: tooMany,
});

// Per email: stops many machines hammering ONE inbox. Runs after validation, so
// the email is already normalized. The count is the same whether or not the
// account exists, so the limiter can't be used to probe for accounts either.
export const forgotPasswordEmailLimiter = rateLimit({
  windowMs: WINDOW_MS,
  limit: MAX_PER_EMAIL,
  standardHeaders: false,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    return email ? `email:${email}` : `ip:${ipKeyGenerator(req.ip)}`;
  },
  handler: tooMany,
});
