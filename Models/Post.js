const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: String,
  description: String,
  media: [{
   media: { type: String }, 
    
  }
  ],
 // status : Boolean,
 likesCount: {
    type: Number,
    default: 0,
  },
  commentCount:{
    type :Number,
    default:0,
  } ,
 // isLike:Boolean
},

 {
    timestamps: true,
  }
 
);

module.exports = mongoose.model("Post", postSchema);
