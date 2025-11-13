import {
  ConfirmForgotPasswordCommand,
  ConfirmSignUpCommand,
  ForgotPasswordCommand,
  InitiateAuthCommand,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { cognito, generateSecretHash } from "../../lib/cognitoClient.js";
import { db } from "../../db/db.js";
import { users } from "../../db/schema.js";
import dotenv from "dotenv";
dotenv.config();

const CLIENT_ID = process.env.COGNITO_CLIENT_ID;

export const signup = async (req, res) => {
  const { password, email } = req.body;
  const bodyData = req.body;
  const username = email;
  if (!password || !email) {
    return res
      .status(400)
      .json({ error: "Username, password, and email are required." });
  }
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
    await db.insert(users).values({
      firstName: bodyData.full_name,
      email,
      number: bodyData.number,
      userTypeId: 2,
      username,
      password,
    });
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

export const confirmController = async (req, res) => {
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
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, username),
    });
    if (!user) {
      res.json({ message: "User not found.", result });
    }
    console.log(user);
    const password = user.password;

    // Generate the SECRET_HASH again
    const secretHash = generateSecretHash(username);

    const paramsLogin = {
      AuthFlow: "USER_PASSWORD_AUTH", // Use direct password-based login
      ClientId: CLIENT_ID,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
        SECRET_HASH: secretHash,
      },
    };
    const commandLogin = new InitiateAuthCommand(paramsLogin);
    const response = await cognito.send(commandLogin);

    res.json({
      message: "Account created and confirmed.",
      accessToken: response.AuthenticationResult.AccessToken,
      idToken: response.AuthenticationResult.IdToken,
      refreshToken: response.AuthenticationResult.RefreshToken,
      expiresIn: response.AuthenticationResult.ExpiresIn,
      tokenType: response.AuthenticationResult.TokenType,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const signin = async (req, res) => {
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
};

export const forgotPassword = async (req, res) => {
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
};

export const confirmForgotPassword = async (req, res) => {
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
};
