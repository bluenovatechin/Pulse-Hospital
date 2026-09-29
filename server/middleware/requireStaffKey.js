// ========================================================
// Pulse Hospital - Staff portal protection
// Staff endpoints expose patient names, phones and symptoms,
// so they require the ADMIN_KEY set on the server.
// ========================================================
import crypto from 'crypto';

const ADMIN_KEY = process.env.ADMIN_KEY || '';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

if (!ADMIN_KEY) {
  console.warn(IS_PRODUCTION
    ? '⚠️  ADMIN_KEY is not set: the staff portal is disabled.'
    : '⚠️  ADMIN_KEY is not set: staff portal is open (local development only).');
}

function keysMatch(given) {
  const a = Buffer.from(String(given));
  const b = Buffer.from(ADMIN_KEY);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export default function requireStaffKey(req, res, next) {
  if (!ADMIN_KEY) {
    if (IS_PRODUCTION) {
      return res.status(503).json({ error: 'Staff portal is disabled until ADMIN_KEY is set on the server.' });
    }
    return next();
  }
  if (!keysMatch(req.get('x-admin-key') || '')) {
    return res.status(401).json({ error: 'Staff key required.' });
  }
  next();
}
