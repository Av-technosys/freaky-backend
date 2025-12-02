import { and, eq, ilike, sql } from 'drizzle-orm';
import { db } from '../../db/db.js';
import {
  vendorEmployees,
  vendorEmployeeRequests,
  vendorOwnerships,
  vendors,
  products
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
      filters.push(ilike(vendors.legalEntityName, `%${text}%`));
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
      .insert(vendorEmployees)
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

export const updateAddressDetails = async (req, res) => {
  try {
    const vendorId = req.user['custom:vendor_ids'];
    const {
      streetAddressLine1,
      streetAddressLine2,
      city,
      state,
      country,
      zipcode,
    } = req.body;

    await db
      .update(vendors)
      .set({
        streetAddressLine1: streetAddressLine1,
        streetAddressLine2: streetAddressLine2,
        city: city,
        state: state,
        zipcode: zipcode,
        country: country,
      })
      .where(eq(vendors.vendorId, vendorId))
      .returning();

    return res.status(200).json({
      message: 'Address Details Updated successfully.',
    });
  } catch (error) {
    console.log('error', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export const updateBankDetails = async (req, res) => {
  try {
    const vendorId = req.user['custom:vendor_ids'];
    const { bankAccountNumber, bankName, payeeName, routingNumber, bankType } =
      req.body;

    await db
      .update(vendors)
      .set({
        bankAccountNumber: bankAccountNumber,
        bankName: bankName,
        payeeName: payeeName,
        routingNumber: routingNumber,
        bankType: bankType,
      })
      .where(eq(vendors.vendorId, vendorId))
      .returning();

    return res.status(200).json({
      message: 'Bank Details Updated successfully.',
    });
  } catch (error) {
    console.log('error', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export const updateContactDetails = async (req, res) => {
  try {
    const vendorId = req.user['custom:vendor_ids'];
    const {
      primaryContactName,
      primaryEmail,
      primaryPhoneNumber,
      instagramURL,
      youtubeURL,
      facebookURL,
    } = req.body;

    await db
      .update(vendors)
      .set({
        primaryContactName: primaryContactName,
        primaryEmail: primaryEmail,
        primaryPhoneNumber: primaryPhoneNumber,
        instagramURL: instagramURL,
        youtubeURL: youtubeURL,
        facebookURL: facebookURL,
      })
      .where(eq(vendors.vendorId, vendorId));

    return res.status(200).json({
      message: 'Contact Details Updated successfully.',
    });
  } catch (error) {
    console.log('error', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export const updateCompanyDetails = async (req, res) => {
  try {
    const vendorId = req.user['custom:vendor_ids'];
    const {
      businessName,
      websiteURL,
      logoUrl,
      description,
      DBAname,
      legalEntityName,
      einNumber,
      businessType,
      incorporationDate,
    } = req.body;

    await db
      .update(vendors)
      .set({
        businessName: businessName,
        websiteURL: websiteURL,
        logoUrl: logoUrl,
        description: description,
        DBAname: DBAname,
        legalEntityName: legalEntityName,
        einNumber: einNumber,
        businessType: businessType,
        incorporationDate: new Date(incorporationDate),
      })
      .where(eq(vendors.vendorId, vendorId));

    return res.status(200).json({
      message: 'Company Details Updated successfully.',
    });
  } catch (error) {
    console.log('error', error);
    return res.status(500).json({ error: error.message });
  }
};

export const updateOwnershipDetails = async (req, res) => {
  try {
    const vendorId = req.user['custom:vendor_ids'];
    const ownershipDetailsArray = req.body;

    if (!vendorId) {
      return res.status(504).json({ msg: 'Vendor not found' });
    }

    await Promise.all(
      ownershipDetailsArray.map(async (ownership) => {
        const ownerId = ownership.id;

        const ownerDetailSave = {
          firstName: ownership.firstName,
          lastName: ownership.lastName,
          ssnNumber: ownership.ssnNumber,
          streetAddressLine1: ownership.streetAddressLine1,
          streetAddressLine2: ownership.streetAddressLine2,
          zipcode: ownership.zipcode,
          city: ownership.city,
          state: ownership.state,
          country: ownership.country,
          isAuthorizedSignature: ownership.isAuthorizedSignature,
          ownershipPercentage: ownership.ownershipPercentage,
        };

        if (ownerId) {
          await db
            .update(vendorOwnerships)
            .set(ownerDetailSave)
            .where(eq(vendorOwnerships.id, ownerId));
        } else {
          await db
            .insert(vendorOwnerships)
            .values({ ...ownerDetailSave, vendorId: vendorId });
        }
      })
    );
    return res.status(200).json({
      message: 'Ownership Details Updated successfully.',
    });
  } catch (error) {
    console.log('error', error);
    return res.status(500).json({ error: error.message });
  }
};
export const fetchVendorProducts = async (req, res) => {
  try {
    const { vendorId } = req.params;

    if (!vendorId) {
        return res.status(400).json({ error: "Vendor ID is required." });
      }

    const vendorProducts = await db.query.products.findMany({
      where: (table, { eq }) => eq(table.vendorId, Number(vendorId)),
    });
 
    if (vendorProducts.length === 0) {
      return res.status(404).json({ error: "No products found for this vendor." });
    }

     const productIds = vendorProducts.map(product => product.productId);

     const productMedia = await db.query.productMedia.findMany({
      where: (table, { inArray }) => inArray(table.productId, productIds),
    });

    const data = vendorProducts.map(product => ({
      ...product,
      media: productMedia.filter(media => media.productId === product.productId)
    }));

    return res.json({
      message: "Products fetched successfully",
      products: data,
    });

  } catch (err) {
    console.error("Error fetching vendor products:", err);
    return res.status(500).json({ error: "Server error fetching vendor products." });
  }
};

export const fetchProductPrice = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId){
      return res.status(400).json({ error: "Product ID is required." });
      }
      const product = await db.query.products.findFirst({
        where: (t, { eq }) => eq(t.productId, Number(productId)),
      });
      if (!product){
      return res.status(404).json({ error: "Product not found" });
      }

      const vendorId = product.vendorId;

      const priceBook = await db.query.priceBook.findMany({
        where: (t, { eq, and }) => and(eq(t.vendorId, vendorId), eq(t.isActive, true)),
      });
 
      if (!priceBook){
      return res.status(404).json({ error: "No pricebook found for vendor" });
      }

      const priceBookingIds = priceBook.map(p => p.id);

      const productPrice = await db.query.priceBookEntry.findMany({
        where: (t, { eq, and, inArray }) =>
          and(
            eq(t.productId, productId),
            inArray(t.priceBookingId, priceBookingIds)
          )
      });

      if (!productPrice){
      return res.status(404).json({ error: "Price not found for this product" });
      }

      return res.json({
        message: "Price fetched successfully",
        vendorId,
        price: productPrice,
      });
  } catch (err) {
    console.error("Price Fetch Error:", err);
    return res.status(500).json({ error: "Server error fetching product price" });
  }
};




export const listProductsType = async (req, res) => {
  try {
  
    const { productTypeId, page = 1, page_size = 12 } = req.query;

    if (!productTypeId){
       const productTypes = await db.query.productType.findMany();

      return res.json({
        message: "product type fetched successfully",
        productTypes: productTypes,
      });
    }
    
     const limit = Number(page_size);
     const offset = (Number(page) - 1) * limit;

     const totalRows = await db
    .select({ count: sql`CAST(count(*) AS INTEGER)` })
    .from(products)
    .where(eq(products.productTypeId, Number(productTypeId)));

    const total = totalRows[0].count;

      const data = await db
      .select()
      .from(products)
      .where(eq(products.productTypeId, Number(productTypeId)))
      .limit(limit)
      .offset(offset);

      console.log("data",data)

    return res.json({
      success: true,
      message: "Products fetched successfully",
      pagination: {
        page: Number(page),
        page_size: limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
      data,
    });
  } catch (error) {
    console.error("Error fetching products by type:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};