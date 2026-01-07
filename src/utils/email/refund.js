import { MAIL_FOOTER, MAIL_HEAD } from './mailLayout.js';

export const refund = () => {
  console.log('refund');
  return `
${MAIL_HEAD}

        <!-- Welcome Image -->
    <div style="margin-bottom:14px;">
            <img src="https://freaky-files.s3.ap-south-1.amazonaws.com/email-media/cancelbooking.png" alt="Welcome" style="width: 100%; max-width: 280px; height: auto" />
        </div>

        <!-- Heading -->
        <h2 style="
      font-size:30px;
      color:#3e3e3e;
      margin:0 0 10px;
      font-weight:700;
      line-height:1.3;
    ">
            Refund Initiated for Your Cancelled Booking
        </h2>

        <!-- Message -->
        <p style="
      color:#3e3e3e;
      font-size:15px;
      line-height:1.6;
      margin:0 0 26px;
      padding:0 14px;
    ">
            Hi Ramesh, we’d like to inform you that your event booking has been
            cancelled by the customer and the refund process has been initiated.
            Please find the details below.
        </p>

        <!-- Cancellation Details Card -->
        <div style="
      background-color:#fffbee;
      border-radius:14px;
      padding:20px;
      margin-bottom:26px;
      text-align:left;
    ">

            <p style="
        font-size:20px;
        color:#3e3e3e;
        margin:0 0 16px;
        font-weight:700;
        text-align:center;
      ">
                Cancellation & Refund Details
            </p>

            <div style="font-size:15px; line-height:1.9; color:#1f2937;">

                <div style="display:flex; margin-bottom:6px;">
                    <div style="width:170px; font-weight:bold;">Cancelled By:</div>
                    <div style="text-align:right; width:100%;">Ravindra Singh</div>
                </div>

                <div style="display:flex; margin-bottom:6px;">
                    <div style="width:170px; font-weight:bold;">Cancellation Date:</div>
                    <div style="text-align:right; width:100%;">15 Dec, 2025</div>
                </div>

                <div style="display:flex;">
                    <div style="width:170px; font-weight:bold;">Refund Status:</div>
                    <div style="
            text-align:right;
            width:100%;
            font-weight:bold;
            color:#f59e0b;
          ">
                        Initiated (Within 3 Working Days)
                    </div>
                </div>

            </div>
        </div>

        <!-- Footer Message -->
        <p style="
      color:#999;
      font-size:12px;
      line-height:1.6;
      margin:0 0 20px;
    ">
            Thank you for choosing Freaky Chimp<br />
            We’re always here to support you.
        </p>



     ${MAIL_FOOTER}
`;
};
