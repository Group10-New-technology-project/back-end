const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  post_at: {
    type: Date,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: [String], // Mảng các đường dẫn tới hình ảnh
    default: [],
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId, // Tham chiếu tới ID của người đăng
    ref: "User", // Tham chiếu tới collection 'User'
    required: true,
  },
  isProject: {
    type: Boolean,
    default: false,
  },
  isDelete: {
    type: Boolean,
    default: false,
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment", // Tham chiếu tới collection 'Comment'
    },
  ],
  like: {
    type: Number,
    default: 0,
  },
});

const Post = mongoose.model("Post", postSchema); // Tên collection là "Post"
module.exports = Post;
