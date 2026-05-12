import { SendEmailCommand } from '@aws-sdk/client-ses';
import path from 'path';
import { sesClient } from '../config/aws.js';
import { loadTemplate } from './template.engine.js';

export const sendEmail = async ({ to, subject, template, type, data }) => {
  try {
    const templatePath = path.join(process.cwd(), 'emails', 'templates', type, `${template}.html`);

    const html = loadTemplate(templatePath, data);

    const params = {
      Source: 'notifications@freakychimp.com',
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
    const response = await sesClient.send(command);

    return response;
  } catch (error) {
    console.error('Email Error:', error);
    throw error;
  }
};
