import { sendEmail } from '../../helpers/emailService.js';

export const sendMail = ({ to, subject, body, html }) => {
  return sendEmail({
    to,
    subject,
    html: html ?? body,
  });
};
