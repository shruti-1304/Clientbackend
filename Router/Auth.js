const express = require("express");
const router = express.Router();
const { registerUser, loginUser , forgetPasswordSendOtp} = require("../Controllers/AuthControllers");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgetPasswordSendOtp", forgetPasswordSendOtp)

module.exports = router;