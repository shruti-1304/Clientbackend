const express = require("express");
const router = express.Router();
const {verifyOtp, resetPassword} = require("../Controllers/OtpController");
const authMiddleware = require("../Middleware/AuthMiddleware");
const { updatePassword } = require("../Controllers/UserController");
const {getprofile, updateprofile} = require("../Controllers/SettingController")
router.post("/verifyotp", verifyOtp)
router.post("/resetpassword", resetPassword)
router.post("/update-password", authMiddleware, updatePassword)
router.get("/profile", authMiddleware, getprofile);   
router.put("/profile", authMiddleware, updateprofile); 

module.exports = router;