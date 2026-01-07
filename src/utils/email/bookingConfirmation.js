import { MAIL_FOOTER, MAIL_HEAD } from './mailLayout.js';

export const bookingConfirmed = () => {
  console.log('bookingConfirmed');
  return `
${MAIL_HEAD}

    <!-- Welcome Image -->
    <div style="margin-bottom:14px;">
      <img
        src="https://freaky-files.s3.ap-south-1.amazonaws.com/email-media/freekywelcome.png"
        alt="Welcome"
        style="max-width:280px; width:100%; height:auto;"
      />
    </div>

    <!-- Heading -->
    <h2 style="
      font-size:32px;
      color:#3e3e3e;
      margin:0 0 6px;
      font-weight:700;
      line-height:1.25;
    ">
      Booking Confirmed
    </h2>

    <!-- Description -->
    <p style="
      color:#3e3e3e;
      font-size:15px;
      line-height:1.6;
      margin:0 0 28px;
      font-weight:400;
      padding: 0 12px;
      
    ">
      Hi Ramesh, your account is all set, and you can now start exploring
      everything we’ve built to make your experience smooth, enjoyable, and
      valuable.
    </p>

    <!-- Section Title -->

    <!-- Booking Details Card -->
    <div style="
      background-color:#fffbee; 
      padding:20px; 
      text-align:left; 
      margin-bottom: 8px;
    ">
          <p style="
      font-size:20px;
      color:#3e3e3e;
      margin:0 0 16px;
      font-weight:700;
      width:100%;
      text-align:center;
    ">
      Booking Details
    </p>


      <div style="font-size:15px;  line-height:1.9; color:#1f2937;">

        <div style="display:flex; margin-bottom:6px;  width:100%;">
          <div style="width:186px; font-weight:bold;">Booking ID:</div>
          <div style="text-align: end;  width:100%;" >#FC-45892</div>
        </div>

        <div style="display:flex; margin-bottom:6px;">
          <div style="width:186px; font-weight:bold;">Name:</div>
          <div style="text-align: end;  width:100%;" >Ramesh</div>
        </div>

        <div style="display:flex; margin-bottom:6px;">
          <div style="width:186px; font-weight:bold; white-space: preserve nowrap;">Service / Product:</div>
          <div style="text-align: end;  width:100%;" >Bar Tendor</div>
        </div>

        <div style="display:flex; margin-bottom:6px;">
          <div style="width:186px; font-weight:bold;">Date:</div>
          <div style="text-align: end;  width:100%;" >17 Dec, 2025</div>
        </div>

        <div style="display:flex; margin-bottom:6px;">
          <div style="width:186px; font-weight:bold;">Time:</div>
          <div style="text-align: end;  width:100%;" >9:30 PM</div>
        </div>

        <div style="display:flex; margin-bottom:6px;">
          <div style="width:186px; font-weight:bold;">Location:</div>
          <div style="text-align: end;  width:100%;" >233, Mansarovar, Jaipur</div>
        </div>

        <div style="display:flex;">
          <div style="width:186px;  font-weight:bold; white-space: preserve nowrap;">Payment Status:</div>
          <div style=" text-align: end;  width:100%; color:#16a34a; font-weight:bold;">Paid ✅</div>
        </div>

      </div>
    </div>

    <!-- Footer Text -->
    <p style="
      color:#999;
      font-size:12px;
      line-height:1.6;
      margin:0 0 20px;
    ">
      Thank you for choosing Freaky Chimp<br />
      We’re excited to be part of your journey!
    </p>

     ${MAIL_FOOTER}
`;
};
