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
        uploadedPaths.push(uploadedPath);
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
  updatePost : async (req, res)=>{
       try{
       
       }
       catch(error){

       }
  }
}