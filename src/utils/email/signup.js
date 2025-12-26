export const signUp = ({ name }) => {
  return `
        <body style="margin:0; padding:0; background-color:#FF5722; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f7fb; padding:32px 0;">
    <tr>
      <td align="center">

        <!-- Container -->
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; padding:40px; box-shadow:0 10px 30px rgba(0,0,0,0.05);">

          <!-- Header -->
          <tr>
            <td style="text-align:center; padding-bottom:24px;">
              <h1 style="margin:0; font-size:26px; color:#FF5722; letter-spacing:-0.5px;">
                Welcome to FreakyChimp
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="font-size:15px; line-height:1.7; color:#374151;">
              <p style="margin:0 0 16px 0;">
                Hello ${name},
              </p>

              <p style="margin:0 0 16px 0;">
                We’re excited to have you onboard. Your FreakyChimp account has been successfully created, and you’re all set to explore the platform.
              </p>

              <p style="margin:0 0 20px 0;">
                FreakyChimp is built to help you work smarter, stay organized, and move faster — without unnecessary complexity.
              </p>

              <p style="margin:0 0 12px 0; font-weight:600; color:#111827;">
                What you can do next:
              </p>

              <ul style="margin:0 0 20px 18px; padding:0; color:#374151;">
                <li style="margin-bottom:8px;">Explore your dashboard and core features</li>
                <li style="margin-bottom:8px;">Complete your profile to unlock the full experience</li>
                <li style="margin-bottom:8px;">Start using FreakyChimp for your daily workflow</li>
              </ul>

              <p style="margin:0 0 16px 0;">
                If you need any help, simply reply to this email or reach out to our support team — we’re always here for you.
              </p>

              <p style="margin:24px 0 0 0;">
                Welcome aboard,<br/>
                <strong>The FreakyChimp Team</strong>
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:30px 0;">
              <hr style="border:none; height:1px; background-color:#e5e7eb;">
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="font-size:13px; color:#6b7280; text-align:center;">
              <p style="margin:0 0 6px 0;">
                Need help? Contact us at
                <a href="mailto:hello@freakychimp.com" style="color:#4f46e5; text-decoration:none;">
                  hello@freakychimp.com
                </a>
              </p>
              <p style="margin:0;">
                © 2025 FreakyChimp. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
        <!-- End Container -->

      </td>
    </tr>
  </table>

</body>
      `;
};
