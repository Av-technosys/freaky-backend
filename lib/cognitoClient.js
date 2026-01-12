import crypto from 'crypto';

import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { AWS_REGION } from '../const/env.js';

export const cognito = new CognitoIdentityProviderClient({
  region: AWS_REGION,
  // credentials: {
  //   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  // },
});

export const USER_POOL_ID = process.env.USER_POOL_ID;
export const CLIENT_ID = process.env.COGNITO_CLIENT_ID;
export const CLIENT_SECRET = process.env.COGNITO_CLIENT_SECRET;

export const generateSecretHash = (username) => {
  const hmac = crypto.createHmac('sha256', CLIENT_SECRET);
  hmac.update(username + CLIENT_ID);
  return hmac.digest('base64');
};
