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
    const { userId, name, title } = req.query;

    let filter = {};

    if (userId) {
      filter.user = userId;
    }

    if(search){
        
    }

    if (title) {
      filter.title = title; // case-insensitive {$regex: title, $options: "i" } 
    }

    // For user name, since it's in the referenced user collection, we handle it in populate + match
    const posts = await Post.find(filter)
      .populate({
        path: "user",
        select: "name",
        match:  name ? { name: { $regex: name, $options: "i" } } : {}
      
      })

    // Remove posts where populate returned null (i.e. name did not match)
    const filteredPosts = posts.filter(post => post.user !== null);

    return sendResponse(res, filteredPosts, messages.POST.POST_LIST, 200);
  } catch (error) {
    console.error(error);
    return sendResponse(res, {}, messages.GENERAL.SERVER_ERROR, 500);
  }
 
}
}
