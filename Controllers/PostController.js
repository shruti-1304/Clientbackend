const messages = require("../Constant/messages");
const { sendResponse } = require("../Helper/ResponseHelper");
const Post = require("../Models/Post");
const mongoose = require("mongoose")

 

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


// try {
//       const { search, userId } = req.query;
 
//       const filter = {};
 
//       // Apply userId filter if passed
//       if (userId) {
//         filter.user = userId;

//       }
 
//       // Build regex filter for title or description
//       if (search) {
//         const searchRegex = new RegExp(search, "i"); // case-insensitive
//         filter.$or = [
//           { title: { $regex: searchRegex } },
//           { description: { $regex: searchRegex } },
//         ];

//       }
 
//               console.log('filter',filter)

//       // Initial DB query with filters
//       const posts = await Post.find(filter).populate({
//         path: "user",
//         select: "name _id",
//       });
 
//       return sendResponse(res, posts, messages.POST.POST_FETCHED, 200);
//     } catch (error) {
//       console.log("error", error);
//       return sendResponse(res, {}, messages.GENERAL.SERVER_ERROR, 500);
//     }

// }
try {
  const { userId, search } = req.query;
  const searchRegex = search ? new RegExp(search, "i") : null;
  console.log("seacrhRegex", searchRegex )

  const matchFilter = {};
  

  if (userId) {
    matchFilter.user = new mongoose.Types.ObjectId(userId);
  }

  // Step 2: Filter by title/description (we'll handle user.name later)
  // if (search) {
  //   matchConditions.push({
  //     $or: [
  //       { title: { $regex: searchRegex } },
  //       { description: { $regex: searchRegex } },
  //       {name : { $regex: searchRegex}}
  //     ]
  //   });
  // }

 
  const posts = await Post.aggregate([
    
    { $match: matchFilter },

    // Join with user collection
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user"
      }
    },

    // Convert user array to object
    { $unwind: "$user" },

    // Search by user.name if search is given
    ...(search
      ? [
          {
            $match: {
              $or: [
                { title: { $regex: searchRegex } },
                { description: { $regex: searchRegex } },
                { "user.name": { $regex: searchRegex } }
              ]
            }
          }
        ]
      : []
    ),

    // Select only required fields
    {
      $project: {
        title: 1,
        description: 1,
        createdat:1,
        "user._id": 1,
        "user.name": 1
      }
    }
  ]);

  console.log("posts ", posts)

  
  return sendResponse(res, posts, messages.POST.POST_FETCHED, 200);
} catch (error) {
  console.log("error", error);
  return sendResponse(res, {}, messages.GENERAL.SERVER_ERROR, 500);
}

}
}