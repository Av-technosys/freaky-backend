import { eq, sql, and } from 'drizzle-orm';
import { db } from '../../db/db.js';
import { reviewMedia, reviews } from '../../db/schema.js';
import { products, vendors } from '../../db/schema.js';

export const getAllProductReviews = async (req, res) => {
  try {
    const { productid } = req.params;
    const productReviews = await db
      .select({
        reviewId: reviews.reviewId,
        productId: reviews.productId,
        userId: reviews.userId,
        eventId: reviews.eventId,
        vendorId: reviews.vendorId,
        rating: reviews.rating,
        title: reviews.title,
        description: reviews.description,
        createdAt: reviews.createdAt,
        reviewMedia: sql`
      json_agg(
        json_build_object(
          'reviewMediaId', ${reviewMedia.reviewMediaId},
          'reviewId', ${reviewMedia.reviewId},
          'mediaUrl', ${reviewMedia.mediaUrl},
          'mediaType', ${reviewMedia.mediaType},
          'createdAt', ${reviewMedia.createdAt},
          'updatedAt', ${reviewMedia.updatedAt}
        )
      ) FILTER (WHERE ${reviewMedia.reviewMediaId} IS NOT NULL)
    `.as('reviewMedia'),
      })
      .from(reviews)
      .leftJoin(reviewMedia, eq(reviewMedia.reviewId, reviews.reviewId))
      .where(eq(reviews.productId, productid))
      .groupBy(reviews.reviewId)
      .orderBy(reviews.reviewId);

    return res.status(200).json({
      message: 'Product Reviews Fetched Successfully.',
      data: productReviews,
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const { text = '', page = 1, page_size = 12 } = req.query;
    const limit = Number(page_size);
    const offset = (Number(page) - 1) * limit;

    const userId = req.user['custom:user_id'];

    const vendorData = await db
      .select({ vendorId: vendors.vendorId })
      .from(vendors)
      .where(eq(vendors.createdBy, userId));

    if (vendorData.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found for this user',
        data: [],
      });
    }

    const vId = vendorData[0].vendorId;

    const filters = [eq(products.vendorId, vId)];

    if (text && text.trim() !== '') {
      filters.push(ilike(products.title, `%${text}%`));
    }

    const whereClause = filters.length > 0 ? and(...filters) : undefined;

    const totalRows = await db
      .select({ count: sql`CAST(count(*) AS INTEGER)` })
      .from(products)
      .where(whereClause);

    const total = totalRows[0].count;

    const productsList = await db
      .select()
      .from(products)
      .where(whereClause)
      .orderBy(products.createdAt)
      .limit(limit)
      .offset(offset);

    return res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      pagination: {
        page: Number(page),
        page_size: limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
      data: productsList,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
