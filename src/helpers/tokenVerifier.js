import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { AWS_REGION, USER_POOL_ID } from './../../const/env.js';

// 1️⃣ Setup JWKS client (Cognito publishes signing keys here)
const client = jwksClient({
  jwksUri: `https://cognito-idp.${AWS_REGION}.amazonaws.com/${USER_POOL_ID}/.well-known/jwks.json`,
  cache: true,
  cacheMaxEntries: 5, // optional
  cacheMaxAge: 60 * 60 * 1000, // 1 hour
  jwksRequestsPerMinute: 10,
  timeout: 3000, // 🔥 prevents hanging
});

const keyCache = new Map();

// 2️⃣ Helper function to get the signing key dynamically
const getKey = async (header, callback) => {
  try {
    if (keyCache.has(header.kid)) {
      return callback(null, keyCache.get(header.kid));
    }

    const key = await client.getSigningKey(header.kid);
    const signingKey = key.getPublicKey();

    keyCache.set(header.kid, signingKey);

    callback(null, signingKey);
  } catch (err) {
    callback(err);
  }
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
