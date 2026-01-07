import { MAIL_FOOTER, MAIL_HEAD } from './mailLayout.js';

export const shareFeedback = () => {
  console.log('shareFeedback');
  return `
${MAIL_HEAD}

        <!-- Welcome Image -->
    <div style="margin-bottom:14px;">
            <img src="https://freaky-files.s3.ap-south-1.amazonaws.com/email-media/review.png" alt="Welcome" style="width: 100%; max-width: 280px; height: auto" />
        </div>

     <!-- Heading -->
    <h2 style="
      font-size:30px;
      color:#3e3e3e;
      margin:0 0 10px;
      font-weight:700;
      line-height:1.3;
    ">
      Share Your Feedback!
    </h2>

    <!-- Message -->
    <p style="
      color:#3e3e3e;
      font-size:15px;
      line-height:1.6;
      margin:0 0 26px;
      padding:0 14px;
    ">
      Hi Ramesh, we hope you enjoyed your event! Your feedback helps us maintain
      high standards and helps others in the community make better choices.
    </p>

 
      <p style="
        font-size:20px;
        color:#3e3e3e;
        margin:0 0 14px;
        font-weight:700;
      ">
        Rate Your Experience
      </p>

    <!-- CTA Button -->
    <a href="#" style="
        display:inline-block;
        width:100%;
        max-width:260px;
        padding:14px 0;
        background-color:#ff5a1f;
        color:#ffffff;
        text-decoration:none;
        border-radius:30px;
        font-size:16px;
        font-weight:600;
        margin-bottom:36px;
      ">
      Give your feedback
    </a>


    <!-- Footer Message -->
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
