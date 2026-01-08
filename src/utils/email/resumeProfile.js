import { MAIL_FOOTER, MAIL_HEAD } from './mailLayout.js';

export const resumeProfile = () => {
  return `
    ${MAIL_HEAD}

     <!-- Welcome Image -->
    <div style="margin-bottom:14px;">
            <img src="https://freaky-files.s3.ap-south-1.amazonaws.com/email-media/completeProfile.png" alt="Welcome" style="width: 100%; max-width: 280px; height: auto" />
        </div>

       <!-- Heading -->
        <h2 style="
          font-size: 30px;
          color: #3e3e3e;
          margin: 0 0 10px;
          font-weight: 700;
          line-height: 1.3;
        ">
            Don’t stop now! Your profile is almost ready
        </h2>

        <!-- Message -->
        <p style="
          color: #3e3e3e;
          font-size: 15px;
          line-height: 1.6;
          margin: 0 0 26px;
          padding: 0 14px;
        ">
            Hi [Vendor Name], We noticed you were in the middle of setting up your
            vendor profile but didn't quite finish. You're just a few steps away
            from joining the Freaky Chimp community!
        </p>

        <!-- Booking Details Card -->
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
                Profile Details
            </p>

            <div style="font-size: 15px; line-height: 1.9; color: #1f2937">
                <div style="display: flex; margin-bottom: 6px">
                    <div style="width: 170px; font-weight: bold">Field Details:</div>
                    <div style="text-align: right; width: 100%">#3434-ht</div>
                </div>

                <div style="display: flex; margin-bottom: 6px">
                    <div style="width: 170px; font-weight: bold">Vendor Type:</div>
                    <div style="text-align: right; width: 100%">Category</div>
                </div>

                <div style="display: flex; margin-bottom: 6px">
                    <div style="width: 170px; font-weight: bold">Profile Status:</div>
                    <div style="text-align: right; width: 100%">Incomplete</div>
                </div>

                <div style="display: flex; margin-bottom: 6px">
                    <div style="width: 170px; font-weight: bold">Steps Remaining:</div>
                    <div style="text-align: right; width: 100%">
                        [eg.Upload ID / Add Pricing]
                    </div>
                </div>

                <div style="display: flex">
                    <div style="width: 170px; font-weight: bold">Estimated Time:</div>
                    <div style="text-align: right; width: 100%">2 min</div>
                </div>
            </div>
        </div>

        <a href="#" style="
          display: inline-block;
          width: 100%;
          max-width: 260px;
          padding: 14px 0;
          background-color: #ff5a1f;
          color: #ffffff;
          text-decoration: none;
          border-radius: 30px;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 36px;
        ">
            Resume Process
        </a>

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
