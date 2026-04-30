import dotenv from 'dotenv';

dotenv.config();

export const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID;
export const AWS_REGION = process.env.AWS_REGION;
export const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
export const USER_POOL_ID = process.env.USER_POOL_ID; // e.g. 'ap-south-1_lumQce6zd'
export const DATABASE_URL = process.env.DATABASE_URL; // e.g. 'ap-south-1_lumQce6zd'
export const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID; // e.g. 'ap-south-1_lumQce6zd'
export const FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL; // e.g. 'ap-south-1_lumQce6zd'
export const FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY; // e.g. 'ap-south-1_lumQce6zd'
export const COGNITO_CLIENT_SECRET = process.env.COGNITO_CLIENT_SECRET;
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

export const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
export const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
