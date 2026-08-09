import { eq, sql, or, and, inArray } from 'drizzle-orm';
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
import { bookingDraft, events, products, priceBook, priceBookEntry } from '../../db/schema.js';
import { createBookingDraft } from '../helpers/createBookingDraft.js';
import { SOURCE, STATUS } from '../../const/global.js';
import { desc } from 'drizzle-orm'
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

    const allowedFields = ['firstName', 'lastName', 'profileImage', 'gender', 'number', 'birthDate', 'anniversary'];
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

    const userData = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (!userData) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const userId = userData.userId;

    const existingAddress = await db.execute(sql`
      SELECT id FROM user_address WHERE user_id = ${userId} LIMIT 1
    `);

    const rows = existingAddress?.rows || existingAddress || []
    const isFirstAddress = rows.length === 0
    const inserted = await db.execute(sql`
      INSERT INTO user_address (
        user_id,
        title,
        address_line_one,
        address_line_two,
        reciver_name,
        reciver_number,
        city,
        state,
        postal_code,
        country,
        latitude,
        longitude,
        is_default,
        location
      )
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
        ${isFirstAddress},
        ${sql`ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography`}
      )
      RETURNING id;
    `);

    const newAddressId =
      inserted?.rows?.[0]?.id ||
      inserted?.[0]?.id;

    if (!newAddressId) {
      console.log('INSERT RESPONSE:', inserted);
      return res.status(500).json({ error: 'Failed to insert address' });
    }
    if (isFirstAddress) {
      await db.execute(sql`
        UPDATE "user"
        SET current_address_id = ${newAddressId}
        WHERE user_id = ${userId}
      `);
    }

    return res.status(201).json({
      message: 'Address added successfully.',
    });

  } catch (err) {
    console.error('Error adding address:', err);
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
        location = ${sql`ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography`}
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

    if (req.method === 'GET' && req.params.bookingDraftId) {
      try {
        const { bookingDraftId } = req.params;

        if (!bookingDraftId) {
          return res.status(400).json({ error: 'bookingDraftId required' });
        }

        // 1️⃣ Fetch bookingDraft
        const booking = await db.query.bookingDraft.findFirst({
          where: (t, { eq }) => eq(t.bookingDraftId, Number(bookingDraftId)),
        });

        if (!booking) {
          return res.status(404).json({ error: 'Item not found' });
        }

        // 2️⃣ Fetch product
        const product = await db.query.products.findFirst({
          where: (t, { eq }) => eq(t.productId, booking.productId),
        });

        if (!product) {
          return res.status(404).json({ error: 'Product not found' });
        }

        // 3️⃣ Fetch default pricebook
        const defaultPB = await db.query.priceBook.findFirst({
          where: (t, { eq, and }) =>
            and(eq(t.vendorId, product.vendorId), eq(t.isDefault, true)),
        });

        if (!defaultPB) {
          return res.status(404).json({
            error: 'Default pricebook not found',
          });
        }

        // 4️⃣ Fetch price slabs
        const priceSlabs = await db.query.priceBookEntry.findMany({
          where: (t, { eq, and }) =>
            and(
              eq(t.productId, product.productId),
              eq(t.priceBookingId, defaultPB.id)
            ),
          orderBy: (t, { asc }) => asc(t.lowerSlab),
        });

        // 5️⃣ Pick correct slab based on guest count
        const guestCount = booking.maxGuestCount || booking.minGuestCount || 1;

        let selectedPrice = priceSlabs.find(
          (slab) =>
            guestCount >= slab.lowerSlab &&
            (!slab.upperSlab || guestCount <= slab.upperSlab)
        );

        if (!selectedPrice) {
          selectedPrice = priceSlabs[0];
        }

        const unitPrice = Number(
          selectedPrice?.salePrice || selectedPrice?.listPrice || 0
        );

        // 6️⃣ Calculate pricing
        const quantity = booking.quantity || 1;

        const subtotal = unitPrice * quantity;
        const serviceFee = subtotal * 0.08;
        const tax = subtotal * 0.1;
        const total = subtotal + serviceFee + tax;

        // 7️⃣ Response (matches your frontend)
        return res.json({
          cartId: userCart.cartId,
          booking: {
            title: product.title,
            city: product.city,
            startTime: booking.startTime,
            endTime: booking.endTime,
            guestRange: `${booking.minGuestCount} - ${booking.maxGuestCount}`,
          },

          items: [
            {
              id: product.productId,
              title: product.title,
              city: product.city,
              quantity,
              price: unitPrice,
              image: product.bannerImage,
            },
          ],

          pricing: {
            subtotal,
            serviceFee,
            tax,
            total,
          },
        });
      } catch (err) {
        console.error('Cart Detail Error:', err);
        return res.status(500).json({ error: 'Server error' });
      }
    }
    if (req.method === 'GET') {
      const userEvents = await db
        .select({ eventId: events.eventId })
        .from(events)
        .where(eq(events.userId, userId));

      const eventIds = userEvents.map(e => e.eventId);

      let condition;

      if (userCart && eventIds.length > 0) {
        condition = or(
          and(eq(bookingDraft.sourceId, userCart.cartId), eq(bookingDraft.source, 'CART')),
          and(inArray(bookingDraft.sourceId, eventIds), eq(bookingDraft.source, 'EVENT'))
        );
      } else if (userCart) {
        condition = and(eq(bookingDraft.sourceId, userCart.cartId), eq(bookingDraft.source, 'CART'));
      } else if (eventIds.length > 0) {
        condition = and(inArray(bookingDraft.sourceId, eventIds), eq(bookingDraft.source, 'EVENT'));
      } else {
        return res.json({
          message: 'Cart is empty and no events found',
          cartId: null,
          items: [],
        });
      }

      const bookingResult = await db
        .select({
          bookingDraftId: bookingDraft.bookingDraftId,
          source: bookingDraft.source,
          sourceId: bookingDraft.sourceId,
          bookingMinGuest: bookingDraft.minGuestCount,
          bookingMaxGuest: bookingDraft.maxGuestCount,
          productId: bookingDraft.productId,
          contactName: bookingDraft.contactName,
          contactNumber: bookingDraft.contactNumber,
          startTime: bookingDraft.startTime,
          endTime: bookingDraft.endTime,
          quantity: bookingDraft.quantity,
          status: bookingDraft.status,
          vendorId: products.vendorId,
          productName: products.title,
          productImage: products.bannerImage,
          pricebookId: priceBook.id,
          lowerSlab: priceBookEntry.lowerSlab,
          upperSlab: priceBookEntry.upperSlab,
          price: priceBookEntry.salePrice,
          eventMinGuest: events.minGuestCount,
          eventMaxGuest: events.maxGuestCount,
          eventContactName: events.contactName,
          eventContactNumber: events.contactNumber,
          eventStartTime: events.startTime,
          eventEndTime: events.endTime,
        })
        .from(bookingDraft)
        .where(condition)
        .orderBy(desc(bookingDraft.createdAt))
        .leftJoin(products, eq(products.productId, bookingDraft.productId))
        .leftJoin(events, eq(events.eventId, bookingDraft.sourceId))
        .leftJoin(
          priceBook,
          and(
            eq(priceBook.vendorId, products.vendorId),
            eq(priceBook.isDefault, true)
          )
        )
        .leftJoin(
          priceBookEntry,
          and(
            eq(priceBookEntry.priceBookingId, priceBook.id),
            eq(priceBookEntry.productId, products.productId)
          )
        );

      const grouped = bookingResult.reduce((acc, item) => {
        if (!acc[item.bookingDraftId]) {
          acc[item.bookingDraftId] = [];
        }
        acc[item.bookingDraftId].push(item);
        return acc;
      }, {});

      const finalItems = [];

      for (const bookingId in grouped) {
        const items = grouped[bookingId];
        const bookingMinGuest = items[0].bookingMinGuest || items[0].eventMinGuest || 1;
        const bookingMaxGuest = items[0].bookingMaxGuest || items[0].eventMaxGuest || 1;

        let matched = items.filter(
          (i) =>
            bookingMinGuest >= i.lowerSlab && bookingMaxGuest <= i.upperSlab
        );

        let selected;

        if (matched.length > 0) {
          matched.sort((a, b) => a.upperSlab - b.upperSlab);
          selected = matched[0];
        } else {
          selected = items
            .map((i) => {
              let distance = 0;
              if (bookingMaxGuest < i.lowerSlab) {
                distance = i.lowerSlab - bookingMaxGuest;
              } else if (bookingMinGuest > i.upperSlab) {
                distance = bookingMinGuest - i.upperSlab;
              }
              return { ...i, distance };
            })
            .sort((a, b) => a.distance - b.distance)[0];
        }

        if (selected) {
          selected.contactName = selected.contactName || selected.eventContactName;
          selected.contactNumber = selected.contactNumber || selected.eventContactNumber;
          selected.startTime = selected.startTime || selected.eventStartTime;
          selected.endTime = selected.endTime || selected.eventEndTime;
          selected.minGuestCount = bookingMinGuest;
          selected.maxGuestCount = bookingMaxGuest;

          delete selected.distance;

          finalItems.push(selected);
        }
      }

      const cartItems = finalItems.filter((i) => i.source === 'CART');
      const eventItemsRaw = finalItems.filter((i) => i.source === 'EVENT');

      const eventsMap = {};
      for (const item of eventItemsRaw) {
        const eventId = item.sourceId;
        if (!eventsMap[eventId]) {
          eventsMap[eventId] = {
            eventId: eventId,
            eventDetails: {
              contactName: item.eventContactName,
              contactNumber: item.eventContactNumber,
              startTime: item.eventStartTime,
              endTime: item.eventEndTime,
              minGuestCount: item.eventMinGuest,
              maxGuestCount: item.eventMaxGuest,
            },
            services: [],
          };
        }
        eventsMap[eventId].services.push(item);
      }

      const formattedEvents = Object.values(eventsMap);

      console.log("all response coming up ", {
        cartId: userCart.cartId,
        cartItems,
        formattedEvents
      });
      return res.json({
        cartId: userCart ? userCart.cartId : null,
        items: cartItems,
        events: formattedEvents,
      });
    }

    if (req.method === 'POST') {
      if (!userCart) {
        const newCart = await db
          .insert(cart)
          .values({ userId })
          .onConflictDoNothing()
          .returning();

        if (newCart.length) {
          userCart = newCart[0];
        } else {
          userCart = await db.query.cart.findFirst({
            where: (t, { eq }) => eq(t.userId, userId),
          });
        }
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
          item: existing,
          cartId: cartId,
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
        item: newItem,
        cartId: cartId,
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

export const updateProfilePicture = async (req, res) => {
  try {
    const userId = req.user['custom:user_id'];
    const { profileImage } = req.body;
    console.log('profileImage', profileImage);
    await db
      .update(users)
      .set({ profileImage: profileImage })
      .where(eq(users.userId, userId));
    return res
      .status(200)
      .json({ message: 'Profile image updated successfully.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteProfilePicture = async (req, res) => {
  try {
    const { id } = req.params;
    await db
      .update(users)
      .set({ profileImage: null })
      .where(eq(users.userId, id));
    return res
      .status(200)
      .json({ message: 'Profile image updated successfully.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
      .delete(reviews)
      .where(eq(reviews.reviewId, reviewId))
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
  try {
    const { notificationId } = req.body;
    if (!notificationId) {
      return res.status(400).json({ success: false, message: 'notificationId is required' });
    }
    await db
      .update(userNotifications)
      .set({ status: true })
      .where(eq(userNotifications.id, Number(notificationId)));
    return res.status(200).json({
      success: true,
      message: 'Notification marked as read',
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
    });
  }
};

export const getPersonalInfo = async (req, res) => {
  try {
    const userId = req.user['custom:user_id'];
    const user = await db
      .select({
        id: users.userId,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        number: users.number,
        profileImage: users.profileImage,
        streetAddress1: userAddresses.addressLineOne,
        streetAddress2: userAddresses.addressLineTwo,
        city: userAddresses.city,
        state: userAddresses.state,
        country: userAddresses.country,
        postalCode: userAddresses.postalCode,
        currentAddressId: users.currentAddressId,
      })
      .from(users)
      .leftJoin(userAddresses, eq(userAddresses.id, users.currentAddressId))
      .where(eq(users.userId, userId));

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
    const {
      firstName,
      lastName,
      number,
      profileImage,
      addressLine1,
      addressLine2,
      city,
      country,
      state,
      zipCode,
      currentAddressId,
      latitude,
      longitude,
    } = req.body;

    const lat =
      latitude !== undefined && latitude !== null && latitude !== ''
        ? Number(latitude)
        : null;

    const lng =
      longitude !== undefined && longitude !== null && longitude !== ''
        ? Number(longitude)
        : null;

    if (userId) {
      await db.transaction(async (tx) => {
        await tx
          .update(users)
          .set({
            firstName: firstName,
            lastName: lastName,
            number: number,
            profileImage: profileImage,
          })
          .where(eq(users.userId, userId));

        // currentAddressId update address  if exist or create if not

        if (currentAddressId) {
          await tx.execute(sql`
  UPDATE user_address
  SET
    address_line_one = ${addressLine1},
    address_line_two = ${addressLine2},
    city = ${city},
    state = ${state},
    postal_code = ${zipCode},
    country = ${country},
    latitude = ${lat},
    longitude = ${lng},
    location = ${lat !== null && lng !== null
              ? sql`ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography`
              : null
            }
  WHERE id = ${currentAddressId}
`);
        } else {
          const [address] = await tx.execute(sql`
  WITH inserted AS (
    INSERT INTO user_address (
      user_id,
      address_line_one,
      address_line_two,
      city,
      state,
      postal_code,
      country,
      latitude,
      longitude,
      location
    )
    VALUES (
      ${userId},
      ${addressLine1},
      ${addressLine2},
      ${city},
      ${state},
      ${zipCode},
      ${country},
      ${lat},
      ${lng},
      ${lat !== null && lng !== null
              ? sql`ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography`
              : null
            }
    )
    RETURNING id
  )
  UPDATE "user"
  SET current_address_id = inserted.id
  FROM inserted
  WHERE "user".user_id = ${userId}
`);
        }
      });
      return res.status(200).json({
        message: 'User details updated successfully.',
      });
    }
    return res.status(404).json({
      message: 'user not found.',
    });
  } catch (error) {
    console.error('Error fetching user info:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export const saveFcmToken = async (req, res) => {
  try {
    const { userId, fcmToken, platform } = req.body;

    if (!userId || !platform) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    await db
      .update(users)
      .set({
        firebaseToken: fcmToken || null,
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
