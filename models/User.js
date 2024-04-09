const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const friendRequestSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    ref: "User", // Tham chiếu tới collection 'User đã gửi' (chính collection hiện tại)
  },
  date: {
    type: Date,
    required: false,
  },
  content: {
    type: String,
    required: false,
  },
});
const userSchema = new Schema(
  {
    avatar: {
      type: String,
      required: false,
    },
    coveravatar: {
      type: String,
      required: false,
    },
    dateofbirth: {
      type: Date,
      required: false,
    },
    gender: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    phoneBook: [
      {
        type: Schema.Types.ObjectId,
        ref: "PhoneBook", // Tham chiếu tới collection 'PhoneBook'
      },
    ],
    isDelete: {
      type: Boolean,
      default: false,
    },

    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User", // Tham chiếu tới collection 'User' (chính collection hiện tại)
      },
    ],
    friendRequest: [friendRequestSchema],
    friendReceived: [friendRequestSchema],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema); // Tên collection là "User"
module.exports = User;
