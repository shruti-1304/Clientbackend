const express = require("express");
const router = express.Router();
const { verifyOtp, resetPassword } = require("../Controllers/OtpController");
const authMiddleware = require("../Middleware/AuthMiddleware");
const { updatePassword } = require("../Controllers/UserController");
const { getprofile, updateprofile } = require("../Controllers/SettingController");
const { createPost, getPostList, updatePost } = require("../Controllers/PostController");
const { createComment } = require("../Controllers/ComentController");
const { toggleLike } = require("../Controllers/LikeController");

router.post("/verifyotp", verifyOtp)
router.post("/resetpassword", resetPassword)
router.post("/update-password", authMiddleware, updatePassword)
router.get("/profile", authMiddleware, getprofile);
router.put("/profile", authMiddleware, updateprofile);
router.post("/create-post", authMiddleware, createPost)
router.get("/get-posts", authMiddleware, getPostList)
router.put("/update-post/:postId", authMiddleware, updatePost)
router.post("/create-comment", authMiddleware, createComment)
router.post("/create-like", authMiddleware, toggleLike )



module.exports = router;