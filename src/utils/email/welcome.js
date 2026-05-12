export const welcome = ({ name }) => {
  return `
     <body style="margin:0; padding:0; background-color:#f5f5f5;">
     <div style="height:5px; background-color:#ff5722; width:100%"></div>
    <div style="height:5px; background-color:#ffc107; width:100%"></div>

  <div style="
     
    padding:24px 8px;
    background-color:#ffffff;
    text-align:center;
    font-family:Arial, sans-serif;
  ">

    <!-- Logo -->
    <div style="margin-bottom:28px;">
      <img
        src="https://freaky-files.s3.ap-south-1.amazonaws.com/email-media/freakychimplogo.png"
        alt="logo"
        style="max-width:180px; width:auto; max-height:48px;"
      />
    </div>    <!-- Welcome Image -->
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
 <!-- Social Icons -->
        <div style="
        margin: auto;
        margin-top:16px;
        display:flex;
        justify-content:center;
        align-items:center;
        gap:15px;
      ">
            <img src="https://freaky-files.s3.ap-south-1.amazonaws.com/email-media/fb.png" alt="facebook" style="width:24px; height:auto;" />
            <img src="https://freaky-files.s3.ap-south-1.amazonaws.com/email-media/insta.png" alt="instagram" style="width:24px; height:auto;" />
            <img src="https://freaky-files.s3.ap-south-1.amazonaws.com/email-media/twitter.png" alt="twitter" style="width:24px; height:auto;" />
            <img src="https://freaky-files.s3.ap-south-1.amazonaws.com/email-media/mail.png" alt="mail" style="width:24px; height:auto;" />
        </div>

        <!-- Footer Links -->
        <p style="
        color:#626262;
        font-size:13px;
        font-weight:600;
        margin-top:24px;
        line-height:1.4;
      ">
            My Headspace | How it works | FAQs | T&Cs | Privacy Policy
        </p>

        <!-- Legal -->
        <p style="
        color:#B2B2B2;
        font-size:12px;
        margin-top:36px;
        line-height:1.5;
        padding: 0 8px;
      ">
            You have received this email as a registered user of Headspace®.
            Headspace, Inc., 2415 Michigan Avenue, Santa Monica CA 90404 United
            States. Delaware Corporation State File #5271511.
            © 2022 Headspace Inc. All rights reserved.
        </p>

    </div>
</body>      `;
};
