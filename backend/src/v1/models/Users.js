const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * @desc  User Schema models
 */
var UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
User.createIndexes();
module.exports = User;
