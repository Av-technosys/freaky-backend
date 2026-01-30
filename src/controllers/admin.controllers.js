import { AdminSetUserPasswordCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognito, USER_POOL_ID } from '../../lib/cognitoClient.js';
import {
  eventType,
  featuredBanners,
  featuredCategorys,
  featuredProdcuts,
  pricingSettings,
  products,
  productTypes,
  reviews,
  users,
  vendors,
} from '../../db/schema.js';
import { db } from '../../db/db.js';
import { and, asc, desc, eq, gt, ilike, sql } from 'drizzle-orm';
import { paginate } from '../helpers/paginate.js';

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
    const { text = '' } = req.query;
    const filters = [];

    filters.push(eq(vendors.status, 'PENDING_ADMIN'));

    if (text && text.trim() !== '') {
      filters.push(ilike(vendors.businessName, `%${text}%`));
    }

    const whereClause = filters.length > 0 ? and(...filters) : undefined;

    const result = await paginate({
      table: vendors,
      select: {
        businessName: vendors.businessName,
        status: vendors.status,
        createdAt: vendors.createdAt,
        vendorId: vendors.vendorId,
      },
      where: whereClause,
      orderBy: vendors.createdAt,
      page: req.query.page,
      page_size: req.query.page_size,
    });

    return res.status(200).json({
      message: 'rejected vendors fetched successfully',
      ...result,
    });
  } catch (error) {
    console.error('error', error);
    return res.status(500).json({ message: error.message });
  }
};

export const listAllRejectedVendors = async (req, res) => {
  try {
    const { text = '' } = req.query;
    const filters = [];

    filters.push(eq(vendors.status, 'REJECTED'));

    if (text && text.trim() !== '') {
      filters.push(ilike(vendors.businessName, `%${text}%`));
    }

    const whereClause = filters.length > 0 ? and(...filters) : undefined;

    const result = await paginate({
      table: vendors,
      select: {
        businessName: vendors.businessName,
        status: vendors.status,
        createdAt: vendors.createdAt,
        vendorId: vendors.vendorId,
      },
      where: whereClause,
      orderBy: vendors.createdAt,
      page: req.query.page,
      page_size: req.query.page_size,
    });

    return res.status(200).json({
      message: 'rejected vendors fetched successfully',
      ...result,
    });
  } catch (error) {
    console.error('error', error);
    return res.status(500).json({ message: error.message });
  }
};

export const listAllVendors = async (req, res) => {
  try {
    const { text = '' } = req.query;
    const filters = [];

    filters.push(eq(vendors.status, 'APPROVED'));

    if (text && text.trim() !== '') {
      filters.push(ilike(vendors.businessName, `%${text}%`));
    }

    const whereClause = filters.length > 0 ? and(...filters) : undefined;
    const result = await paginate({
      table: vendors,
      select: {
        businessName: vendors.businessName,
        status: vendors.status,
        createdAt: vendors.createdAt,
        vendorId: vendors.vendorId,
      },
      where: whereClause,
      orderBy: vendors.createdAt,
      page: req.query.page,
      page_size: req.query.page_size,
    });

    return res.status(200).json({
      message: 'vendors fetched successfully',
      ...result,
    });
  } catch (error) {
    console.error('error', error);
    return res.status(500).json({ message: error.message });
  }
};

export const listAllUsers = async (req, res) => {
  try {
    const { text = '' } = req.query;
    const filters = [];

    if (text && text.trim() !== '') {
      filters.push(ilike(users.firstName, `%${text}%`));
    }

    const whereClause = filters.length > 0 ? and(...filters) : undefined;
    const result = await paginate({
      table: users,
      select: {
        firstName: users.firstName,
        lastName: users.lastName,
        number: users.number,
        createdAt: users.createdAt,
        userId: users.userId,
        isActive: users.isActive,
      },
      where: whereClause || '',
      orderBy: users.createdAt,
      page: req.query.page,
      page_size: req.query.page_size,
    });

    return res.status(200).json({
      message: 'users fetched successfully',
      ...result,
    });
  } catch (error) {
    console.error('error', error);
    return res.status(500).json({ message: error.message });
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
      .select({
        firstName: users.firstName,
        lastName: users.lastName,
        profileImage: users.profileImage,
        number: users.number,
        email: users.email,
        status: users.status,
        isActive: users.isActive,
        createdAt: users.createdAt,
      })
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

export const getAllUserReviews = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const reviewsData = await db
      .select({
        id: reviews.reviewId,
        productId: reviews.productId,
        vendorId: reviews.vendorId,
        title: reviews.title,
        description: reviews.description,
        rating: reviews.rating,
        createdAt: reviews.createdAt,
        userId: reviews.userId,
        userName: users.firstName,
        userImage: users.profileImage,
        totalCount: sql`COUNT(*) OVER()`.as('totalCount'),
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.userId))
      .orderBy(asc(reviews.createdAt))
      .limit(limit)
      .offset(offset);

    const totalCount = reviewsData.length > 0 ? reviewsData[0].totalCount : 0;

    const hasNextPage = offset + reviewsData.length < totalCount;

    return res.status(200).json({
      message: 'User Reviews fetched successfully.',
      data: reviewsData,
      hasNextPage,
      nextPage: hasNextPage ? page + 1 : null,
      totalCount,
    });
  } catch (error) {
    console.error('error', error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteReviewById = async (req, res) => {
  try {
    const { reviewId } = req.params;
    await db.delete(reviews).where(eq(reviews.reviewId, reviewId));

    return res.status(200).json({
      message: 'User Review  deleted successfully.',
    });
  } catch (error) {
    console.error('error', error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const createProductType = async (req, res) => {
  try {
    const { name, description, mediaURL, altText, adminApproval } = req.body;
    await db.insert(productTypes).values({
      name: name,
      description: description,
      mediaURL: mediaURL,
      altText: altText,
      isNewProductApproval: adminApproval,
    });

    return res.status(200).json({
      message: 'Product Type created successfully.',
    });
  } catch (error) {
    console.error('error', error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllProductTypes = async (req, res) => {
  try {
    const productTypesData = await db
      .select()
      .from(productTypes)
      .orderBy(asc(productTypes.name));
    return res.status(200).json({
      message: 'Product types fetched successfully.',
      data: productTypesData,
    });
  } catch (error) {
    console.error('error', error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateProductTypeById = async (req, res) => {
  try {
    const { productTypeId } = req.params;
    const { name, description, mediaURL, adminApproval } = req.body;
    await db
      .update(productTypes)
      .set({
        name: name,
        description: description,
        mediaURL: mediaURL,
        isNewProductApproval: adminApproval,
      })
      .where(eq(productTypes.id, productTypeId))
      .returning();

    return res.status(200).json({
      message: 'Product type updated successfully.',
    });
  } catch (error) {
    console.error('error', error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteProductTypeById = async (req, res) => {
  try {
    const { productTypeId } = req.params;
    await db.delete(productTypes).where(eq(productTypes.id, productTypeId));

    return res.status(200).json({
      message: 'Product Type deleted successfully.',
    });
  } catch (error) {
    console.error('error', error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateFeaturedBannerPriority = async (req, res) => {
  try {
    const { bannerId } = req.params;
    const { currentBannerPriority, nextBannerPriority } = req.body;

    await db.execute(sql`
  UPDATE ${featuredBanners}
  SET priority = CASE
    WHEN ${featuredBanners.id} = ${Number(bannerId)}
      THEN ${Number(nextBannerPriority)}
    WHEN ${featuredBanners.priority} = ${Number(nextBannerPriority)}
      THEN ${Number(currentBannerPriority)}
    ELSE ${featuredBanners.priority}
  END
  WHERE ${featuredBanners.id} = ${Number(bannerId)}
     OR ${featuredBanners.priority} = ${Number(nextBannerPriority)};
`);

    return res.status(200).json({
      message: 'Featured banner updated successfully.',
    });
  } catch (error) {
    console.error('error', error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteFeaturedBanner = async (req, res) => {
  try {
    const bannerId = Number(req.params.bannerId);
    const { priority } = req.body;
    await db.transaction(async (tx) => {
      const deletedPriority = priority;
      await tx.delete(featuredBanners).where(eq(featuredBanners.id, bannerId));
      await tx
        .update(featuredBanners)
        .set({
          priority: sql`${featuredBanners.priority} - 1`,
        })
        .where(gt(featuredBanners.priority, deletedPriority));
    });

    return res.status(200).json({
      message: 'Banner deleted successfully.',
    });
  } catch (error) {
    console.error('error', error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getFeaturedCategory = async (req, res) => {
  const response = await db
    .select()
    .from(featuredCategorys)
    .orderBy(asc(featuredCategorys.createdAt));
  try {
    return res.status(200).json({
      success: true,
      message: 'All Featured Category fetched successfully',
      data: response,
    });
  } catch (error) {
    console.error('Error', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createFeaturedCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    await db.insert(featuredCategorys).values({ name, description });
    return res.status(201).json({
      success: true,
      message: 'Featured Category created successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateFeaturedCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, description } = req.body;
    await db
      .update(featuredCategorys)
      .set({ name, description })
      .where(eq(featuredCategorys.id, categoryId));
    return res.status(200).json({
      success: true,
      message: 'Featured Category updated successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteFeaturedCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    await db
      .delete(featuredCategorys)
      .where(eq(featuredCategorys.id, categoryId));
    return res.status(200).json({
      success: true,
      message: 'Featured Category deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await db
      .select({
        id: featuredProdcuts.id,
        priority: featuredProdcuts.priority,
        productName: products.title,
        productImage: products.bannerImage,
        categoryName: featuredCategorys.name,
        categoryId: featuredCategorys.id,
      })
      .from(featuredProdcuts)
      .leftJoin(products, eq(products.productId, featuredProdcuts.productId))
      .leftJoin(
        featuredCategorys,
        eq(featuredCategorys.id, featuredProdcuts.featuredCategoryId)
      )
      .orderBy(asc(featuredProdcuts.priority));

    const groupedData = [];

    featuredProducts.forEach((item) => {
      const categoryName = item.categoryName || 'Uncategorized';

      let category = groupedData.find((c) => c.title === categoryName);
      if (!category) {
        category = {
          title: categoryName,
          categoryId: item.categoryId,
          products: [],
          count: 0,
        };
        groupedData.push(category);
      }

      category.products.push({
        id: item.id,
        name: item.productName,
        priority: item.priority,
        image: item.productImage,
      });
      category.count = category.products.length;
    });

    return res.status(200).json({
      success: true,
      message: 'Featured products fetched successfully',
      data: groupedData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateFeaturedProductPriority = async (req, res) => {
  try {
    const { productId } = req.params;
    const { currentProductPriority, nextProductPriority, categoryId } =
      req.body;

    await db.execute(sql`
  UPDATE ${featuredProdcuts}
  SET priority = CASE
    WHEN ${featuredProdcuts.id} = ${Number(productId)}
      THEN ${Number(nextProductPriority)}
    WHEN ${featuredProdcuts.priority} = ${Number(nextProductPriority)}
     AND ${featuredProdcuts.featuredCategoryId} = ${Number(categoryId)}
      THEN ${Number(currentProductPriority)}
    ELSE ${featuredProdcuts.priority}
  END
  WHERE (
      ${featuredProdcuts.id} = ${Number(productId)}
      OR ${featuredProdcuts.priority} = ${Number(nextProductPriority)}
    )
    AND ${featuredProdcuts.featuredCategoryId} = ${Number(categoryId)};
`);

    return res.status(200).json({
      message: 'Featured product updated successfully.',
    });
  } catch (error) {
    console.error('error', error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const createFeaturedProduct = async (req, res) => {
  try {
    const { serviceId, categoryId } = req.body;
    const result = await db
      .select({ count: sql`count(*)` })
      .from(featuredProdcuts)
      .where(eq(featuredProdcuts.featuredCategoryId, categoryId));

    const newPriority = Number(result[0].count) + 1;
    await db.insert(featuredProdcuts).values({
      productId: serviceId,
      featuredCategoryId: categoryId,
      priority: newPriority,
    });
    return res.status(201).json({
      success: true,
      message: 'Featured product created successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllPricingSettings = async (req, res) => {
  try {
    const pricingData = await db
      .select({
        id: pricingSettings.id,
        name: pricingSettings.name,
        description: pricingSettings.description,
        feePercentage: pricingSettings.feePercentage,
        createdAt: pricingSettings.createdAt,
      })
      .from(pricingSettings)
      .orderBy(asc(pricingSettings.createdAt));
    return res.status(200).json({
      success: true,
      message: 'Pricing settings fetched successfully',
      data: pricingData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createPricingSetting = async (req, res) => {
  try {
    const { name, description, feePercentage } = req.body;
    await db
      .insert(pricingSettings)
      .values({ name, description, feePercentage });
    return res.status(201).json({
      success: true,
      message: 'Pricing Setting created successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updatePricingSetting = async (req, res) => {
  try {
    const { pricingSettingId } = req.params;
    const { name, description, feePercentage } = req.body;
    await db
      .update(pricingSettings)
      .set({ name, description, feePercentage })
      .where(eq(pricingSettings.id, pricingSettingId));
    return res.status(200).json({
      success: true,
      message: 'Pricing Setting updated successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deletePricingSetting = async (req, res) => {
  try {
    const { pricingSettingId } = req.params;
    await db
      .delete(pricingSettings)
      .where(eq(pricingSettings.id, pricingSettingId));
    return res.status(200).json({
      success: true,
      message: 'Pricing Setting deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
