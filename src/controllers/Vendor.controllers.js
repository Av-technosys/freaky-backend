import { and, ilike, sql } from 'drizzle-orm';
import { db } from '../../db/db.js';
import {
  vendorContacts,
  vendorEmployeeRequests,
  vendors,
} from '../../db/schema.js';
import { commonVendorFields } from '../../const/vendor.js';
import { cognito, USER_POOL_ID } from '../../lib/cognitoClient.js';
import { AdminUpdateUserAttributesCommand } from '@aws-sdk/client-cognito-identity-provider';

export const getCompanyProfile = async (req, res) => {
  // try {
  //   const email = req.user?.email || req.body.email;

  //   if (!email) {
  //     return res.status(400).json({ error: 'Email is required.' });
  //   }

  //   const user = await db.query.vendors.findFirst({
  //     where: (users, { eq }) => eq(users.email, email),
  //   });

  //   if (!user) {
  //     return res.status(404).json({ message: 'User not found.' });
  //   }

  //   return res.json({
  //     message: 'User info fetched successfully.',
  //     data: removePassowrd(user),
  //   });
  // } catch (err) {
  //   console.error('Error fetching user info:', err);
  //   return res.status(500).json({ error: 'Internal server error.' });
  // }
  return res.json({});
};

export const listAllVendors = async (req, res) => {
  try {
    const { text = '', page = 1, page_size = 12 } = req.query;
    const limit = Number(page_size);
    const offset = (Number(page) - 1) * limit;

    const filters = [];

    if (text && text.trim() !== '') {
      filters.push(ilike(vendors.businessName, `%${text}%`));
    }

    const whereClause = filters.length > 0 ? and(...filters) : undefined;

    const totalRows = await db
      .select({ count: sql`CAST(count(*) AS INTEGER)` })
      .from(vendors)
      .where(whereClause);

    const total = totalRows[0].count;

    const data = await db
      .select(commonVendorFields)
      .from(vendors)
      .where(whereClause)
      .orderBy(vendors.createdAt)
      .limit(limit)
      .offset(offset);

    return res.json({
      success: true,
      message: 'Vendors fetched successfully',
      pagination: {
        page: Number(page),
        page_size: limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
      data,
    });
  } catch (error) {
    console.error('Error listing vendors:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const createVendor = async (req, res) => {
  try {
    const userId = req.user['custom:user_id'];
    const username = req.user.email;

    const {
      businessName,
      websiteURL,
      DBAname,
      serviceLine,

      incorporationYear,
      workingTime,

      contactName,
      contactEmail,
      contactNumber,

      linkedinURL,
      youtubeURL,
      facebookURL,
      email,

      addressLine1,
      addressLine2,
      city,
      state,
      country,
      postalCode,

      ownerName,
      SSN,
      authorizedSignatoryName,
      ETINnumber,

      bankName,
      accountHolderName,
      accountNumber,
      routingNumber,

      logoUrl,
      description,
    } = req.body;

    if (!businessName) {
      return res.status(400).json({ error: 'Business name is required.' });
    }

    const [newVendor] = await db
      .insert(vendors)
      .values({
        businessName,
        websiteURL,
        DBAname,
        serviceLine,
        createdBy: userId,

        incorporationYear,
        workingTime,

        contactName,
        contactEmail,
        contactNumber,

        linkedinURL,
        youtubeURL,
        facebookURL,
        email,

        addressLine1,
        addressLine2,
        city,
        state,
        country,
        postalCode,

        ownerName,
        SSN,
        authorizedSignatoryName,
        ETINnumber,

        bankName,
        accountHolderName,
        accountNumber,
        routingNumber,

        logoUrl,
        description,
      })
      .returning();

    const vendorContactPermission = ['admin'];

    const [vnedorContractData] = await db
      .insert(vendorContacts)
      .values({
        userId: userId,
        vendorId: newVendor.vendorId,
        permissions: vendorContactPermission,
        isActive: true,
      })
      .returning();

    // add custom permission and vendorids
    const vendorIds = {
      vendorContractId: vnedorContractData.vendorContactId,
      vendorId: vnedorContractData.vendorId,
    };

    const customParams = {
      UserPoolId: USER_POOL_ID,
      Username: username,
      UserAttributes: [
        {
          Name: 'custom:vendor_ids',
          Value: JSON.stringify(vendorIds),
        },
      ],
    };
    const customParamsCommand = new AdminUpdateUserAttributesCommand(
      customParams
    );

    await cognito.send(customParamsCommand);

    return res.status(200).json({
      success: true,
      message: 'Vendor created successfully.',
      vendor: newVendor,
    });
  } catch (error) {
    console.error('Error creating vendor:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const createVendorEmpRequest = async (req, res) => {
  try {
    const { vendorId, note } = req.body;
    const userId = req.user['custom:user_id'];
    const vendorIds = req.user['custom:vendor_ids'];
    console.log(vendorIds);
    if (vendorIds && vendorIds.length > 0)
      return res
        .status(400)
        .json({ message: 'You are already under a vendor' });
    await db
      .insert(vendorEmployeeRequests)
      .values({
        vendorId,
        userId,
        note,
      })
      .returning();
    return res.status(200).json({
      message: 'Request sent successfully.',
    });
  } catch (error) {
    console.error('Error creating vendor:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// export const createVendorEmpRequest = async (req, res) => {};
