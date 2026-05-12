import { SendEmailCommand } from '@aws-sdk/client-ses';
import { sesClient } from '../../config/aws.js';

export const sendEmail = async ({ to, subject, html }) => {
  const params = {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Subject: {
        Data: subject,
      },
      Body: {
        Html: {
          Data: html,
        },
      },
    },
  };

  const command = new SendEmailCommand(params);
  return await sesClient.send(command);
};
