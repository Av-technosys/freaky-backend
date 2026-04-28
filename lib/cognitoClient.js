import crypto from 'crypto';

import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { AWS_REGION } from '../const/env.js';
import {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  COGNITO_CLIENT_ID,
  COGNITO_CLIENT_SECRET,
} from '../const/env.js';

const CLIENT_ID = COGNITO_CLIENT_ID;
const CLIENT_SECRET = COGNITO_CLIENT_SECRET;

console.log('Cognito Client ID:', CLIENT_ID);
console.log('Cognito Client Secret:', CLIENT_SECRET);
console.log('AWS Access Key ID:', AWS_ACCESS_KEY_ID);
console.log('AWS Secret Access Key:', AWS_SECRET_ACCESS_KEY);

export const cognito = new CognitoIdentityProviderClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

export const generateSecretHash = (username) => {
  const hmac = crypto.createHmac('sha256', CLIENT_SECRET);
  hmac.update(username + CLIENT_ID);
  return hmac.digest('base64');
};
