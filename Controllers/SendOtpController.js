const {generateOtp} =  require("../Helper/Otpgenerate")
const {sendMail} = require("../Helper/MailHelper")
const tempOtp = require("../Models/Otp")
const {sendResponse} = require("../Helper/ResponseHelper")


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
 
    const html = `<h3>Your Login OTP is</h3><p><strong>${otp}</strong></p>`;
    await sendMail(email, "Your Login OTP", html);
 
    return sendResponse(res, {}, "OTP sent to email", 200);
  } catch (error) {
    return sendResponse(res, {}, "Server error", 500);
  }
};
 