const messages = require("../Constant/messages");
const { uploadFile } = require("../Helper/FileUploadHelper");
const { sendResponse } = require("../Helper/ResponseHelper");
const Post = require("../Models/Post");
const mongoose = require("mongoose")



module.exports = {
  createPost: async (req, res) => {
    try {
      //console.log("Req body",req.body)

      const userId = req.user.id;

      console.log('userId', userId)

      console.log("userId from JWT:", userId);

      const { title, description } = req.body;
      const media = Array.isArray(req.files?.media) ? req.files?.media : [req.files?.media]



      let uploadedPaths = [];

      for (let i = 0; i < media.length; i++) {
        const uploadedPath = await uploadFile(media[i]);
        uploadedPaths.push({ media: uploadedPath });
      }


      console.log('media files', media)
      // return
      const newPost = new Post({
        user: userId,
        title,
        description,
        media: uploadedPaths,
      });

      await newPost.save();



      return sendResponse(res, newPost, messages.POST.POST_CREATED, 200);
    } catch (error) {
      console.log("error", error);
      return sendResponse(res, {}, messages.GENERAL.SERVER_ERROR, 500);
    }
  },

  getPostList: async (req, res) => {

    try {
      const { userId, search, sort } = req.query;
      const searchRegex = search ? new RegExp(search, "i") : null;


      const matchFilter = {};


      if (userId) {
        matchFilter.user = new mongoose.Types.ObjectId(userId);
      }

      if (search) {
        matchFilter.$or = [
          { title: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
          { "user.name": { $regex: searchRegex } }
        ];
      }

      console.log("matchFilter", matchFilter)

      const sortOrder = sort === "old" ? 1 : -1;

      const posts = await Post.aggregate([

        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user"
          }
        },

        { $unwind: "$user" },

        { $match: matchFilter },


        {
          $project: {
            title: 1,
            description: 1,
            media: 1,
            createdAt: 1,
            "user._id": 1,
            "user.name": 1,

          }
        },
        {
          $sort: { createdAt: sortOrder }
        }
      ]);
      console.log("posts", posts);

      return sendResponse(res, { posts }, messages.POST.POST_FETCHED, 200);

    } catch (error) {
      console.log("error", error);
      return sendResponse(res, {}, messages.GENERAL.SERVER_ERROR, 500);
    }

  },
  updatePost: async (req, res) => {
    try {

      const postId = req.params.postId;

      console.log("postId", postId)


      const { title, description, mediaToDelete } = req.body;

      const post = await Post.findOne({ _id: postId });
      if (!post) {
        return sendResponse(res, {}, "Post not found", 404);
      }

      console.log("posts are    ....", post)
      if (title) post.title = title;
      if (description) post.description = description;

      console.log("Media to delete:", mediaToDelete);

      console.log("Original media:", post.media.map((m) => m._id.toString()));
      

      if (Array.isArray(mediaToDelete) && mediaToDelete.length > 0) {
        post.media = post.media.filter(
          (item) => !mediaToDelete.includes(item._id.toString())
        );
        // console.log("posts media", post.media)
      }

      const newMediaFiles = Array.isArray(req.files?.media)
        ? req.files.media
        : req.files?.media
          ? [req.files.media]
          : [];

      if (newMediaFiles.length > 0) {
        for (const file of newMediaFiles) {
          const uploadedPath = await uploadFile(file);
          post.media.push({ media: uploadedPath });
        }
      }
      console.log("new media files", newMediaFiles)
      await post.save();

      return sendResponse(res, post, "Post updated successfully", 200);
    } catch (error) {
      console.log("error", error)
      console.error("Update Post Error:", error);
      return sendResponse(res, {}, "Server error", 500);
    }
  }
}