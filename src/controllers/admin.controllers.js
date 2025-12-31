import { AdminSetUserPasswordCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognito, USER_POOL_ID } from '../../lib/cognitoClient.js';
import { users, vendors } from '../../db/schema.js';
import { db } from '../../db/db.js';
import { eq, sql } from 'drizzle-orm';

export const adminResetPassword = async (req, res) => {
  const { user, password } = req.body;
  console.log(user, password);
  const customParams = {
    UserPoolId: USER_POOL_ID,
    Username: user,
    Password: password,
    Permanent: true,
  };
  const customParamsCommnad = new AdminSetUserPasswordCommand(customParams);
  const response = await cognito.send(customParamsCommnad);
  return res.json({ message: 'adminResetPassword', data: response });
};

export const listAllRequestedVendors = async (req, res) => {
  try {
    const requestedVendors = await db
      .select({
        businessName: vendors.businessName,
        status: vendors.status,
        createdAt: vendors.createdAt,
        vendorId: vendors.vendorId,
      })
      .from(vendors)
      .where(eq(vendors.status, 'pending_admin'));
    return res.status(200).json({
      message: 'vendors fetched successfully.',
      data: requestedVendors,
    });
  } catch (error) {
    console.error('error', error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const listAllVendors = async (req, res) => {
  try {
    const vendorsData = await db
      .select({
        businessName: vendors.businessName,
        status: vendors.status,
        createdAt: vendors.createdAt,
        vendorId: vendors.vendorId,
      })
      .from(vendors);
    return res.status(200).json({
      message: 'vendors fetched successfully.',
      data: vendorsData,
    });
  } catch (error) {
    console.error('error', error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const listAllUsers = async (req, res) => {
  try {
    const usersData = await db
      .select({
        firstName: users.firstName,
        lastName: users.lastName,
        number: users.number,
        createdAt: users.createdAt,
        userId: users.userId,
        isActive: users.isActive,
      })
      .from(users);
    return res.status(200).json({
      message: 'vendors fetched successfully.',
      data: usersData,
    });
  } catch (error) {
    console.error('error', error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const vendorDetailsById = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const vendorFullData = await db.execute(sql`
  SELECT
    v.*,

    COALESCE(
      JSON_AGG(DISTINCT vo.*)
      FILTER (WHERE vo.vendor_id IS NOT NULL),
      '[]'
    ) AS ownershipDetails,

    COALESCE(
      JSON_AGG(DISTINCT vd.*)
      FILTER (WHERE vd.vendor_id IS NOT NULL),
      '[]'
    ) AS vendorDocumentsData

  FROM vendor v
  LEFT JOIN vendor_ownership vo
    ON vo.vendor_id = v.id
  LEFT JOIN vendor_document vd
    ON vd.vendor_id = v.id

  WHERE v.id = ${vendorId}
  GROUP BY v.id
`);

    return res.status(200).json({
      message: 'vendors details fetched successfully.',
      data: vendorFullData[0],
    });
  } catch (error) {
    console.error('error', error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const userDetailsById = async (req, res) => {
  try {
    const { userId } = req.params;

    const vendorFullData = await db
      .select()
      .from(users)
      .where(eq(users.userId, userId));

    return res.status(200).json({
      message: 'User details fetched successfully.',
      data: vendorFullData[0],
    });
  } catch (error) {
    console.error('error', error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateVendorStatus = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { status } = req.body;

    await db
      .update(vendors)
      .set({ status: status })
      .where(eq(vendors.vendorId, vendorId))
      .returning();

    return res.status(200).json({
      message: 'Status changed successfully.',
    });
  } catch (error) {
    console.log('error', error);
    return res.status(500).json({
      message: error.message,
    });
  }
};
