const generateOtp =  require("../Helper/Otpgenerate")
const {sendMail} = require("../Helper/MailHelper")
const tempOtp = require("../Models/Otp")
const {sendResponse} = require("../Helper/ResponseHelper");
const messages = require("../Constant/messages");

exports.requestLoginOtp = async (req, res) => {
  const { email } = req.body;
 
  try {
    if (!email) return sendResponse(res, {}, "Email is required", 400);
 
    const otp = generateOtp();
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
 
    // Upsert OTP for same email
    await tempOtp.findOneAndUpdate(
      { email },
      { otp, otpExpiry: expiry },
      { upsert: true, new: true }
    );
 
    const html = `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>OTP Verification</title>
    </head>
    <body>
      <h3>Your Login OTP is</h3>
      <p><strong>${otp}</strong></p>
    </body>
  </html>`;
    await sendMail(email, "Your Login OTP", html);
 
    return sendResponse(res, {}, messages.OTP.OTP_SENT, 200);
  } catch (error) {
    console.log(error)
    return sendResponse(res, {}, messages.GENERAL.SERVER_ERROR, 500);
  }
};
 