import { verifyCognitoToken } from '../helpers/tokenVerifier.js';

export const checkVendor = async (req, res, next) => {
  console.log('Checking in vendor middleware...');

  const authHeader = req?.headers.authorization;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : req?.body.token;

  try {
    const decoded = await verifyCognitoToken(token);

    // Check for vendor specific claims
    // The example token shows: "custom:vendor_ids": "{\"vendorId\":3, \"vendorEmployeesId\":2}"
    const vendorIdsString = decoded['custom:vendor_ids'];

    if (!vendorIdsString) {
      return res.status(403).json({ error: 'Access denied. User is not a vendor.' });
    }

    const vendorIds = JSON.parse(vendorIdsString);
    req.user = decoded;
    req.vendor = vendorIds;
    next();
  } catch (err) {
    if (err instanceof SyntaxError) {
      console.error('Failed to parse vendor_ids:', err);
      return res.status(400).json({ error: 'Invalid vendor configuration.' });
    }
    
    console.error('Token verification failed:', err);
    if (err.message === 'Token is required.') {
      return res.status(400).json({ error: err.message });
    }
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};