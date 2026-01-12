import admin from '../../lib/firebaseAdmin.js';

export const sendNotificationToUser = async ({
  fcmToken,
  title,
  body,
  data = {},
}) => {
  if (!fcmToken || !title || !body) {
    throw new Error('fcmToken, title and body are required');
  }

  const message = {
    token: fcmToken,
    notification: {
      title,
      body,
    },
    data: Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, String(v)])
    ),
  };

  const response = await admin.messaging().send(message);

  return {
    success: true,
    messageId: response,
  };
};
