const mongoose = require('mongoose');
const messages = require("../Constant/messages")
const { sendResponse } = require("../Helper/ResponseHelper")
const Comment = require("../Models/CommentSchema")
const Post = require("../Models/Post")


module.exports = {
  createComment: async (req, res) => {
    try {
      const { postId, comment } = req.body
      const userId = req.user.id
      console.log("userid", userId)

      if (!postId || !comment) {
        return sendResponse(res, {}, "Post ID and comment are required", 401);
      }
      const post = await Post.findById(postId)
      if (!post) {
        return sendResponse(res, {}, "Post not found", 404);
      }
      //create a new comment 
      const newComment = await Comment.create({
        userId,
        postId,
        comment
      })

      post.commentCount += 1;
      await post.save();
      return sendResponse(res, newComment, "new comment created", 200)
    }
    catch (error) {
      console.log("error", error)
      return sendResponse(res, {}, messages.GENERAL.SERVER_ERROR, 500)
    }
  },

  getComment: async (req, res) => {
    try {
      const { postId } = req.query;

      if (!postId) {
        return sendResponse(res, {}, "Post ID is required", 401);
      }

      // Check if post exists
      const post = await Post.findById(postId);
      if (!post) {
        return sendResponse(res, {}, "Post not found", 404);
      }

      // Fetch comments for the post, optionally populate user data
      const comments = await Comment.find({ postId })
        .populate("userId", "name email") // only include name & email of user
        .sort({ createdAt: -1 }); // latest first

      return sendResponse(res, comments, "Comments fetched successfully", 200);
    } catch (error) {
      console.log("Get comment error:", error);
      return sendResponse(res, {}, messages.GENERAL.SERVER_ERROR, 500);
    }
  }
  ,
  deleteComment: async (req, res) => {
    try {
      const commentId = req.params.commentId;
      console.log("commnet id", commentId)
      const userId = req.user.id;

      console.log("Type of userId:", userId);

      if (!commentId) {
        return sendResponse(res, {}, "Comment ID is required", 422);
      }

      const comment = await Comment.findOne({_id:commentId, userId});

      
      console.log("comment", comment)



      if (!comment) {
        return sendResponse(res, {}, "Comment not found", 422);
      }



      // Delete the comment
      await Comment.findByIdAndDelete(commentId);

      // Decrement comment count on the post
      const post = await Post.findById(comment.postId);
      if (post) {
        post.commentCount = Math.max(0, post.commentCount - 1);
        await post.save();
      }

      return sendResponse(res, {}, "Comment deleted successfully", 200);

    } catch (error) {
      console.log("Delete comment error:", error);
      return sendResponse(res, {}, messages.GENERAL.SERVER_ERROR, 500);
    }
  }
}