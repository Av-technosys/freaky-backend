import { S3Client } from '@aws-sdk/client-s3';
import { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from '../const/env.js';

console.log('AWS_REGION:', AWS_REGION);
console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID);
console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY);
const s3Client = new S3Client({
  region: AWS_REGION,
  requestChecksumCalculation: 'WHEN_REQUIRED',
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});
console.log('AWS_REGION:', AWS_REGION);
   console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID);
   console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY);

export default s3Client;
