import { MAIL_FOOTER, MAIL_HEAD } from './mailLayout.js';

export const passwordChanged = () => {
  return `
    ${MAIL_HEAD}

     <!-- Welcome Image -->
    <div style="margin-bottom:14px;">
            <img src="https://freaky-files.s3.ap-south-1.amazonaws.com/email-media/bookingconfirmed.png" alt="Welcome" style="width: 100%; max-width: 280px; height: auto" />
        </div>

       <h2 style="
          font-size: 30px;
          color: #3e3e3e;
          margin: 0 0 10px;
          font-weight: 700;
          line-height: 1.3;
        ">
      Password Changed Successfully
    </h2>

    <!-- Message -->
    <p style="
          color: #3e3e3e;
          font-size: 15px;
          line-height: 1.6;
          margin: 0 0 26px;
          padding: 0 14px;
        ">
      Hi Ramesh, this is a confirmation that the password for your
      <strong>Freaky Chimp</strong> account has been successfully updated.
    </p>

    <!-- CTA Button -->
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
          margin-bottom: 28px;
        ">
      Login to Your Account
    </a>

    <!-- Security Note -->
    <p style="
          color: #999;
          font-size: 12px;
          line-height: 1.6;
          margin: 0 0 20px;
          padding: 0 14px;
        ">
      If you did not request this change, please contact our support team
      immediately. Someone may have accessed your account.
    </p>

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
