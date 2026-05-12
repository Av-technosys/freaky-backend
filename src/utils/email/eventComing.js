export const eventComing = ({ name, eventDate, eventTime, vendorName, serviceName, location }) => {
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
    </div>
    <div style="margin-bottom:14px;">
      <img src="https://freaky-files.s3.ap-south-1.amazonaws.com/email-media/comingevent.png"
        style="width:100%; max-width:280px;" />
    </div>

    <h2 style="font-size:30px; color:#3e3e3e; font-weight:700;">
      Your event is coming up soon!
    </h2>

    <p style="font-size:15px; color:#3e3e3e;">
      Hi ${name}, this is a friendly reminder that your event is coming up soon.
    </p>

    <div style="background:#fffbee; padding:20px; border-radius:14px;">

      <p style="font-size:20px; font-weight:700; text-align:center;">
        Booking Details
      </p>

      <div style="font-size:15px;">

        <div style="display:flex;">
          <div style="width:170px; font-weight:bold;">Event Date:</div>
          <div style="text-align:right; width:100%;">${eventDate}</div>
        </div>

        <div style="display:flex;">
          <div style="width:170px; font-weight:bold;">Event Time:</div>
          <div style="text-align:right; width:100%;">${eventTime}</div>
        </div>

        <div style="display:flex;">
          <div style="width:170px; font-weight:bold;">Vendor Name:</div>
          <div style="text-align:right; width:100%;">${vendorName}</div>
        </div>

        <div style="display:flex;">
          <div style="width:170px; font-weight:bold;">Service:</div>
          <div style="text-align:right; width:100%;">${serviceName}</div>
        </div>

        <div style="display:flex;">
          <div style="width:170px; font-weight:bold;">Location:</div>
          <div style="text-align:right; width:100%;">${location}</div>
        </div>

      </div>
    </div>

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
</body>  `;
};
