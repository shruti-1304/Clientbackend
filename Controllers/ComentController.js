const messages = require("../Constant/messages")
const { sendResponse } = require("../Helper/ResponseHelper")
const comment = require("../Models/CommentSchema")

module.exports ={
    createComment : async (req , res)=>{
        try{
          const {postId , comment }= req.body
          const userId = req.userId

          const newComment = await comment.create({
            userId,
            postId,
            comment
          })
          return sendResponse(res, newComment, "new comment created", 200)
        }
        catch(error){
          return sendResponse(res, {}, messages.GENERAL.SERVER_ERROR, 500)
        }
    },

    getComment :async (req, res) =>{

    }
}