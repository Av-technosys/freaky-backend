import { eq, sql } from 'drizzle-orm';
import { db } from '../../db/db.js';
import {
  cart,
  reviewMedia,
  reviews,
  userAddresses,
  userNotifications,
  users,
} from '../../db/schema.js';
import { removePassowrd } from '../helpers/User.helper.js';
import { paginate } from '../helpers/paginate.js';
import { sendNotificationToUser } from '../helpers/SendNotification.js';
import { bookingDraft } from '../../db/schema.js';
import { createBookingDraft } from '../helpers/createBookingDraft.js';
import { SOURCE, STATUS } from '../../const/global.js';

export const getUserInfo = async (req, res) => {
  try {
    const email = req.user?.email || req.body.email;

    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json({
      message: 'User info fetched successfully.',
      data: removePassowrd(user),
    });
  } catch (err) {
    console.error('Error fetching user info:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
export const updateUserInfo = async (req, res) => {
  try {
    const email = req.user?.email || req.body.email;

    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const userId = user.userId;

    const allowedFields = ['firstName', 'lastName', 'profileImage', 'gender'];
    const updateData = Object.fromEntries(
      Object.entries(req.body).filter(
        ([key, value]) => allowedFields.includes(key) && value !== undefined
      )
    );

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update.' });
    }

    // Update user info
    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.userId, userId))
      .returning();

    return res.status(200).json({
      message: 'User profile updated successfully.',
      data: removePassowrd(updatedUser),
    });
  } catch (err) {
    console.error('Error updating user info:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export const addAddress = async (req, res) => {
  try {
    const {
      title,
      addressLineOne,
      addressLineTwo,
      reciverName,
      reciverNumber,
      city,
      state,
      postalCode,
      country,
      latitude,
      longitude,
    } = req.body;

    const email = req.user?.email || req.body.email;

    const requiredFields = {
      title,
      addressLineOne,
      reciverName,
      reciverNumber,
      city,
      state,
      postalCode,
      country,
      latitude,
      longitude,
    };

    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value) return res.status(400).json({ error: `${key} is required.` });
    }

    // Fetch User
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    // if user is not present
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const userId = user.userId;

    // await db.insert(userAddresses).values({
    //   userId,
    //   address: req.body.address,
    // });

    await db.execute(sql`
    INSERT INTO user_address (user_id, title, address_line_one, address_line_two, reciver_name, reciver_number, city, state, postal_code, country, latitude, longitude, location)
    VALUES (
      ${userId},
      ${title},
      ${addressLineOne},
      ${addressLineTwo},
      ${reciverName},
      ${reciverNumber},
      ${city},
      ${state},
      ${postalCode},
      ${country},
      ${latitude},
      ${longitude},
      ${sql`ST_SetSRID(ST_MakePoint(${latitude}, ${longitude}), 4326)::geography`}
    );
  `);

    return res.status(201).json({
      message: 'Address added successfully.',
    });
  } catch (err) {
    console.error('Error fetching user info:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export const listAllAddresses = async (req, res) => {
  try {
    const email = req.user?.email || req.body.email;

    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const userId = user.userId;

    const response = await db.query.userAddresses.findMany({
      where: (userAddresses, { eq }) => eq(userAddresses.userId, userId),
    });

    return res.status(200).json({
      message: 'Address added successfully.',
      data: response,
    });
  } catch (err) {
    console.error('Error fetching user info:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const userId = req.user['custom:user_id'];
    if (!userId) {
      return res.status(500).json({ error: 'User not found.' });
    }

    const response = await db.query.reviews.findMany({
      where: (reviews, { eq }) => eq(reviews.userId, userId),
    });

    const reviewslist = response;

    const newReviewsResponse = await Promise.all(
      reviewslist.map(async (review) => {
        const review_media = await db.query.reviewMedia.findMany({
          where: (reviewMedia, { eq }) =>
            eq(reviewMedia.reviewId, review.reviewId),
        });

        return { ...review, review_media: [review_media] };
      })
    );

    return res.status(200).json({
      message: 'Reviews fetched successfully.',
      data: newReviewsResponse,
    });
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const editAddresses = async (req, res) => {
  try {
    const {
      id,
      title,
      addressLineOne,
      addressLineTwo,
      reciverName,
      reciverNumber,
      city,
      state,
      postalCode,
      country,
      latitude,
      longitude,
    } = req.body;
    const email = req.user?.email || req.body.email;

    const requiredFields = {
      title,
      addressLineOne,
      reciverName,
      reciverNumber,
      city,
      state,
      postalCode,
      country,
      latitude,
      longitude,
    };

    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value) return res.status(400).json({ error: `${key} is required.` });
    }

    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const userId = user.userId;

    await db.execute(sql`
      UPDATE user_address
      SET
        title = ${title},
        address_line_one = ${addressLineOne},
        address_line_two = ${addressLineTwo},
        reciver_name = ${reciverName},
        reciver_number = ${reciverNumber},
        city = ${city},
        state = ${state},
        postal_code = ${postalCode},
        country = ${country},
        latitude = ${latitude},
        longitude = ${longitude},
        location = ${sql`ST_SetSRID(ST_MakePoint(${latitude}, ${longitude}), 4326)::geography`}
      WHERE user_id = ${userId} AND id = ${id}; 
    `);

    return res.status(200).json({
      message: 'Address updated successfully.',
    });
  } catch (err) {
    console.error('Error updating address:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export const setCurrentAddress = async (req, res) => {
  try {
    const email = req.user?.email || req.body.email;

    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const userId = user.userId;

    const data = req.body;
    const { id } = data;

    if (!id) {
      return res.status(400).json({ error: 'Address ID is required.' });
    }

    await db
      .update(users)
      .set({ currentAddressId: id })
      .where(eq(users.userId, userId));

    const response = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.userId, userId),
    });

    return res.status(200).json({
      message: 'Address saved successfully.',
      data: response,
    });
  } catch (err) {
    console.error('Error saving address:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export const fetchCurrentAddress = async (req, res) => {
  try {
    const addressId = Number(req.params.id);
    const email = req.user?.email || req.body.email;

    if (!addressId) {
      return res.status(400).json({ error: 'Address ID is required.' });
    }

    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const response = await db.query.userAddresses.findFirst({
      where: (userAddresses, { eq, and }) =>
        and(
          eq(userAddresses.id, addressId),
          eq(userAddresses.userId, user.userId)
        ),
    });

    if (!response) {
      return res.status(404).json({ error: 'Address not found.' });
    }

    return res.status(200).json({
      message: 'Address fetched successfully.',
      data: response,
    });
  } catch (err) {
    console.error('Error fetching address:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'addressId is required.' });
    }

    // Find address
    const address = await db.query.userAddresses.findFirst({
      where: (userAddresses, { eq }) => eq(userAddresses.id, id),
    });

    if (!address) {
      return res.status(404).json({ error: 'Address not found.' });
    }

    // Delete address
    await db.delete(userAddresses).where(eq(userAddresses.id, id));

    return res.status(204).json({ message: 'Address deleted successfully.' });
  } catch (err) {
    if (err?.cause?.code === '23503') {
      return res.status(400).json({
        success: false,
        message:
          'You cannot delete this address because it is set as your current address.',
      });
    }

    console.error('Error deleting address:', err);
    return res.status(500).json({ error: 'Error deleting address.' });
  }
};

export const cartHandler = async (req, res) => {
  try {
    const email = req.user?.email || req.body.email;

    const user = await db.query.users.findFirst({
      where: (user, { eq }) => eq(user.email, email),
    });

    const userId = user.userId;
    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    let userCart = await db.query.cart.findFirst({
      where: (t, { eq }) => eq(t.userId, userId),
    });

    if (req.method === 'GET') {
      if (!userCart) {
        return res.json({
          message: 'Cart is empty',
          cartId: null,
          items: [],
        });
      }

      const items = await db
        .select()
        .from(bookingDraft)
        .where(eq(bookingDraft.sourceId, userCart.cartId));

      return res.json({
        cartId: userCart.cartId,
        items,
      });
    }

    if (req.method === 'POST') {
      if (!userCart) {
        const newCart = await db.insert(cart).values({ userId }).returning();
        userCart = newCart[0];
      }

      const cartId = userCart.cartId;

      const {
        productId,
        quantity,
        name,
        contactNumber,
        date,
        minGuestCount,
        maxGuestCount,
        latitude,
        longitude,
      } = req.body;

      if (!productId) {
        return res.status(400).json({ error: 'productId required' });
      }
      if (!quantity) {
        return res.status(400).json({ error: 'quantity required' });
      }
      if (!cartId) {
        return res.status(400).json({ error: 'CartId not Provided' });
      }
      if (!date) {
        return res.status(400).json({ error: 'date is required' });
      }
      const existing = await db.query.bookingDraft.findFirst({
        where: (t, { eq, and }) =>
          and(eq(t.sourceId, cartId), eq(t.productId, productId)),
      });

      if (existing) {
        return res.json({
          message: 'item already exists',
        });
      }

      const newItem = await createBookingDraft({
        source: SOURCE.CART,
        sourceId: cartId,
        productId,
        quantity,
        status: STATUS.HOLD,

        contactName: name,
        contactNumber,
        startTime: new Date(date),
        minGuestCount,
        maxGuestCount,
        latitude,
        longitude,
      });

      return res.json({
        message: 'Item added to cart',
        // item: newItem[0],
      });
    }

    if (req.method === 'DELETE') {
      const { bookingDraftId } = req.params;

      if (!bookingDraftId) {
        return res.status(400).json({ error: 'booking draft id required' });
      }

      const item = await db.query.bookingDraft.findFirst({
        where: (t, { eq }) => eq(t.bookingDraftId, Number(bookingDraftId)),
      });

      // if (!item) {
      //   return res.status(404).json({ error: 'Item not found' });
      // }

      await db
        .delete(bookingDraft)
        .where(eq(bookingDraft.bookingDraftId, Number(bookingDraftId)));

      return res.json({
        message: 'Item removed from cart',
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Cart API Error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const profilePictureHandler = async (req, res) => {
  try {
    const email = req.user?.email || req.body.email;

    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (req.method === 'POST') {
      const { profileImage } = req.body;

      if (!profileImage) {
        return res
          .status(400)
          .json({ error: 'Profile image URL is required.' });
      }

      await db
        .update(users)
        .set({ profileImage })
        .where(eq(users.userId, user.userId))
        .returning();

      return res.status(200).json({
        message: 'Profile image saved successfully.',
      });
    }

    if (req.method === 'DELETE') {
      await db
        .update(users)
        .set({ profileImage: null })
        .where(eq(users.userId, user.userId))
        .returning();

      return res.status(200).json({
        message: 'Profile image deleted successfully.',
      });
    }

    return res.status(405).json({ error: 'Method not allowed.' });
  } catch (err) {
    console.error('Error updating profile image:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export const addReview = async (req, res) => {
  try {
    const { eventId, eventRating, description, products } = req.body;

    if (!eventId) return res.status(400).json({ error: 'eventId is required' });
    if (!eventRating)
      return res.status(400).json({ error: 'eventRating is required' });
    if (!description)
      return res.status(400).json({ error: 'title is required' });

    const userId = req.user['custom:user_id'];

    // create event rating
    await db
      .insert(reviews)
      .values({
        userId,
        eventId,
        rating: eventRating,
        description,
      })
      .returning();

    if (!products || products.length === 0) {
      return res.status(200).json({
        message: 'Event rating added',
      });
    }
    await Promise.all(
      products.map(async (product) => {
        const { productId, description, rating, media } = product;

        if (!productId || !rating) {
          throw new Error('Product review data missing fields');
        }

        const productData = await db.query.products.findFirst({
          where: (product, { eq }) => eq(product.productId, productId),
        });

        if (!productData) {
          throw new Error('Product not found');
        }

        const vendorId = productData.vendorId;

        const [reviewRecord] = await db
          .insert(reviews)
          .values({
            userId,
            eventId,
            vendorId,
            productId,
            rating,
            description,
          })
          .returning();

        const reviewId = reviewRecord.reviewId;

        if (media && media.length > 0) {
          const mediaRows = media.map((file) => ({
            reviewId,
            mediaUrl: file.mediaUrl,
            mediaType: file.mediaType,
          }));

          await db.insert(reviewMedia).values(mediaRows);
        }
      })
    );

    return res.status(200).json({
      message: 'Reviews saved successfully',
    });
  } catch (err) {
    console.error('Error while adding review:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.body;

    if (!reviewId) {
      return res.status(400).json({
        success: false,
        message: 'reviewId is required',
      });
    }

    await db.delete(reviewMedia).where(eq(reviewMedia.reviewId, reviewId));

    const deleted = await db
      .delete(review)
      .where(eq(review.reviewId, reviewId))
      .returning();

    if (deleted.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete review',
    });
  }
};

export const getUserNotification = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const userId = req.user['custom:user_id'];
    const page_size = Number(limit) || 20;

    const result = await paginate({
      table: userNotifications,
      select: userNotifications,
      where: eq(userNotifications.userId, userId),
      orderBy: userNotifications.createdAt,
      page,
      page_size,
    });

    return res.status(200).json({
      success: true,
      message: 'Notification fetched successfully..',
      ...result,
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server error',
    });
  }
};

export const markNotificationAsRead = async (req, res) => {
  const { notificationId } = req.body;
  await db
    .update(userNotifications)
    .set({ status: true })
    .where(eq(userNotifications.notificationId, notificationId))
    .returning();
  try {
    return res.status(200).json({
      success: true,
      message: 'Successfully marked as true',
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete review',
    });
  }
};

export const getPersonalInfo = async (req, res) => {
  try {
    const userId = req.user['custom:user_id'];

    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.userId, userId),
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json({
      message: 'User info fetched successfully.',
      data: removePassowrd(user),
    });
  } catch (err) {
    console.error('Error fetching user info:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export const updateDetails = async (req, res) => {
  try {
    const userId = req.user['custom:user_id'];
    const { firstName, lastName, number, profileImage } = req.body;

    if (userId) {
      await db
        .update(users)
        .set({
          firstName: firstName,
          lastName: lastName,
          number: number,
          profileImage: profileImage,
        })
        .where(eq(users.userId, userId));
      return res.status(200).json({
        message: 'User details updated successfully.',
      });
    }
    return res.status(404).json({
      message: 'user not found.',
    });
  } catch (error) {
    console.error('Error fetching user info:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export const saveFcmToken = async (req, res) => {
  try {
    const { userId, fcmToken, platform } = req.body;

    if (!userId || !fcmToken || !platform) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    await db
      .update(users)
      .set({
        firebaseToken: fcmToken,
        platform: platform,
        updatedAt: new Date(),
      })
      .where(eq(users.userId, userId));

    return res.json({ success: true });
  } catch (error) {
    console.error('FCM TOKEN SAVE ERROR', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const Notify = async (req, res) => {
  try {
    const { fcmToken, title, body, data } = req.body;

    const result = await sendNotificationToUser({
      fcmToken,
      title,
      body,
      data,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('Notify error:', error.message);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
