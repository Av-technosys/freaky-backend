import { eq, sql, and, asc, isNull } from 'drizzle-orm';
import { db } from '../../db/db.js';
import {
  productMedia,
  productTypes,
  reviewMedia,
  reviews,
} from '../../db/schema.js';
import { products, vendors } from '../../db/schema.js';
import { paginate } from '../helpers/paginate.js';

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

    const { vendorId } = JSON.parse(req.user['custom:vendor_ids']);

    const filters = [eq(products.vendorId, vendorId)];

    if (text.trim()) {
      filters.push(ilike(products.title, `%${text}%`));
    }

    const whereClause = and(...filters);

    const result = await paginate({
      table: products,
      select: products,
      where: whereClause,
      orderBy: products.createdAt,
      page,
      page_size,
    });

    return res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      ...result,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllProductTypes = async (req, res) => {
  try {
    const data = await db
      .select({
        id: productTypes.id,
        name: productTypes.name,
        mediaURL: productTypes.mediaURL,
        altText: productTypes.altText,
      })
      .from(productTypes)
      .where(isNull(productTypes.productParentId))
      .orderBy(asc(productTypes.createdAt));

    return res.status(200).json({
      success: true,
      message: 'Product types fetched successfully',
      data: data,
    });
  } catch (error) {
    console.error('Error fetching product types:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProductById = async (req, res) => {
  const { productId } = req.params;

  try {
    await db.transaction(async (tx) => {
      await tx
        .delete(productMedia)
        .where(eq(productMedia.productId, productId));

      await tx.delete(products).where(eq(products.productId, productId));
    });

    return res.status(200).json({
      success: true,
      message: 'Product Deleted Successfully',
    });
  } catch (error) {
    console.error('Error while deleting product:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
