import { db } from "../../db/db.js";
import { userAddresses } from "../../db/schema.js";
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
