import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const cleanEnvVar = (val) => {
  if (typeof val === 'string') {
    return val.replace(/^["']|["']$/g, '').trim();
  }
  return val;
};

export const COGNITO_CLIENT_ID = cleanEnvVar(process.env.COGNITO_CLIENT_ID);
console.log('COGNITO_CLIENT_ID:', COGNITO_CLIENT_ID);

export const AWS_REGION = cleanEnvVar(process.env.AWS_REGION);
console.log('AWS_REGION:', AWS_REGION);

export const AWS_S3_BUCKET = cleanEnvVar(process.env.AWS_S3_BUCKET);
console.log('AWS_S3_BUCKET:', AWS_S3_BUCKET);

export const USER_POOL_ID = cleanEnvVar(process.env.USER_POOL_ID);
console.log('USER_POOL_ID:', USER_POOL_ID);

export const DATABASE_URL = cleanEnvVar(process.env.DATABASE_URL);
console.log('DATABASE_URL:', DATABASE_URL);

export const FIREBASE_PROJECT_ID = cleanEnvVar(process.env.FIREBASE_PROJECT_ID);
console.log('FIREBASE_PROJECT_ID:', FIREBASE_PROJECT_ID);

export const FIREBASE_CLIENT_EMAIL = cleanEnvVar(process.env.FIREBASE_CLIENT_EMAIL);
console.log('FIREBASE_CLIENT_EMAIL:', FIREBASE_CLIENT_EMAIL);

export const FIREBASE_PRIVATE_KEY = cleanEnvVar(process.env.FIREBASE_PRIVATE_KEY);
console.log('FIREBASE_PRIVATE_KEY:', FIREBASE_PRIVATE_KEY);

export const COGNITO_CLIENT_SECRET = cleanEnvVar(process.env.COGNITO_CLIENT_SECRET);
console.log('COGNITO_CLIENT_SECRET:', COGNITO_CLIENT_SECRET);

export const AWS_ACCESS_KEY_ID = cleanEnvVar(process.env.AWS_ACCESS_KEY_ID);
console.log('AWS_ACCESS_KEY_ID:', AWS_ACCESS_KEY_ID);

export const AWS_SECRET_ACCESS_KEY = cleanEnvVar(process.env.AWS_SECRET_ACCESS_KEY);
console.log('AWS_SECRET_ACCESS_KEY:', AWS_SECRET_ACCESS_KEY);

export const AWS_MAIL_ACCESS_KEY_ID = cleanEnvVar(
  process.env.AWS_MAIL_ACCESS_KEY_ID || AWS_ACCESS_KEY_ID
);
console.log('AWS_MAIL_ACCESS_KEY_ID:', AWS_MAIL_ACCESS_KEY_ID);

export const AWS_MAIL_SECRET_ACCESS_KEY = cleanEnvVar(
  process.env.AWS_MAIL_SECRET_ACCESS_KEY || AWS_SECRET_ACCESS_KEY
);
console.log('AWS_MAIL_SECRET_ACCESS_KEY:', AWS_MAIL_SECRET_ACCESS_KEY);

export const RAZORPAY_KEY_ID = cleanEnvVar(process.env.RAZORPAY_KEY_ID);
export const RAZORPAY_KEY_SECRET = cleanEnvVar(process.env.RAZORPAY_KEY_SECRET);
console.log('RAZORPAY_KEY_ID:', RAZORPAY_KEY_ID);
console.log('RAZORPAY_KEY_SECRET:', RAZORPAY_KEY_SECRET);
