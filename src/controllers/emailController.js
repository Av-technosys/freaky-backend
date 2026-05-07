import { sendEmail } from '../helpers/emailService.js';
import { bookingReceived } from '../utils/email/bookingReceived.js';
import { completePayment } from '../utils/email/completePayment.js';
import { welcome } from '../utils/email/welcome.js';
import { paymentReceived } from '../utils/email/paymentReceived.js';


const TEMPLATE_MAP = {
  BOOKING_RECEIVED: bookingReceived,
  COMPLETE_PAYMENT: completePayment,
  WELCOME_EMAIL: welcome,
  PAYMENT_RECEIVED: paymentReceived,
};

export const sendEmailController = async (req, res) => {
  try {
    const { type, to, data } = req.body;

    const templateFn = TEMPLATE_MAP[type];

    if (!templateFn) {
      return res.status(400).json({ error: 'Invalid email type' });
    }

    const html = templateFn(data);

    await sendEmail({
      to,
      subject: type,
      html,
    });

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
