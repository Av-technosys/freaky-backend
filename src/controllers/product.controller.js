import { eq, sql } from 'drizzle-orm';
import { db } from '../../db/db.js';
import { reviewMedia, reviews } from '../../db/schema.js';

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
