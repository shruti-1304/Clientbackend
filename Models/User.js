const mongoose = require("mongoose");
 const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: {
      type : String,
      unique: true,
      sparse: true
    },
    mobile: Number,
    address: String,
    status: Boolean,
    hobbies: Array,

    otp: String,
    otpExpiry: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  // Only hash if password is new or modified
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(this.password, salt);
    this.password = hashed;
    next(); // move to the next middleware or save operation
  } catch (err) {
    next(err); // pass error to save()'s catch
  }
});

 
module.exports = mongoose.model("User", userSchema);