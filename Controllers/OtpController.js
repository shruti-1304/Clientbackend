const { sendResponse } = require("../Helper/ResponseHelper");
const User = require("../Models/User");
const validate = require("../Helper/ValidationHelper");
const message = require("../Constant/messages")


module.exports ={
  resetPassword: async (req, res) => {
  try {
    const validationRules = {
      email: "required|email",
      otp: "required|string",
    newPassword: "required|string|minLength:6|maxLength:32|same:confirmPassword",
    confirmPassword: "required|string|minLength:6|maxLength:32"
    }

    const error = await validate(req.body, validationRules);
      if (error) {
        return sendResponse(res, {}, error, 422);
      }

    const { otp, newPassword, confirmPassword , email} = req.body;

    if (!otp || !newPassword || !confirmPassword || !email) {
      return sendResponse(res, {}, message.OTP.FIELDS_REQUIRED, 422);
    }

    if (newPassword !== confirmPassword) {
      return sendResponse(res, {}, message.OTP.PASSWORD_MATCH, 400);
    }

    const user = await User.findOne({ otp , email});
    if (!user) return sendResponse(res, {}, message.USER.NOT_FOUND, 404);

    await user.save();

    return sendResponse(res, {}, message.OTP.PASSWORD_CREATED, 200);
  } catch (error) {
    return sendResponse(res, {}, error.message, 500);
  }
}, 
   verifyOtp : async (req, res) => {
    try {
      const { email, otp } = req.body;
  
      const user = await User.findOne({ email });
  
      if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
        return sendResponse(res, {}, message.OTP.OTP_EXPIRED, 401);
      }
  
      // Clear OTP after successful verification
      user.otp = null;
      user.otpExpiry = null;
      await user.save();
  
      return sendResponse(res, {}, message.OTP.OTP_VERIFIED, 200);
    } catch (error) {
      console.log(error);
      return sendResponse(res, {}, error.message, 500);
    }
  }
  
}