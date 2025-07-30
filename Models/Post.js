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
   
},
 
 {
    timestamps: true,
  }
 
);

module.exports = mongoose.model("Post", postSchema);
