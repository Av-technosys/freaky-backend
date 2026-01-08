import { MAIL_FOOTER, MAIL_HEAD } from './mailLayout.js';

export const otpForResetPassword = () => {
  return `
    ${MAIL_HEAD}

     <!-- Welcome Image -->
    <div style="margin-bottom:14px;">
            <img src="https://freaky-files.s3.ap-south-1.amazonaws.com/email-media/otpForResetPassword.png" alt="Welcome" style="width: 100%; max-width: 280px; height: auto" />
        </div>

       <!-- Heading -->
        <h2 style="
          font-size: 30px;
          color: #3e3e3e;
          margin: 0 0 10px;
          font-weight: 700;
          line-height: 1.3;
        ">
            OTP Verification
        </h2>

        <!-- Message -->
        <p style="
          color: #3e3e3e;
          font-size: 15px;
          line-height: 1.6;
          margin: 0 0 26px;
          padding: 0 14px;
        ">
            Use this security code to reset your password and get back into your
            account.
        </p>

        <div style="
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          font-size: 34px;
          font-weight: 700;
          margin-bottom: 20px;
        ">
            <div>5</div>
            <div>9</div>
            <div>6</div>
            <div>3</div>
            <div>1</div>
            <div>4</div>
        </div>

        <!-- Security Note -->
        <p style="
          color: #999;
          font-size: 12px;
          line-height: 1.6;
          margin: 0 0 20px;
          padding: 0 14px;
        ">
            If you didn't request this code, you can safely ignore this email.
            Someone may have typed your email address by mistake.
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
