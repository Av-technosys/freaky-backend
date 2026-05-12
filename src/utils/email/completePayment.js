export const completePayment = () => {
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
        <!-- Welcome Image -->
    <div style="margin-bottom:14px;">
            <img src="https://freaky-files.s3.ap-south-1.amazonaws.com/email-media/secureEvent.png" alt="complete profile"
                style="max-width: 280px; width: 100%; height: auto" />
        </div>

        <!-- Heading -->
        <h2 style="
          font-size: 30px;
          color: #3e3e3e;
          margin: 0 0 10px;
          font-weight: 700;
          line-height: 1.3;
        ">
            Complete Your Payment to Secure Your Event
        </h2>

        <!-- Message -->
        <p style="
          color: #3e3e3e;
          font-size: 15px;
          line-height: 1.6;
          margin: 0 0 26px;
          padding: 0 14px;
        ">
            Hii Ramesh, This is a friendly reminder that a payment is pending for
            your upcoming booking. Please complete the transaction to ensure your
            service is confirmed.
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
                Payment Details
            </p>

            <div style="font-size: 15px; line-height: 1.9; color: #1f2937">
                <div style="display: flex; margin-bottom: 6px">
                    <div style="width: 170px; font-weight: bold">Booking ID:</div>
                    <div style="text-align: right; width: 100%">#3434-ht</div>
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
                    <div style="text-align: right; width: 100%">25 July 2004</div>
                </div>

                <div style="display: flex">
                    <div style="width: 170px; font-weight: bold">Time:</div>
                    <div style="text-align: right; width: 100%">9:30 pm</div>
                </div>
                <div style="display: flex">
                    <div style="width: 170px; font-weight: bold">Location:</div>
                    <div style="text-align: right; width: 100%">Mansarovar,Jaipur</div>
                </div>
                <div style="display: flex">
                    <div style="width: 170px; font-weight: bold">Payment Status :</div>
                    <div style="text-align: right; width: 100%">Pending</div>
                </div>
                <div style="display: flex">
                    <div style="width: 170px; font-weight: bold">Due Date :</div>
                    <div style="text-align: right; width: 100%">25 July 2025</div>
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
            Make Payment
        </a>

        <!-- Footer Message -->
        <p style="color: #999; font-size: 12px; line-height: 1.6; margin: 0 0 20px">
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
</body>`;
};
