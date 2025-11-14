import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import dotenv from "dotenv";
dotenv.config();

const poolRegion = process.env.AWS_REGION; // e.g. 'ap-south-1'
const userPoolId = process.env.USER_POOL_ID; // e.g. 'ap-south-1_lumQce6zd'

// 1️⃣ Setup JWKS client (Cognito publishes signing keys here)
const client = jwksClient({
  jwksUri: `https://cognito-idp.${poolRegion}.amazonaws.com/${userPoolId}/.well-known/jwks.json`,
});

// 2️⃣ Helper function to get the signing key dynamically
const getKey = (header, callback) => {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
};

// 3️⃣ Middleware to verify Cognito token
export const confirmUserToken = (req, res, next) => {
  console.log("Checking in middleware...");

  const authHeader = req?.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : req?.body.token;

  if (!token) {
    return res.status(400).json({ error: "Token is required." });
  }

  jwt.verify(
    token,
    getKey,
    {
      algorithms: ["RS256"],
      issuer: `https://cognito-idp.${poolRegion}.amazonaws.com/${userPoolId}`,
    },
    (err, decoded) => {
      if (err) {
        console.error("Token verification failed:", err);
        return res.status(401).json({ error: "Invalid or expired token." });
      }

      req.user = decoded; // ✅ contains user info (email, sub, etc.)
      next();
    }
  );
};
