const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,ref: "User",
    },
    postId :{
       type:mongoose.Schema.Types.ObjectId, ref:"Post"
    },
    Comment:String,
   
},
 {
    timestamps: true,
  }
 
)
module.exports = mongoose.model("CommentSchema", commentSchema );