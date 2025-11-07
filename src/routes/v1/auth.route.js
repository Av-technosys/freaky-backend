import { Router } from "express";
import {
  CLIENT_ID,
  cognito,
  generateSecretHash,
} from "../../../lib/cognitoClient.js";
import {
  ConfirmForgotPasswordCommand,
  ConfirmSignUpCommand,
  ForgotPasswordCommand,
  InitiateAuthCommand,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { db } from "../../../db/db.js";
import { userTypes } from "../../../db/schema.js";

const router = Router();

router.get("/", async (req, res) => {
  const data = await db.select().from(userTypes);
  // const data = { name: "ashish" };
  console.log("auth root");
  res.status(200).json(data);
});

router.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res
      .status(400)
      .json({ error: "Username, password, and email are required." });
  }

  // Generate the SECRET_HASH
  const secretHash = generateSecretHash(username);

  const params = {
    ClientId: CLIENT_ID,
    Username: username,
    Password: password,
    UserAttributes: [{ Name: "email", Value: email }],
    SecretHash: secretHash, // Include the SECRET_HASH here
  };
  try {
    const command = new SignUpCommand(params);
    const result = await cognito.send(command);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/confirm", async (req, res) => {
  const { username, code } = req.body;

  if (!username || !code) {
    return res
      .status(400)
      .json({ error: "Username and confirmation code are required." });
  }

  // Generate the secret hash again (same as during signup)
  const secretHash = generateSecretHash(username);

  const params = {
    ClientId: CLIENT_ID,
    Username: username,
    ConfirmationCode: code,
    SecretHash: secretHash,
  };

  try {
    const command = new ConfirmSignUpCommand(params);
    const result = await cognito.send(command);
    res.json({ message: "User confirmed successfully.", result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  // Generate the SECRET_HASH again
  const secretHash = generateSecretHash(username);

  const params = {
    AuthFlow: "USER_PASSWORD_AUTH", // Use direct password-based login
    ClientId: CLIENT_ID,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
      SECRET_HASH: secretHash,
    },
  };

  try {
    const command = new InitiateAuthCommand(params);
    const response = await cognito.send(command);

    res.json({
      message: "Login successful.",
      accessToken: response.AuthenticationResult.AccessToken,
      idToken: response.AuthenticationResult.IdToken,
      refreshToken: response.AuthenticationResult.RefreshToken,
      expiresIn: response.AuthenticationResult.ExpiresIn,
      tokenType: response.AuthenticationResult.TokenType,
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: err.message });
  }
});

router.post("/forgot-password", async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required." });
  }

  const secretHash = generateSecretHash(username);

  const params = {
    ClientId: CLIENT_ID,
    Username: username,
    SecretHash: secretHash,
  };

  try {
    const command = new ForgotPasswordCommand(params);
    const response = await cognito.send(command);

    res.json({
      message: "Password reset code sent to your email.",
      delivery: response.CodeDeliveryDetails,
    });
  } catch (err) {
    console.error("ForgotPassword error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/confirm-forgot-password", async (req, res) => {
  const { username, code, newPassword } = req.body;

  if (!username || !code || !newPassword) {
    return res
      .status(400)
      .json({ error: "Username, code, and new password are required." });
  }

  const secretHash = generateSecretHash(username);

  const params = {
    ClientId: CLIENT_ID,
    Username: username,
    ConfirmationCode: code,
    Password: newPassword,
    SecretHash: secretHash,
  };

  try {
    const command = new ConfirmForgotPasswordCommand(params);
    await cognito.send(command);

    res.json({ message: "Password reset successful." });
  } catch (err) {
    console.error("ConfirmForgotPassword error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
