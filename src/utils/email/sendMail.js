import nodemailer from 'nodemailer';

export async function sendMail({ subject, to, body }) {
  try {
    const transporter = nodemailer.createTransport({
      host: 'email-smtp.ap-south-1.amazonaws.com', // SES endpoint
      port: 587, // or 2587 or 25
      secure: false, // TLS starts automatically
      auth: {
        user: process.env.SES_USER,
        pass: process.env.SES_PASS,
      },
    });

    const mailOptions = {
      from: 'avtechnosys02@gmail.com',
      to: [to],
      subject: subject,
      html: body,
    };

    const result = await transporter.sendMail(mailOptions);

    return { success: true, result };
  } catch (error) {
    console.error('SES Email Error:', error);
    return { success: false, error };
  }
}

// <div style="font-family: Arial, sans-serif; padding: 20px;">
//   <h2 style="color: #333;">Hey, ${name}, Thanks for signing up</h2>

//   <p><strong>Mobile:</strong> ${number}</p>
//   <p><strong>Message:</strong> ${message}</p>

//   <br/>

// </div>
