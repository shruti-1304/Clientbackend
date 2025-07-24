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

 
     
      return sendResponse(res, newPost, "Post created successfully", 200);
    } catch (error) {
      console.log("error", error);
      return sendResponse(res, {}, messages.GENERAL.SERVER_ERROR, 500);
    }
},

getPostList :async (req, res)=>{
    try{
        const posts = await Post.find()
      .populate("user", "name").lean(); // populate userId field, but only return name
    

    return  sendResponse(res, posts, "post list ", 200);
    }
    catch(error){
         console.error(error);
    return sendResponse(res, {}, messages.GENERAL.SERVER_ERROR, 500);
  
    }
}
 

}
