import { MAIL_FOOTER, MAIL_HEAD } from './mailLayout.js';

export const welcome = ({ name }) => {
  return `
${MAIL_HEAD}
    <!-- Welcome Image -->
    <div style="margin-bottom:14px;">

      <img src="https://freaky-files.s3.ap-south-1.amazonaws.com/email-media/freekywelcome.png" alt="Welcome" style="width: 100%; max-width: 280px; height: auto" />
    </div>

  <!-- Heading -->
    <h2 style="
      font-size:30px;
      color:#3e3e3e;
      margin:0 0 12px;
      font-weight:700;
      line-height:1.3;
    ">
      Welcome to<br />
      <span style="color:#ffc107; font-weight:900;">Freaky</span>
      <span style="color:#ff5722; font-weight:900;">Chimp</span>
    </h2>

    <!-- Message -->
    <p style="
      color:#3e3e3e;
      font-size:15px;
      line-height:1.6;
      margin:0 0 26px;
      padding:0 14px;
    ">
      Hi Ramesh, your account is all set! You can now start exploring everything
      we’ve built to make your experience smooth, enjoyable, and valuable.
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
      Explore Now
    </a>

    <!-- Next Steps -->
    <div style="
      background-color:#fffbee;
      border-radius:14px;
      padding:20px;
      margin-bottom:26px;
    ">

      <h3 style="
        font-size:20px;
        color:#3e3e3e;
        margin:0 0 14px;
        font-weight:700;
      ">
        What you can do next
      </h3>

      <p style="color:#555; font-size:14px; margin:6px 0;">
        🚀 Explore our latest features
      </p>
      <p style="color:#555; font-size:14px; margin:6px 0;">
        🛍️ Discover products & services curated for you
      </p>
      <p style="color:#555; font-size:14px; margin:6px 0;">
        🔔 Stay updated with new launches and offers
      </p>

    </div>

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
