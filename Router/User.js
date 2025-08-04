const express = require("express");
const router = express.Router();
const { verifyOtp, resetPassword } = require("../Controllers/OtpController");
const authMiddleware = require("../Middleware/AuthMiddleware");
const { updatePassword } = require("../Controllers/UserController");
const { getprofile, updateprofile } = require("../Controllers/SettingController");
const { createPost, getPostList, updatePost } = require("../Controllers/PostController");
const { createComment, deleteComment, getComment } = require("../Controllers/CommentController");
const { toggleLike } = require("../Controllers/LikeController");
const { addCategory, getCategory, deleteCategory, updateCategory } = require("../Controllers/CategoryController");
const { addSubCategory, getSubCategoriesByCategory, deleteSubCategory, updateSubCategory } = require("../Controllers/SubCategoryController");
const { addHobby, getHobbiesBySubCategory, deleteHobby, updateHobby } = require("../Controllers/HobbyController");
const { addArticle, getArticles, updateArticle, deleteArticle } = require("../Controllers/ArticleController");

router.post("/verifyotp", verifyOtp)
router.post("/resetpassword", resetPassword)
router.post("/update-password", authMiddleware, updatePassword)
router.get("/profile", authMiddleware, getprofile);
router.put("/profile", authMiddleware, updateprofile);
router.post("/create-post", authMiddleware, createPost)
router.get("/get-posts", authMiddleware, getPostList)
router.put("/update-post/:postId", authMiddleware, updatePost)
router.post("/create-comment", authMiddleware, createComment)
router.post("/create-like", authMiddleware, toggleLike)
router.delete("/delete-comment/:commentId", authMiddleware, deleteComment)
router.get("/get-comment", authMiddleware, getComment)
router.post("/add-category", authMiddleware, addCategory)
router.get("/get-category", authMiddleware, getCategory)
router.delete("/delete-category/:id", authMiddleware, deleteCategory)
router.put("/update-category/:id", authMiddleware, updateCategory)
router.post("/add-subCategory", authMiddleware, addSubCategory)
router.get("/get-subCategory/:categoryId", authMiddleware, getSubCategoriesByCategory)
router.delete("/delete-subCategory/:id", authMiddleware, deleteSubCategory)
router.put("/update-subCategory/:id", authMiddleware, updateSubCategory)
router.post("/add-hobby", authMiddleware, addHobby)
router.get("/get-hobby/:subCategoryId", authMiddleware, getHobbiesBySubCategory)
router.delete("/delete-hobby/:id", authMiddleware, deleteHobby)
router.put("/update-hobby/:id", authMiddleware, updateHobby)
router.post("/post-article", authMiddleware,addArticle)
router.get("/get-article", authMiddleware, getArticles)
router.put("/update-article/:id", authMiddleware, updateArticle);
router.delete("/delete-article/:id", authMiddleware, deleteArticle)
module.exports = router;