const messages = require("../Constant/messages");
const { sendResponse } = require("../Helper/ResponseHelper");
const Post = require("../Models/Post");

 

module.exports ={
    createPost : async (req, res) => {
  try {
      const userId = req.user.id;
      console.log("userId from JWT:", userId);
 
      const { title, description } = req.body;
      const newPost = new Post({
        user: userId,
        title,
        description,
      });
 
      await newPost.save();

 
     
      return sendResponse(res, newPost, messages.POST.POST_CREATED, 200);
    } catch (error) {
      console.log("error", error);
      return sendResponse(res, {}, messages.GENERAL.SERVER_ERROR, 500);
    }
},

getPostList :async (req, res)=>{
//     try{
//         const posts = await Post.find()
//       .populate("user", "name").lean(); // populate userId field, but only return name
    

//     return  sendResponse(res, posts, messages.POST.POST_LIST, 200);
//     }
//     catch(error){
//          console.error(error);
//     return sendResponse(res, {}, messages.GENERAL.SERVER_ERROR, 500);
  
//     }
// }

try {
      const { search, userId } = req.query;
 
      const filter = {};
 
      // Apply userId filter if passed
      if (userId) {
        filter.user = userId;
      }
 
      // Build regex filter for title or description
      if (search) {
        const searchRegex = new RegExp(search, "i"); // case-insensitive
        filter.$or = [
          { title: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
        ];

      }
 
              console.log('filter',filter)

      // Initial DB query with filters
      const posts = await Post.find(filter).populate({
        path: "user",
        select: "name _id",
      });
 
      return sendResponse(res, posts, messages.POST.POST_FETCHED, 200);
    } catch (error) {
      console.log("error", error);
      return sendResponse(res, {}, messages.GENERAL.SERVER_ERROR, 500);
    }

}
}