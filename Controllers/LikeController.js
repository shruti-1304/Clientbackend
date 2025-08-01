const messages = require("../Constant/messages");
const { sendResponse } = require("../Helper/ResponseHelper");
const Like = require("../Models/LikesSchema");
const Post = require("../Models/Post");
const validator = require("validator");

module.exports = {
  toggleLike: async (req, res) => {
    try {
      const { postId } = req.body;
      const userId = req.user.id;

      if (!postId) {
        return sendResponse(res, {}, "Post ID is required", 400);
      }

      if (!validator.isMongoId(postId)) {
        return sendResponse(res, {}, "Invalid Post ID", 400);
      }

      const post = await Post.findById(postId);
      if (!post) {
        return sendResponse(res, {}, "Post not found", 404);
      }

      const existingLike = await Like.findOne({ postId, userId });

      if (existingLike) {
        // Remove from DB and decrement count
        await existingLike.deleteOne();
        post.likesCount = Math.max(0, post.likesCount - 1);
        await post.save();

        return sendResponse(res, {}, "Post unliked", 200);
      } else {
        // Create in DB and increment count
        const newLike = await Like.create({ postId, userId });
        post.likesCount += 1;
        await post.save();

        return sendResponse(res, newLike, "Post liked", 201);
      }
    } catch (err) {
      console.error("Toggle like error:", err);
      return sendResponse(res, {}, messages.GENERAL.SERVER_ERROR, 500);
    }
  },
};
