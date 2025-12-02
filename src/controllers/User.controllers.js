import { and, eq, sql } from 'drizzle-orm';
import { db } from '../../db/db.js';
import { userAddresses, users } from '../../db/schema.js';
import removePassowrd from '../helpers/User.helper.js';
import { cart , cartItem } from "../../db/user.js";

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

    const { title, addressLineOne, addressLineTwo, reciverName, reciverNumber, city, state, postalCode, country, latitude, longitude } = req.body;

    const email = req.user?.email || req.body.email;


    const requiredFields = { title, addressLineOne, reciverName, reciverNumber, city, state, postalCode, country, latitude, longitude };

    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value) return res.status(400).json({ error: `${key} is required.` });
    }

    // Fetch User
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    // if user is not present
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const userId = user.userId;

    await db.insert(userAddresses).values({
      userId,
      address: req.body.address,
    });


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

    // console.log('newReview', newReviewsResponse);

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
    const { id, title, addressLineOne, addressLineTwo, reciverName, reciverNumber, city, state, postalCode, country, latitude, longitude } = req.body;
    const email = req.user?.email || req.body.email;

    const requiredFields = { title, addressLineOne, reciverName, reciverNumber, city, state, postalCode, country, latitude, longitude };

    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value) return res.status(400).json({ error: `${key} is required.` });
    }

    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const userId = user.userId;

    console.log(userId, id, title, addressLineOne, addressLineTwo, reciverName, reciverNumber, city, state, postalCode, country, latitude, longitude);

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
      message: "Address updated successfully.",
    });

  } catch (err) {
    console.error("Error updating address:", err);
    return res.status(500).json({ error: "Internal server error." });
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
      return res.status(400).json({ error: "Address ID is required." });
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
    console.error("Error saving address:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "addressId is required." });
    }

    // Find address
    const address = await db.query.userAddresses.findFirst({
      where: (userAddresses, { eq }) => eq(userAddresses.id, id)
    });

    if (!address) {
      return res.status(404).json({ error: "Address not found." });
    }

    // Delete address
    await db.delete(userAddresses)
      .where(eq(userAddresses.id, id));

    return res.status(204).json({ message: "Address deleted successfully." });

  } catch (err) {
    if (err?.cause?.code === "23503") {
      return res.status(400).json({
        success: false,
        message: "You cannot delete this address because it is set as your current address.",
      });
    }

    console.error("Error deleting address:", err);
    return res.status(500).json({ error: "Error deleting address." });
  }
};


export const cartHandler = async (req, res) => {
  try {
    const email = req.user?.email || req.body.email;
   
    const user = await db.query.users.findFirst({
      where: (user, { eq }) => eq(user.email, email)
    });  

    const userId = user.userId;
    if (!userId) {
      return res.status(400).json({ error: "User ID required" });
    }

    let userCart = await db.query.cart.findFirst({
      where: (t, { eq }) => eq(t.userId, userId),
    });

    if (req.method === "GET") {
      console.log('did he come this far')
      if (!userCart) {
        return res.json({
          message: "Cart is empty",
          cartId: null,
          items: [],
        });
      }

      const items = await db.query.cartItems.findMany({
        where: (t, { eq }) => eq(t.cartId, userCart.cartId),
      });

      return res.json({
        cartId: userCart.cartId,
        items,
      });
    }

    if (req.method === "POST") {

    if (!userCart) {
        const newCart = await db.insert(cart).values({ userId }).returning();
        userCart = newCart[0];
      }
    
    const cartId = userCart.cartId;

    const { productId, quantity } = req.body;

      if (!productId || !quantity) {
        return res.status(400).json({ error: "productId & quantity required" });
      }

      const existing = await db.query.cartItems.findFirst({
        where: (t, { eq, and }) =>
          and(eq(t.cartId, cartId), eq(t.productId, productId)),
      });

      if (existing) {
        return res.json({
          message: "item already exists"
          
        });
      }

      const newItem = await db
        .insert(cartItem)
        .values({ cartId, productId, quantity })
        .returning();

      return res.json({
        message: "Item added to cart",
        item: newItem[0],
      });
    }

    if (req.method === "DELETE") {
      const { cartItemId } = req.params;

      if (!cartItemId) {
        return res.status(400).json({ error: "cartItemId required" });
      }

      const item = await db.query.cartItems.findFirst({
        where: (t, { eq }) => eq(t.cartItemId, Number(cartItemId)),
      });

      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }
      
      await db
        .delete(cartItem)
        .where(eq(cartItem.cartItemId, Number(cartItemId)));

      return res.json({
        message: "Item removed from cart",
      });
    }

    return res.status(405).json({ error: "Method not allowed" });

  } catch (err) {
    console.error("Cart API Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
