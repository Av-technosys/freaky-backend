import { MAIL_FOOTER, MAIL_HEAD } from './mailLayout.js';

export const eventComing = ({
  name,
  eventDate,
  eventTime,
  vendorName,
  serviceName,
  location,
}) => {
  return `
    ${MAIL_HEAD}

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

    ${MAIL_FOOTER}
  `;
};