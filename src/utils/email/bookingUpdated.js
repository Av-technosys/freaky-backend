import { MAIL_FOOTER, MAIL_HEAD } from './mailLayout.js';

export const bookingUpdated = () => {
  return `
    ${MAIL_HEAD}

     <!-- Welcome Image -->
    <div style="margin-bottom:14px;">
            <img src="https://freaky-files.s3.ap-south-1.amazonaws.com/email-media/eventUpdated.png" alt="Welcome" style="width: 100%; max-width: 280px; height: auto" />
        </div>

       <!-- Heading -->
        <h2 style="
          font-size: 32px;
          color: #3e3e3e;
          margin: 0 0 10px;
          font-weight: 700;
          line-height: 1.25;
        ">
            Your event booking has been Updated
        </h2>

        <!-- Message -->
        <p style="
          color: #3e3e3e;
          font-size: 15px;
          line-height: 1.6;
          margin: 0 0 26px;
          padding: 0 14px;
        ">
            Hii Ramesh, we’d like to inform you that the event booking has been
            updated. Below are the details for your reference.
        </p>

        <!-- Booking Details Card -->
        <div style="
          background-color: #fffbee;
          border-radius: 14px;
          padding: 20px;
          margin-bottom: 24px;
          text-align: left;
        ">
            <!-- Card Title -->
            <p style="
            font-size: 20px;
            color: #3e3e3e;
            margin: 0 0 16px;
            font-weight: 700;
            text-align: center;
          ">
                Booking Details
            </p>

            <!-- Details -->
            <div style="font-size: 15px; line-height: 1.9; color: #1f2937">
                <div style="display: flex; margin-bottom: 6px">
                    <div style="width: 170px; font-weight: bold">Booking ID:</div>
                    <div style="text-align: right; width: 100%">#FC-45892</div>
                </div>

                <div style="display: flex; margin-bottom: 6px">
                    <div style="width: 170px; font-weight: bold">Name:</div>
                    <div style="text-align: right; width: 100%">Ramesh</div>
                </div>

                <div style="display: flex; margin-bottom: 6px">
                    <div style="width: 170px; font-weight: bold">
                        Service / Product:
                    </div>
                    <div style="text-align: right; width: 100%">Bar Tendor</div>
                </div>

                <div style="display: flex; margin-bottom: 6px">
                    <div style="width: 170px; font-weight: bold">Date:</div>
                    <div style="text-align: right; width: 100%">17 Dec, 2025</div>
                </div>

                <div style="display: flex; margin-bottom: 6px">
                    <div style="width: 170px; font-weight: bold">Time:</div>
                    <div style="text-align: right; width: 100%">9:30 PM</div>
                </div>

                <div style="display: flex; margin-bottom: 6px">
                    <div style="width: 170px; font-weight: bold">Location:</div>
                    <div style="text-align: right; width: 100%">
                        233, Mansarovar, Jaipur
                    </div>
                </div>

                <div style="display: flex">
                    <div style="width: 170px; font-weight: bold">Payment Status:</div>
                    <div style="
                text-align: right;
                width: 100%;
                color: #16a34a;
                font-weight: bold;
              ">
                        Paid ✅
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
