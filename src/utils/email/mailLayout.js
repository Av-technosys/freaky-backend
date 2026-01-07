export const MAIL_HEAD = `
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
    </div>
`;

export const MAIL_FOOTER = `
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
</body>
`;
