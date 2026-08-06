import { SESClient } from '@aws-sdk/client-ses';
import {
  AWS_REGION,
  AWS_MAIL_ACCESS_KEY_ID,
  AWS_MAIL_SECRET_ACCESS_KEY,
} from '../const/env.js';

export const sesClient = new SESClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_MAIL_ACCESS_KEY_ID,
    secretAccessKey: AWS_MAIL_SECRET_ACCESS_KEY,
  },
});
