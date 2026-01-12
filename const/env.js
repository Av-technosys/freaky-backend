import dotenv from 'dotenv';

dotenv.config();

export const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID;
export const AWS_REGION = process.env.AWS_REGION;
export const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
export const USER_POOL_ID = process.env.USER_POOL_ID; // e.g. 'ap-south-1_lumQce6zd'
export const DATABASE_URL = process.env.DATABASE_URL; // e.g. 'ap-south-1_lumQce6zd'
