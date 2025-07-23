const nodemailer = require("nodemailer");

const sendMail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail", // or "Outlook", "Yahoo", or custom SMTP
      auth: {
        user: process.env.EMAIL_USER,   // your email
        pass: process.env.EMAIL_PASS,   // app password --osep yypu rmjx bbof
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return true;
  } catch (err) {
    console.error("Failed to send email:", err);
    return false;
  }
};

module.exports = { sendMail };
