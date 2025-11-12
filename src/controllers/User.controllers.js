import { and, eq } from "drizzle-orm";
import { db } from "../../db/db.js";
import { userAddresses, users } from "../../db/schema.js";
import removePassowrd from "../helpers/User.helper.js";

export const getUserInfo = async (req, res) => {
  try {
    const email = req.user?.email || req.body.email;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json({
      message: "User info fetched successfully.",
      data: removePassowrd(user),
    });
  } catch (err) {
    console.error("Error fetching user info:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};
export const updateUserInfo = async (req, res) => {
  try {
    const email = req.user?.email || req.body.email;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const userId = user.userId;

    const allowedFields = ["firstName", "lastName", "profileImage", "gender"];
    const updateData = Object.fromEntries(
      Object.entries(req.body).filter(
        ([key, value]) => allowedFields.includes(key) && value !== undefined
      )
    );

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No valid fields to update." });
    }

    // Update user info
    const updatedUser = await db
      .update(users)
      .set(updateData)
      .where(eq(users.userId, userId))
      .returning();

    return res.json({
      message: "User profile updated successfully.",
      data: updatedUser[0],
    });
  } catch (err) {
    console.error("Error updating user info:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const addAddress = async (req, res) => {
  try {
    const email = req.user?.email || req.body.email;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const userId = user.userId;

    await db.insert(userAddresses).values({
      userId,
      address: req.body.address,
    });

    return res.json({
      message: "Address added successfully.",
    });
  } catch (err) {
    console.error("Error fetching user info:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const listAllAddresses = async (req, res) => {
  try {
    const email = req.user?.email || req.body.email;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const userId = user.userId;

    const response = await db.query.userAddresses.findMany({
      where: (userAddresses, { eq }) => eq(userAddresses.userId, userId),
    });

    return res.json({
      message: "Address added successfully.",
      data: response,
    });
  } catch (err) {
    console.error("Error fetching user info:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const editAddresses = async (req, res) => {
  try {
    const email = req.user?.email || req.body.email;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const userId = user.userId;

    const data = req.body;
    const { id, userId: reqUserId, ...filteredData } = data;

    const response = await db
      .update(userAddresses)
      .set(filteredData)
      .where(and(eq(userAddresses.userId, userId), eq(userAddresses.id, id)))
      .returning();

    return res.json({
      message: "Address saved successfully.",
      data: response,
    });
  } catch (err) {
    console.error("Error saving address:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const setCurrentAddress = async (req, res) => {
  try {
    const email = req.user?.email || req.body.email;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const userId = user.userId;

    const data = req.body;
    const { id } = data;

    await db
      .update(users)
      .set({
        currentAddressId: id,
      })
      .where(eq(users.userId, userId));

    const response = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.userId, userId),
      with: {
        currentAddressId: true,
      },
    });

    return res.json({
      message: "Address saved successfully.",
      data: response,
    });
  } catch (err) {
    console.error("Error saving address:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};
