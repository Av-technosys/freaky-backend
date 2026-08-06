import { eq } from 'drizzle-orm';
import { db } from '../../db/db.js';
import { vendorEmployees, vendors } from '../../db/schema.js';
import { verifyCognitoToken } from '../helpers/tokenVerifier.js';

const parseVendorClaim = (vendorIdsString) => {
  if (!vendorIdsString) return null;

  const parsed = JSON.parse(vendorIdsString);
  if (typeof parsed === 'number') return { vendorId: parsed };
  if (typeof parsed === 'string') return { vendorId: Number(parsed) };
  if (Array.isArray(parsed)) return { vendorId: Number(parsed[0]) };

  return parsed;
};

const findVendorForUser = async (userId) => {
  const employee = await db.query.vendorEmployees.findFirst({
    where: (table, { eq }) => eq(table.userId, userId),
  });

  if (employee?.vendorId) {
    return {
      vendorId: employee.vendorId,
      vendorEmployeesId: employee.vendorEmployeeId,
    };
  }

  const vendor = await db.query.vendors.findFirst({
    where: (table, { eq }) => eq(table.createdBy, userId),
  });

  if (vendor?.vendorId) {
    return { vendorId: vendor.vendorId };
  }

  return null;
};

export const checkVendor = async (req, res, next) => {
  console.log('Checking in vendor middleware...');

  const authHeader = req?.headers.authorization;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : req?.body.token;

  try {
    const decoded = await verifyCognitoToken(token);
    const userId = Number(decoded['custom:user_id']);

    let vendorIds = parseVendorClaim(decoded['custom:vendor_ids']);

    if (!vendorIds?.vendorId && userId) {
      vendorIds = await findVendorForUser(userId);
    }

    if (!vendorIds?.vendorId) {
      return res.status(403).json({ error: 'Access denied. User is not a vendor.' });
    }

    req.user = {
      ...decoded,
      'custom:vendor_ids': JSON.stringify(vendorIds),
    };
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