import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
export const cognito = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const USER_POOL_ID = process.env.USER_POOL_ID;
export const CLIENT_ID = process.env.COGNITO_CLIENT_ID;
export const CLIENT_SECRET = process.env.COGNITO_CLIENT_SECRET;

export const generateSecretHash = (username) => {
  const hmac = crypto.createHmac("sha256", CLIENT_SECRET);
  hmac.update(username + CLIENT_ID);
  return hmac.digest("base64");
};
