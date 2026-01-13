import { and, desc, eq, gte, sql } from 'drizzle-orm';
import { Router } from 'express';
import { reviewMedia, reviews, users } from './../../../db/schema.js';
import { db } from '../../../db/db.js';
const vendorReviewRouter = Router();

vendorReviewRouter.get('/', async (req, res) => {
  const { page, page_size, time } = req.query;

  const { vendorId } = JSON.parse(req.user['custom:vendor_ids']);

  const limit = Number(page_size);
  const offset = (Number(page) - 1) * limit;

  const filters = [];

  if (vendorId) {
    filters.push(eq(reviews.vendorId, vendorId));
  }
  const now = Date.now();

  try {
    if (time) {
      switch (time) {
        case 'recent':
          filters.push(
            gte(reviews.createdAt, new Date(now - 24 * 60 * 60 * 1000))
          );
          break;
        case 'last_week':
          filters.push(
            gt(reviews.createdAt, new Date(now - 7 * 24 * 60 * 60 * 1000))
          );
          break;
        case 'last_month':
          filters.push(
            gt(reviews.createdAt, new Date(now - 30 * 24 * 60 * 60 * 1000))
          );
          break;
        default:
          break;
      }
    }
  } catch (error) {
    console.log(error);
  }
  //   if (page) {
  //     filters.push(eq(reviews.page, page));
  //   }
  //   if (page_size) {
  //     filters.push(eq(reviews.page_size, page_size));
  //   }
  const whereClause = filters.length > 0 ? and(...filters) : undefined;

  try {
    const vnedorReviews = await db
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
      })
      .from(reviews)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .innerJoin(users, eq(reviews.userId, users.userId));

    return res
      .status(200)
      .json({ meddage: 'Review fetched successfully', data: vnedorReviews });
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

vendorReviewRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const review = await db
      .select({
        id: reviews.reviewId,
        productId: reviews.productId,
        vendorId: reviews.vendorId,
        title: reviews.title,
        description: reviews.description,
        rating: reviews.rating,
        createdAt: reviews.createdAt,
        userId: reviews.userId,
        userFirstName: users.firstName,
        userLastName: users.lastName,
        userImage: users.profileImage,
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
      .innerJoin(users, eq(reviews.userId, users.userId))
      .where(eq(reviews.reviewId, id))
      .groupBy(
        reviews.reviewId,
        reviews.productId,
        reviews.vendorId,
        reviews.title,
        reviews.description,
        reviews.rating,
        reviews.createdAt,
        reviews.userId,
        users.firstName,
        users.lastName,
        users.profileImage
      );
    return res
      .status(200)
      .json({ message: 'Review fetched successfully', data: review });
  } catch (error) {
    console.error('Error', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default vendorReviewRouter;
