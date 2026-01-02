import { AdminSetUserPasswordCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognito, USER_POOL_ID } from '../../lib/cognitoClient.js';
import { eventType, users, vendors } from '../../db/schema.js';
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

export const listAllVendorsForAdminpanel = async (req, res) => {
  try {
    const vendorsFullData = await db.execute(sql`
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

  WHERE v.status = 'pending_admin'
  GROUP BY v.id
  ORDER BY v.business_name ASC
`);

    return res.status(200).json({
      message: 'vendors fetched successfully.',
      data: vendorsFullData,
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

export const createEventType = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    await db
      .insert(eventType)
      .values({ name: name, description: description, image: image });

    return res.status(200).json({
      message: 'Event Type created successfully.',
    });
  } catch (error) {
    console.error('error', error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateEventTypeById = async (req, res) => {
  try {
    const { eventTypeId } = req.params;
    const { name, description, image } = req.body;
    await db
      .update(eventType)
      .set({ name: name, description: description, image: image })
      .where(eq(eventType.id, eventTypeId))
      .returning();

    return res.status(200).json({
      message: 'Event Type details updated successfully.',
    });
  } catch (error) {
    console.error('error', error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteEventTypeById = async (req, res) => {
  try {
    const { eventTypeId } = req.params;
    await db.delete(eventType).where(eq(eventType.id, eventTypeId));

    return res.status(200).json({
      message: 'Event Type  deleted successfully.',
    });
  } catch (error) {
    console.error('error', error);
    return res.status(500).json({
      message: error.message,
    });
  }
};
