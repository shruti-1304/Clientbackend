const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,ref: "User",
    },
    postId :{
       type:mongoose.Schema.Types.ObjectId, ref:"Post"
    },
    comment:String,
   
},
 {
    timestamps: true,
  }
 
)
module.exports = mongoose.model("Comment", commentSchema);