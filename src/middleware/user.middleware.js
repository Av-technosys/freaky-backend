import { verifyCognitoToken } from '../helpers/tokenVerifier.js';

export const confirmUserToken = async (req, res, next) => {
  console.log('Checking in middleware...');

  const authHeader = req?.headers.authorization;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : req?.body.token;

  try {
    const decoded = await verifyCognitoToken(token);
    req.user = decoded; // ✅ contains user info (email, sub, etc.)
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message || err);
    return res.status(401).json({
      message: err.message || 'Invalid or expired token.',
      error: err.message || 'Invalid or expired token.'
    });
  }
};

