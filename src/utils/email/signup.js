export const signUp = ({ name }) => {
  return `
 <body style="margin:0; padding:0; background:#ffffff;">

    <div style="
      max-width:600px;
      width:100%;
      margin:0 auto;
      padding:30px 16px;
      text-align:center;
      font-family:Arial, sans-serif;
      background:#ffffff;
    ">

        <!-- Logo -->
        <div style="display:flex; justify-content:center; align-items:center;">
            <img src="https://freaky-files.s3.ap-south-1.amazonaws.com/email-media/freakychimplogo.png" alt="logo" style="
          width:100%;
          max-width:180px;
          height:auto;
          margin-bottom:30px;
        " />
        </div>

        <!-- Welcome Image -->
        <div style="display:flex; justify-content:center; align-items:center;">
            <img src="https://freaky-files.s3.ap-south-1.amazonaws.com/email-media/freekywelcome.png" alt="Welcome" style="
          width:100%;
          max-width:280px;
          height:auto;
          margin-bottom:30px;
        " />
        </div>

        <!-- Heading -->
        <h2 style="
        font-size:40px;
        color:#3E3E3E;
        margin-bottom:16px;
        font-weight:700;
        line-height:1.2;
      ">
            Welcome to <br />
            <span style="color:#FFC107; font-weight:900;">Freaky</span>
            <span style="color:#FF5722; font-weight:900;">Chimp</span>
        </h2>

        <!-- Description -->
        <p style="
        color:#3E3E3E;
        font-size:18px;
        line-height:1.6;
        margin-bottom:24px;
        font-weight:600;
      ">
            Hi ${name} your account is all set, and you can now start exploring everything
            we've built to make your experience smooth, enjoyable, and valuable.
        </p>

        <!-- Button -->
        <a href="#" style="
        display:inline-block;
        width:100%;
        max-width:260px;
        padding:14px 0;
        background:#ff5a1f;
        color:#ffffff;
        text-decoration:none;
        border-radius:30px;
        font-size:16px;
        font-weight:600;
      ">
            Explore
        </a>

        <!-- Next Steps -->
        <div style="margin-top:40px;">
            <h3 style="
          font-size:20px;
          color:#3E3E3E;
          margin-bottom:12px;
          font-weight:600;
        ">
                What you can do next:
            </h3>

            <p style="color:#666; font-size:13px; margin:4px 0;">
                Explore our latest features
            </p>
            <p style="color:#666; font-size:13px; margin:4px 0;">
                Discover products & services curated for you
            </p>
            <p style="color:#666; font-size:13px; margin:4px 0;">
                Stay updated with new launches and offers
            </p>
        </div>

        <!-- Footer Text -->
        <p style="
        color:#999;
        font-size:12px;
        margin-top:36px;
        line-height:1.5;
      ">
            Thank you for choosing Freaky Chimp<br />
            We’re excited to be part of your journey!
        </p>

        <!-- Social Icons -->
        <div style="
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
      ">
            You have received this email as a registered user of Headspace®.
            Headspace, Inc., 2415 Michigan Avenue, Santa Monica CA 90404 United
            States. Delaware Corporation State File #5271511.
            © 2022 Headspace Inc. All rights reserved.
        </p>

    </div>

</body>
      `;
};
