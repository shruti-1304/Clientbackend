const messages = require("../Constant/messages")
const { sendResponse } = require("../Helper/ResponseHelper")
const Comment = require("../Models/CommentSchema")

module.exports ={
    createComment : async (req , res)=>{
        try{
          console.log("req.userId:", req.userId);
          const {postId , comment }= req.body
          const userId = req.userId
           //console.log("userid", userId)
          if (!postId || !comment) {
        return sendResponse(res, {}, "Post ID and comment are required", 400);
      }
          console.log("postId is ", postId)
        
          const newComment = await Comment.create({
            userId,
            postId,
            comment
          })
          return sendResponse(res, newComment, "new comment created", 200)
        }
        catch(error){
          console.log("error",error)
          return sendResponse(res, {}, messages.GENERAL.SERVER_ERROR, 500)
        }
    },

    getComment :async (req, res) =>{

    }
}