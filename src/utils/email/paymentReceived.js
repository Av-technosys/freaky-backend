import { MAIL_FOOTER, MAIL_HEAD } from './mailLayout.js';

export const paymentReceived = ({
  bookingId,
  name,
  services,
  date,
  time,
  location,
  paymentMethod,
}) => {
  return `
${MAIL_HEAD}

<div style="margin-bottom:14px;">
  <img src="https://freaky-files.s3.ap-south-1.amazonaws.com/email-media/bookingsuccess.png" alt="Welcome" style="width: 100%; max-width: 280px; height: auto" />
</div>

<h2 style="
  font-size: 30px;
  color: #3e3e3e;
  margin: 0 0 10px;
  font-weight: 700;
  line-height: 1.3;
">
  You’ve received a new payment
</h2>

<p style="
  color: #3e3e3e;
  font-size: 15px;
  line-height: 1.6;
  margin: 0 0 26px;
  padding: 0 14px;
">
  A payment has been successfully received for a booking. Here are the details.
</p>

<div style="
  background-color: #fffbee;
  border-radius: 14px;
  padding: 20px;
  margin-bottom: 26px;
  text-align: left;
">
  <p style="
    font-size: 20px;
    color: #3e3e3e;
    margin: 0 0 16px;
    font-weight: 700;
    text-align: center;
  ">
    Payment Details
  </p>

  <div style="font-size: 15px; line-height: 1.9; color: #1f2937">

    <div style="display: flex; margin-bottom: 6px">
      <div style="width: 170px; font-weight: bold">Booking ID:</div>
      <div style="text-align: right; width: 100%">#FC-${bookingId}</div>
    </div>

    <div style="display: flex; margin-bottom: 6px">
      <div style="width: 170px; font-weight: bold">Customer Name:</div>
      <div style="text-align: right; width: 100%">${name}</div>
    </div>

    <div style="display: flex; margin-bottom: 6px">
      <div style="width: 170px; font-weight: bold">Service / Product:</div>
      <div style="text-align: right; width: 100%">${services}</div>
    </div>

    <div style="display: flex; margin-bottom: 6px">
      <div style="width: 170px; font-weight: bold">Date:</div>
      <div style="text-align: right; width: 100%">${date}</div>
    </div>

    <div style="display: flex; margin-bottom: 6px">
      <div style="width: 170px; font-weight: bold">Time:</div>
      <div style="text-align: right; width: 100%">${time}</div>
    </div>

    <div style="display: flex; margin-bottom: 6px">
      <div style="width: 170px; font-weight: bold">Location:</div>
      <div style="text-align: right; width: 100%">${location}</div>
    </div>

    <div style="display: flex; margin-bottom: 6px">
      <div style="width: 170px; font-weight: bold">Payment Method:</div>
      <div style="text-align: right; width: 100%">${paymentMethod}</div>
    </div>

    <div style="display: flex">
      <div style="width: 170px; font-weight: bold">Payment Status:</div>
      <div style="text-align: right; width: 100%; color: #16a34a; font-weight: bold;">
        Paid ✅
      </div>
    </div>

  </div>
</div>

<p style="
  color:#999;
  font-size:12px;
  line-height:1.6;
  margin:0 0 20px;
">
  Thank you for being a valued partner with Freaky Chimp.
</p>

${MAIL_FOOTER}
`;
};
