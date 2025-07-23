const mongoose = require('mongoose');
const messages = require("../Constant/messages")
const User = require("../Models/User")
const {sendResponse} = require("../Helper/ResponseHelper")

module.exports  ={
    getprofile  : async (req, res) => {
    try {
    const userId = req.user.id;
    const user = await User.findById(userId) 
    if (!user) {
      return sendResponse(res, {}, messages.USER.NOT_FOUND, 422);
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('Get Profile Error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
    },
    updateprofile : async (req, res)=>{
        try {
      const userId = req.user.id;
      const { name, mobile, address, hobbies } = req.body;
 
      if (mobile) {
        const existingUser = await User.findOne({ mobile });
 
        console.log(existingUser);
 
        if (existingUser && existingUser._id.toString() !== userId.toString()) {
          return sendResponse(res, {}, "Mobile number already in use", 422);
        }
      }
 
      const updateUser = await User.findByIdAndUpdate(
        userId,
        { name, mobile, address, hobbies },
        { new: true }
      );
      if (!updateUser) {
        return sendResponse(res, {}, messages.USER.NOT_FOUND, 422);
      }
 
      return sendResponse(res, updateUser, messages.USER.UPADATED_USER, 200);
    } catch (error) {
      return sendResponse(res, {}, "server error", 500);
    }
}
}