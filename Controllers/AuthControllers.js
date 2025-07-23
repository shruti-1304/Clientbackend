const User = require("../Models/User");
const messages = require("../Constant/messages");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../Helper/JwtHelper");
const { sendResponse } = require("../Helper/ResponseHelper");
const validate = require("../Helper/ValidationHelper")
const { sendMail } = require("../Helper/MailHelper");
const generateOtp = require("../Helper/Otpgenerate");
module.exports = {
  registerUser: async (req, res) => {
    try {

       const validationRules = {
        name: "required|string",
        email: "required|email",
        password: "required|string|minLength:6|maxLength:32",
        mobile: "required|numeric|minLength:10|maxLength:15",
        address: "required|string",
        status: "required|boolean",
        hobbies: "array",
      };
 
      const error = await validate(req.body, validationRules);
      if (error) {
        return sendResponse(res, {}, error, 422);
      }

      const { name, email, password, mobile, address, status, hobbies } =
        req.body;
 
      const existingUser = await User.findOne({ email });
 
      if (existingUser) {
        return sendResponse(res, {}, messages.AUTH.USER_ALREADY_CREATED, 404);
      }
 
      const existingUserByMobile = await User.findOne({ mobile });
    if (existingUserByMobile) {
      return sendResponse(res, {}, "Mobile number already in use", 409);
    }
      const newUser = new User({
        name,
        email,
        password,
        mobile,
        address,
        status,
        hobbies,
      });
 
      await newUser.save();
 
      return sendResponse(res, newUser, messages.USER.CREATED, 201);
    } catch (error) {
      return sendResponse(res, {}, error.message, 500);
    }
  },
  loginUser: async (req, res) => {
    try {
    const validaterules2 = {
        email: "required|email",
        password: "required|string|minLength:6|maxLength:32",
    }
     const error = await validate(req.body, validaterules2);
      if (error) {
        return sendResponse(res, {}, error, 422);
      }
      const { email, password } = req.body;
      const user = await User.findOne({ email });
         console.log(user)
      if (!user) {
        return sendResponse(res, {}, messages.AUTH.USER_NOT_FOUND, 401);
      }
 
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return sendResponse(res, {}, messages.AUTH.UNAUTHORIZED, 401);
      }
 
      const payload = { id: user._id , email: user.email, name: user.name };
 
      const token = generateToken(payload);
 
      return sendResponse(
        res,
        { user: user, token },
        messages.AUTH.LOGIN_SUCCESS,
        200
      );
    } catch (error) {
      console.log(error)
      return sendResponse(res, {}, error.message, 500);
    }
  },

  forgetPasswordSendOtp: async (req, res)=>{
    try {
    const validaterules2 ={
       email: "required|email",
    }
     const error = await validate(req.body, validaterules2);
      if (error) {
        return sendResponse(res, {}, error, 422);
      }
    const { email } = req.body;

    if (!email) return sendResponse(res, {}, "Email is required", 422);

    const user = await User.findOne({ email });
    if (!user) return sendResponse(res, {}, messages.USER.NOT_FOUND, 422);

    const otp = generateOtp() // 6 digit OTP
    const expiry = Date.now() + 20 * 60 * 1000; // 10 minutes from now

    user.otp = otp;
    user.otpExpiry = expiry;
    await user.save();

    await sendMail(email, "Password Reset OTP", `Your OTP is: ${otp}`);

    return sendResponse(res, {}, messages.OTP.OTP_SENT, 200);
  } catch (error) {
    console.log('error',error)
    return sendResponse(res, {}, error.message, 500);
  }
  },
  
};
 