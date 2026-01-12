import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { AWS_REGION, USER_POOL_ID } from './../../const/env.js';

// 1️⃣ Setup JWKS client (Cognito publishes signing keys here)
const client = jwksClient({
  jwksUri: `https://cognito-idp.${AWS_REGION}.amazonaws.com/${USER_POOL_ID}/.well-known/jwks.json`,
});

// 2️⃣ Helper function to get the signing key dynamically
const getKey = (header, callback) => {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
};

// 3️⃣ Shared verification function
export const verifyCognitoToken = (token) => {
  return new Promise((resolve, reject) => {
    if (!token || token === 'null' || token === 'undefined') {
      return reject(new Error('Token is required.'));
    }

    jwt.verify(
      token,
      getKey,
      {
        algorithms: ['RS256'],
        issuer: `https://cognito-idp.${AWS_REGION}.amazonaws.com/${USER_POOL_ID}`,
      },
      (err, decoded) => {
        if (err) return reject(err);
        resolve(decoded);
      }
    );
  });
};