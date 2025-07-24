const express = require("express");
const router = express.Router();
const { registerUser, loginUser , forgetPasswordSendOtp} = require("../Controllers/AuthControllers");
const { requestLoginOtp } = require("../Controllers/SendOtpController");
const { verifyEmailOtp } = require("../Controllers/EmailVerifyController");


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgetPasswordSendOtp", forgetPasswordSendOtp)
router.post("/email-login", requestLoginOtp )
router.post("/verifyemail", verifyEmailOtp )

module.exports = router;