import { and, asc, eq, ilike, sql } from 'drizzle-orm';
import { db } from '../../db/db.js';
import {
  vendorEmployees,
  vendorEmployeeRequests,
  vendorOwnerships,
  vendors,
  products,
  featuredCategorys,
  featuredProdcuts,
  priceBook,
  priceBookEntry,
  productMedia,
  vendorDocuments,
  users,
  vendorInvites,
  vendorNotifications,
} from '../../db/schema.js';
import { commonVendorFields, reducedVendorFields } from '../../const/vendor.js';
import { cognito, USER_POOL_ID } from '../../lib/cognitoClient.js';
import { AdminUpdateUserAttributesCommand } from '@aws-sdk/client-cognito-identity-provider';
import { bookingDraft } from '../../db/schema.js';
import { paginate } from '../helpers/paginate.js';

export const getVendorInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const [vendorData] = await db
      .select()
      .from(vendors)
      .where(eq(vendors.vendorId, id));
    return res.status(200).json({
      message: 'Vendor info fetched successfully.',
      data: vendorData,
    });
  } catch (error) {
    console.error('Error: ', error);
    return res.status(500).json({ message: error.message });
  }
};

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

    const filters = [];

    if (text && text.trim() !== '') {
      filters.push(ilike(vendors.legalEntityName, `%${text}%`));
    }

    const whereClause = filters.length > 0 ? and(...filters) : undefined;

    const result = await paginate({
      table: vendors,
      select: commonVendorFields,
      where: whereClause,
      orderBy: vendors.createdAt,
      page,
      page_size,
    });

    return res.json({
      success: true,
      message: 'Vendors fetched successfully',
      ...result,
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
    const {
      streetAddressLine1,
      streetAddressLine2,
      city,
      state,
      country,
      zipcode,
    } = req.body;

    const parsed = JSON.parse(req.user['custom:vendor_ids']);
    const vendorId = parsed.vendorId;
    if (!vendorId) {
      return res.status(504).json({ msg: 'Vendor not found' });
    }
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
    const parsed = JSON.parse(req.user['custom:vendor_ids']);
    const vendorId = parsed.vendorId;

    if (!vendorId) {
      return res.status(504).json({ msg: 'Vendor not found' });
    }
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
    const parsed = JSON.parse(req.user['custom:vendor_ids']);
    const vendorId = parsed.vendorId;
    if (!vendorId) {
      return res.status(504).json({ msg: 'Vendor not found' });
    }
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
    const parsed = JSON.parse(req.user['custom:vendor_ids']);
    const vendorId = parsed.vendorId;
    if (!vendorId) {
      return res.status(504).json({ msg: 'Vendor not found' });
    }
    const {
      businessName,
      websiteURL,
      logoUrl,
      description,
      legalEntityName,
      businessType,
      incorporationDate,
      companyLogo,
    } = req.body;

    await db
      .update(vendors)
      .set({
        businessName: businessName,
        websiteURL: websiteURL,
        logoUrl: logoUrl,
        description: description,
        legalEntityName: legalEntityName,
        businessType: businessType,
        incorporationDate: new Date(incorporationDate),
        logoUrl: companyLogo,
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
    const parsed = JSON.parse(req.user['custom:vendor_ids']);
    const vendorId = parsed.vendorId;
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
          isAuthorizedSignature: ownership.isAuthorizedSignature || false,
          ownershipPercentage: ownership.ownershipPercentage,
        };

        if (ownerId) {
          await db
            .update(vendorOwnerships)
            .set(ownerDetailSave)
            .where(eq(vendorOwnerships.id, ownerId));

          return res.status(200).json({
            message: 'Ownership Details Updated successfully.',
          });
        } else {
          await db
            .insert(vendorOwnerships)
            .values({ ...ownerDetailSave, vendorId: vendorId });

          return res.status(200).json({
            message: 'Ownership Details Created successfully.',
          });
        }
      })
    );
  } catch (error) {
    console.log('error', error);
    return res.status(500).json({ error: error.message });
  }
};

export const createCompanyDetails = async (req, res) => {
  try {
    const {
      businessName,
      websiteURL,
      logoUrl,
      description,
      legalEntityName,
      businessType,
      einNumber,
      DBAname,
      incorporationDate,
    } = req.body;

    const userId = req.user?.['custom:user_id'];
    await db.insert(vendors).values({
      einNumber: einNumber,
      DBAname: DBAname,
      businessName: businessName,
      websiteURL: websiteURL,
      logoUrl: logoUrl,
      description: description,
      legalEntityName: legalEntityName,
      businessType: businessType,
      incorporationDate: new Date(incorporationDate),
      createdBy: userId,
    });

    return res.status(200).json({
      message: 'Address Details Created successfully.',
    });
  } catch (error) {
    console.log('error', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export const fetchVendorProducts = async (req, res) => {
  try {
    const { vendorId } = req.params;

    if (!vendorId) {
      return res.status(400).json({ error: 'Vendor ID is required.' });
    }

    const vendorProducts = await db.query.products.findMany({
      where: (table, { eq }) => eq(table.vendorId, Number(vendorId)),
    });

    if (vendorProducts.length === 0) {
      return res
        .status(404)
        .json({ error: 'No products found for this vendor.' });
    }

    const productIds = vendorProducts.map((product) => product.productId);

    const productMedia = await db.query.productMedia.findMany({
      where: (table, { inArray }) => inArray(table.productId, productIds),
    });

    const data = vendorProducts.map((product) => ({
      ...product,
      media: productMedia.filter(
        (media) => media.productId === product.productId
      ),
    }));

    return res.json({
      message: 'Products fetched successfully',
      products: data,
    });
  } catch (err) {
    console.error('Error fetching vendor products:', err);
    return res
      .status(500)
      .json({ error: 'Server error fetching vendor products.' });
  }
};

export const fetchProductPrice = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required.' });
    }
    const product = await db.query.products.findFirst({
      where: (t, { eq }) => eq(t.productId, Number(productId)),
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const vendorId = product.vendorId;

    const priceBook = await db.query.priceBook.findMany({
      where: (t, { eq, and }) =>
        and(eq(t.vendorId, vendorId), eq(t.isActive, true)),
    });

    if (!priceBook) {
      return res.status(404).json({ error: 'No pricebook found for vendor' });
    }

    const priceBookingIds = priceBook.map((p) => p.id);

    const productPrice = await db.query.priceBookEntry.findMany({
      where: (t, { eq, and, inArray }) =>
        and(
          eq(t.productId, productId),
          inArray(t.priceBookingId, priceBookingIds)
        ),
    });

    if (!productPrice) {
      return res
        .status(404)
        .json({ error: 'Price not found for this product' });
    }

    return res.json({
      message: 'Price fetched successfully',
      vendorId,
      price: productPrice,
    });
  } catch (err) {
    console.error('Price Fetch Error:', err);
    return res
      .status(500)
      .json({ error: 'Server error fetching product price' });
  }
};

export const fetchAllProductTypes = async (req, res) => {
  try {
    const productTypes = await db.query.productTypes.findMany();
    return res.json({
      message: 'product type fetched successfully',
      productTypes: productTypes,
    });
  } catch (err) {
    console.error('product type Fetch Error:', err);
    return res
      .status(500)
      .json({ error: 'Server error fetching product type' });
  }
};

export const productByTypeId = async (req, res) => {
  try {
    const { productTypeId, page = 1, page_size = 12 } = req.query;

    if (!productTypeId) {
      return res.status(400).json({ error: 'productTypeId is required' });
    }

    const result = await paginate({
      table: products,
      select: products,
      where: eq(products.productTypeId, Number(productTypeId)),
      orderBy: products.createdAt,
      page: Number(page),
      page_size: Number(page_size),
    });

    const productsList = result.data;
    const vendorIds = [
      ...new Set(productsList.map((product) => product.vendorId)),
    ];

    const productIds = productsList.map((product) => product.productId);

    const priceBooks = await db.query.priceBook.findMany({
      where: (t, { eq, inArray, and }) =>
        and(inArray(t.vendorId, vendorIds), eq(t.isActive, true)),
    });

    const priceBookIds = priceBooks.map((book) => book.id);

    const priceEntries = await db.query.priceBookEntry.findMany({
      where: (t, { inArray, and }) =>
        and(
          inArray(t.productId, productIds),
          inArray(t.priceBookingId, priceBookIds)
        ),
    });

    const data = productsList.map((product) => ({
      ...product,
      prices: priceEntries.filter((p) => p.productId === product.productId),
    }));
    return res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      pagination: result.pagination,
      data,
    });
  } catch (error) {
    console.error('Error fetching products by type:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getAllProductsByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.params;
    if (categoryId) {
      const response = await db
        .select()
        .from(featuredProdcuts)
        .where(eq(featuredProdcuts.featuredCategoryId, categoryId))
        .orderBy(asc(featuredProdcuts.priority));

      const categoryWiseProducts = await Promise.all(
        response.map(async (featureProduct) => {
          const productId = featureProduct.productId;
          if (!productId) {
            return res.status(400).json({ error: 'Product ID is required.' });
          }
          const product = await db.query.products.findFirst({
            where: (t, { eq }) => eq(t.productId, Number(productId)),
          });
          if (!product) {
            return res.status(404).json({ error: 'Product not found' });
          }

          const vendorId = product.vendorId;

          const priceBook = await db.query.priceBook.findMany({
            where: (t, { eq, and }) =>
              and(eq(t.vendorId, vendorId), eq(t.isActive, true)),
          });

          if (!priceBook) {
            return res
              .status(404)
              .json({ error: 'No pricebook found for vendor' });
          }

          const priceBookingIds = priceBook.map((p) => p.id);

          const productPrice = await db.query.priceBookEntry.findMany({
            where: (t, { eq, and, inArray }) =>
              and(
                eq(t.productId, productId),
                inArray(t.priceBookingId, priceBookingIds)
              ),
          });

          if (!productPrice) {
            return res
              .status(404)
              .json({ error: 'Price not found for this product' });
          }
          const productDetail = await db
            .select()
            .from(products)
            .where(eq(products.productId, product.productId));
          return { ...productDetail[0], price: productPrice };
        })
      );

      return res.status(200).json({
        message: 'All products fetched successfully...',
        data: categoryWiseProducts,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllFeaturedCategories = async (req, res) => {
  try {
    const categories = await db
      .select({
        featuredCategoryId: featuredCategorys.id,
        products: sql`
          COALESCE(
            json_agg(
              json_build_object(
                'productId', ${products.productId},
                'vendorId', ${products.vendorId},
                'title', ${products.title},
                'description', ${products.description},
                'latitude', ${products.latitude},
                'longitude', ${products.longitude},
                'deliveryRadius', ${products.deliveryRadius},
                'isAvailable', ${products.isAvailable},
                'pricingType', ${products.pricingType},
                'minQuantity', ${products.minQuantity},
                'maxQuantity', ${products.maxQuantity},
                'status', ${products.status},
                'createdAt', ${products.createdAt},
                'updatedAt', ${products.updatedAt}
              )
            ) FILTER (WHERE ${products.productId} IS NOT NULL),
          '[]'
        )`,
      })
      .from(featuredCategorys)
      .leftJoin(
        featuredProdcuts,
        eq(featuredCategorys.id, featuredProdcuts.featuredCategoryId)
      )
      .leftJoin(products, eq(products.productId, featuredProdcuts.productId))
      .groupBy(featuredCategorys.id);

    const parsedCategories = categories.map((category) => ({
      ...category,
      products: Array.isArray(category.products)
        ? category.products
        : JSON.parse(category.products),
    }));

    const CategoryWithProductPricing = await Promise.all(
      parsedCategories.map(async (category) => {
        const productDataWithPricing = await Promise.all(
          category.products.map(async (product) => {
            const productId = product.productId;

            const dbProduct = await db.query.products.findFirst({
              where: (t, { eq }) => eq(t.productId, Number(productId)),
            });

            if (!dbProduct) return { ...product, price: [] };

            const vendorId = dbProduct.vendorId;

            const priceBook = await db.query.priceBook.findMany({
              where: (t, { eq, and }) =>
                and(eq(t.vendorId, vendorId), eq(t.isActive, true)),
            });

            if (!priceBook.length) return { ...product, price: [] };

            const priceBookingIds = priceBook.map((p) => p.id);

            const productPrice = await db.query.priceBookEntry.findMany({
              where: (t, { eq, and, inArray }) =>
                and(
                  eq(t.productId, productId),
                  inArray(t.priceBookingId, priceBookingIds)
                ),
            });

            return {
              ...product,
              price: productPrice || [],
            };
          })
        );

        return {
          ...category,
          products: productDataWithPricing,
        };
      })
    );

    return res.status(200).json({
      message: 'All categories fetched successfully...',
      data: CategoryWithProductPricing,
    });
  } catch (error) {
    console.error('Error: ', error);
    return res.status(500).json({ message: error.message });
  }
};

export const fetchProductDetailById = async (req, res) => {
  try {
    const { productId } = req.query;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required.' });
    }

    const product = await db.query.products.findFirst({
      where: (t, { eq }) => eq(t.productId, Number(productId)),
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const vendorId = product.vendorId;

    const priceBooks = await db.query.priceBook.findMany({
      where: (t, { eq, and }) =>
        and(eq(t.vendorId, vendorId), eq(t.isActive, true)),
    });

    if (priceBooks.length === 0) {
      return res
        .status(404)
        .json({ error: 'No active pricebook found for vendor.' });
    }

    const priceBookIds = priceBooks.map((pb) => pb.id);

    const productPrices = await db.query.priceBookEntry.findMany({
      where: (t, { eq, inArray, and }) =>
        and(
          eq(t.productId, Number(productId)),
          inArray(t.priceBookingId, priceBookIds)
        ),
    });

    if (productPrices.length === 0) {
      return res
        .status(404)
        .json({ error: 'Price not found for this product.' });
    }

    const productMediaList = await db.query.productMedia.findMany({
      where: (t, { eq }) => eq(t.productId, Number(productId)),
    });

    return res.json({
      message: 'Product details & price fetched successfully',
      product: {
        ...product,
        prices: productPrices,
        media: productMediaList,
      },
    });
  } catch (err) {
    console.error('Price Fetch Error:', err);
    return res
      .status(500)
      .json({ error: 'Server error fetching product price.' });
  }
};

export const listAllPriceBooksById = async (req, res) => {
  try {
    const { id } = req.params;
    const priceBooks = await db
      .select()
      .from(priceBookEntry)
      .innerJoin(priceBook, eq(priceBookEntry.priceBookingId, priceBook.id))
      .where(eq(priceBookEntry.productId, id))
      .then((data) => data.map((data) => data.price_book));

    if (!priceBooks.length) {
      return res.status(404).json({ message: 'No PriceBooks found.' });
    }

    return res.status(200).json({
      message: 'All priceBooks fetched successfully...',
      data: priceBooks,
    });
  } catch (error) {
    console.error('Price Fetch Error:', error);
    return res.status(500).json({ error: error.message });
  }
};

export const deletePriceBookById = async (req, res) => {
  try {
    const { priceBookId } = req.params;
    const existing = await db
      .select()
      .from(priceBook)
      .where(eq(priceBook.id, priceBookId));

    if (!existing.length) {
      return res.status(404).json({ message: 'Pricebook not found.' });
    }

    await db.delete(priceBook).where(eq(priceBook.id, priceBookId));

    return res.status(200).json({
      message: 'Pricebook deleted successfully!',
    });
  } catch (error) {
    console.error('PriceBook Delete Error:', error);
    return res.status(500).json({ error: 'Internal Server Error.' });
  }
};

export const updatePriceBookById = async (req, res) => {
  try {
    const { priceBookId } = req.params;
    const { pricingType, listPrice, currency } = req.body;

    const pricEntry = await db
      .select()
      .from(priceBookEntry)
      .where(eq(priceBookEntry.priceBookingId, priceBookId));

    if (pricEntry.length > 0) {
      await db
        .update(products)
        .set({ pricingType: pricingType || 'tier' })
        .where(eq(products.productId, pricEntry[0].productId));
      if (pricingType == 'flat') {
        await db
          .delete(priceBookEntry)
          .where(
            eq(priceBookEntry.priceBookingId, pricEntry[0].priceBookingId)
          );
        await db.insert(priceBookEntry).values({
          productId: pricEntry[0].productId,
          priceBookingId: priceBookId,
          currency: currency || 'USD',
          lowerSlab: null,
          upperSlab: null,
          listPrice: listPrice,
          discountPercentage: null,
          salePrice: listPrice,
        });
      } else {
        await db
          .delete(priceBookEntry)
          .where(
            eq(priceBookEntry.priceBookingId, pricEntry[0].priceBookingId)
          );

        const Entries = req.body.map((data) => ({
          productId: pricEntry[0].productId,
          priceBookingId: priceBookId,
          currency: data.currency,
          lowerSlab: data.lowerSlab,
          upperSlab: data.upperSlab,
          listPrice: data.listPrice,
          discountPercentage: data.discountPercentage,
          salePrice: data.salePrice,
        }));

        await db.insert(priceBookEntry).values(Entries);
      }
    } else {
      return res.status(404).json({
        message: 'No Price entry found.',
      });
    }

    return res.status(200).json({
      message: 'priceBook updated successfully!',
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
};

export const updateProductById = async (req, res) => {
  try {
    const data = req.body;

    const { productId } = req.params;
    const product = await db
      .select()
      .from(products)
      .where(eq(products.productId, productId));

    if (!product.length) {
      return res.status(404).json({
        message: 'No service found.',
      });
    }

    await db
      .update(products)
      .set({
        bannerImage: data.bannerImage,
        title: data.title,
        description: data.description,
        type: data.type,
      })
      .where(eq(products.productId, productId))
      .returning();
    if (data.videoUrl) {
      const existingVideo = await db
        .select()
        .from(productMedia)
        .where(
          and(
            eq(productMedia.productId, productId),
            eq(productMedia.mediaType, 'video')
          )
        )
        .limit(1);

      if (existingVideo.length > 0) {
        await db
          .update(productMedia)
          .set({ mediaUrl: data.videoUrl })
          .where(eq(productMedia.id, existingVideo[0].id));
      } else {
        await db.insert(productMedia).values({
          productId: productId,
          mediaType: 'video',
          mediaUrl: data.videoUrl,
          sortOrder: 3,
        });
      }
    }

    if (data.additionalImages.length > 0) {
      const additionalImages = data?.additionalImages?.map(
        (mediaUrl, index) => {
          return {
            productId: productId,
            mediaType: 'image',
            mediaUrl: mediaUrl,
            sortOrder: index,
          };
        }
      );

      await db.insert(productMedia).values(additionalImages);
    }

    return res.status(200).json({
      message: 'Service updated successfully!',
    });
  } catch (error) {
    console.error(' Error:', error);
    return res.status(500).json({ error: error.message });
  }
};

export const deleteProductImage = async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(productMedia).where(eq(productMedia.id, id));
    return res.status(200).json({
      message: 'Image deleted successfully!',
    });
  } catch (error) {
    console.error(' Error:', error);
    return res.status(500).json({ error: error.message });
  }
};

export const createVendorDocument = async (req, res) => {
  try {
    const parsed = JSON.parse(req.user?.['custom:vendor_ids']);
    const vendorId = parsed?.vendorId;
    const allDocuments = req.body;

    if (!vendorId) {
      return res.status(404).json({
        message: 'Vendor not found.',
      });
    }

    if (allDocuments.length > 0) {
      const documents = allDocuments?.map((doc) => {
        return {
          vendorId: vendorId,
          documentUrl: doc.filePath,
          documentType: doc.documentType,
        };
      });

      await db.insert(vendorDocuments).values(documents);
      return res.status(200).json({
        message: 'Vendor document created successfully!',
      });
    } else {
      return res.status(404).json({
        message: 'please upload document.',
      });
    }
  } catch (error) {
    console.error(' Error:', error);
    return res.status(500).json({ error: error.message });
  }
};

export const updateVendorDocument = async (req, res) => {
  try {
    const parsed = JSON.parse(req.user?.['custom:vendor_ids']);
    const vendorId = parsed?.vendorId;
    const { id, documentType, documentURL } = req.body;
    if (!vendorId) {
      return res.status(404).json({
        message: 'Vendor not found.',
      });
    }

    await db
      .update(vendorDocuments)
      .set({ documentType: documentType, documentUrl: documentURL })
      .where(eq(vendorDocuments.id, id));

    return res.status(200).json({
      message: 'Vendor document updated successfully!',
    });
  } catch (error) {
    console.error(' Error:', error);
    return res.status(500).json({ error: error.message });
  }
};

export const deleteVendorDocument = async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const document = await db
        .select()
        .from(vendorDocuments)
        .where(eq(vendorDocuments.id, id));
      if (document.length > 0) {
        await db.delete(vendorDocuments).where(eq(vendorDocuments.id, id));
        return res.status(200).json({
          message: 'Vendor document deleted successfully!',
        });
      } else {
        return res.status(504).json({
          message: 'document not found!',
        });
      }
    }
  } catch (error) {
    console.error(' Error:', error);
    return res.status(500).json({ error: error.message });
  }
};

export const getVendorDocuments = async (req, res) => {
  try {
    const parsed = JSON.parse(req.user?.['custom:vendor_ids']);
    const vendorId = parsed?.vendorId;
    if (!vendorId) {
      return res.status(404).json({
        message: 'Vendor not found.',
      });
    }

    const response = await db
      .select()
      .from(vendorDocuments)
      .where(eq(vendorDocuments.vendorId, vendorId))
      .orderBy(asc(vendorDocuments.documentType));
    return res.status(200).json({
      message: 'Vendor document fetched successfully!',
      data: response,
    });
  } catch (error) {
    console.error(' Error:', error);
    return res.status(500).json({ error: error.message });
  }
};

export const getVendorCompanyInfo = async (req, res) => {
  try {
    const parsed = JSON.parse(req.user?.['custom:vendor_ids']);
    const vendorId = parsed?.vendorId;
    if (!vendorId) {
      return res.status(404).json({
        message: 'No vendor found.',
      });
    }
    const [vendorData] = await db
      .select()
      .from(vendors)
      .where(eq(vendors.vendorId, vendorId));

    return res.status(200).json({
      message: 'Vendor info fetched successfully.',
      data: vendorData,
    });
  } catch (error) {
    console.error('Error: ', error);
    return res.status(500).json({ message: error.message });
  }
};

export const getVendorOwnershipDetails = async (req, res) => {
  try {
    const parsed = JSON.parse(req.user?.['custom:vendor_ids']);
    const vendorId = parsed?.vendorId;
    if (!vendorId) {
      return res.status(404).json({
        message: 'No vendor found.',
      });
    }
    const ownershipData = await db
      .select()
      .from(vendorOwnerships)
      .where(eq(vendorOwnerships.vendorId, vendorId));

    return res.status(200).json({
      message: 'Vendor ownership details fetched successfully.',
      data: ownershipData,
    });
  } catch (error) {
    console.error('Error: ', error);
    return res.status(500).json({ message: error.message });
  }
};

export const getVendorEmployees = async (req, res) => {
  try {
    const parsed = JSON.parse(req.user?.['custom:vendor_ids']);
    const vendorId = parsed?.vendorId;
    if (!vendorId) {
      return res.status(404).json({
        message: 'No vendor found.',
      });
    }
    const employees = await db
      .select()
      .from(vendorEmployees)
      .innerJoin(users, eq(vendorEmployees.userId, users.userId))
      .where(eq(vendorEmployees.vendorId, vendorId));

    return res.status(200).json({
      message: 'Vendor employees fetched successfully.',
      data: employees,
    });
  } catch (error) {
    console.error('Error: ', error);
    return res.status(500).json({ message: error.message });
  }
};

export const createVendorEmployeeInvitation = async (req, res) => {
  try {
    const parsed = JSON.parse(req.user?.['custom:vendor_ids']);
    const vendorId = parsed?.vendorId;
    const invitations = req.body;
    if (!vendorId) {
      return res.status(404).json({
        message: 'No vendor found.',
      });
    }

    if (invitations.length > 0) {
      const invites = invitations.map((invit) => {
        return {
          vendorId: vendorId,
          email: invit.email,
          permissions: invit.permissions.map((permssion) => permssion.value),
        };
      });
      await db.insert(vendorInvites).values(invites);
    }

    return res.status(200).json({
      message: 'Employees Invitation sent successfully.',
    });
  } catch (error) {
    console.error('Error: ', error);
    return res.status(500).json({ message: error.message });
  }
};

export const updateEmployeePermissions = async (req, res) => {
  try {
    const parsed = JSON.parse(req.user?.['custom:vendor_ids']);
    const vendorId = parsed?.vendorId;
    const permissions = req.body;
    const { employeeId } = req.params;

    if (!vendorId) {
      return res.status(404).json({
        message: 'No vendor found.',
      });
    }

    await db
      .update(vendorEmployees)
      .set({ permissions: permissions })
      .where(eq(vendorEmployees.vendorEmployeeId, employeeId));
    return res.status(200).json({
      message: 'Permissions updated  successfully.',
    });
  } catch (error) {
    console.error('Error: ', error);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteVendorEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const employee = await db
        .select()
        .from(vendorEmployees)
        .where(eq(vendorEmployees.vendorEmployeeId, id));
      if (employee.length > 0) {
        await db
          .delete(vendorEmployees)
          .where(eq(vendorEmployees.vendorEmployeeId, id));
        return res.status(200).json({
          message: 'Vendor employee deleted successfully!',
        });
      } else {
        return res.status(504).json({
          message: 'employee not found!',
        });
      }
    }
  } catch (error) {
    console.error(' Error:', error);
    return res.status(500).json({ error: error.message });
  }
};

export const getVendorInvites = async (req, res) => {
  try {
    const userEmail = req.user.email;

    const userInviteFound = await db
      .select()
      .from(vendorInvites)
      .where(eq(vendorInvites.email, userEmail));

    if (userInviteFound.length > 0) {
      const vendorInfo = (
        await Promise.all(
          userInviteFound.map((user) =>
            db.select().from(vendors).where(eq(vendors.vendorId, user.vendorId))
          )
        )
      ).flat();

      return res.status(200).json({
        message: 'Vendor invites fetched successfully.',
        data: vendorInfo,
      });
    } else {
      return res.status(200).json({
        message: 'No vendor Invites found.',
        data: [],
      });
    }
  } catch (error) {
    console.error('Error: ', error);
    return res.status(500).json({ message: error.message });
  }
};

export const requestedVendors = async (req, res) => {
  try {
    const { text = '' } = req.query;
    const filters = [];

    if (text && text.trim() !== '') {
      filters.push(ilike(vendors.legalEntityName, `%${text}%`));
    }

    const whereClause = filters.length > 0 ? and(...filters) : undefined;

    const Vendors = await db
      .select(reducedVendorFields)
      .from(vendors)
      .where(whereClause);

    return res.json({
      message: 'Vendors fetched successfully',
      data: Vendors,
    });
  } catch (error) {
    console.error('Error listing vendors:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const createVendorEmployeeRequest = async (req, res) => {
  try {
    const userId = req.user?.['custom:user_id'];
    const { vendorId } = req.body;

    const EmployeeRequest = await db
      .select()
      .from(vendorEmployeeRequests)
      .where(
        and(
          eq(vendorEmployeeRequests.userId, userId),
          eq(vendorEmployeeRequests.vendorId, vendorId)
        )
      );

    if (EmployeeRequest.length > 0) {
      return res.status(409).json({
        message: 'Request already exists',
      });
    } else {
      await db
        .insert(vendorEmployeeRequests)
        .values({ vendorId: vendorId, userId: userId });

      return res.status(200).json({
        message: 'Employee request created successfully',
      });
    }
  } catch (error) {
    console.log('error', error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getVendorNotifications = async (req, res) => {
  try {
    const parsed = JSON.parse(req.user?.['custom:vendor_ids']);
    const vendorId = parsed?.vendorId;

    if (!vendorId) {
      return res.status(404).json({ message: 'No vendor found.' });
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const notifications = await db.execute(sql`
  SELECT *,
         COUNT(*) OVER()::int AS total_count
  FROM vendor_notification
  WHERE vendor_id = ${vendorId}
  LIMIT ${limit} OFFSET ${offset}
`);

    const totalCount = notifications[0]?.total_count || 0;

    const hasNextPage = offset + notifications.length < totalCount;

    return res.status(200).json({
      message: 'Notifications fetched successfully.',
      data: notifications,
      hasNextPage,
      nextPage: hasNextPage ? page + 1 : null,
      totalCount,
    });
  } catch (error) {
    console.log('error', error);
    return res.status(500).json({ message: error.message });
  }
};

export const getAllSearchItems = async (req, res) => {
  try {
    const { search_type, search_text } = req.query;
    if (search_type === 'bookings') {
      const userId = req.user?.['custom:user_id'];
      const filters = [];

      filters.push(eq(bookingDraft.userId, userId));

      if (search_text && search_text.trim() !== '') {
        filters.push(ilike(bookingDraft.name, `%${search_text}%`));
      }

      const searchItems = await db
        .select()
        .from(bookingDraft)
        .where(and(...filters));

      return res.status(200).json({
        message: 'Search items fetched successfully.',
        data: searchItems,
      });
    } else {
      const parsed = JSON.parse(req.user?.['custom:vendor_ids']);
      const vendorId = parsed?.vendorId;
      const filters = [];

      filters.push(eq(products.vendorId, vendorId));

      if (search_text && search_text.trim() !== '') {
        filters.push(ilike(products.title, `%${search_text}%`));
      }

      const searchItems = await db
        .select()
        .from(products)
        .where(and(...filters));
      return res.status(200).json({
        message: 'Search items fetched successfully.',
        data: searchItems,
      });
    }
  } catch (error) {
    console.log('error', error);
    return res.status(500).json({
      message: error.message,
    });
  }
};
