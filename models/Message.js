const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member", // Tham chiếu tới collection 'Member'
    required: true,
  },
  type: {
    type: String,
    enum: ["text", "image", "video", "audio", "file"], // Thể loại tin nhắn có thể là văn bản, hình ảnh, video hoặc âm thanh
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  deleteMember: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member", // Tham chiếu tới collection 'Member' cho danh sách các thành viên đã xóa tin nhắn
    },
  ],
  recallMessage: {
    type: Boolean,
    default: false,
  },
  reaction: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reaction", // Tham chiếu tới collection 'Reaction' cho danh sách các phản ứng
    },
  ],
  tag: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member", // Tham chiếu tới collection 'Member' cho danh sách các thành viên được gắn thẻ
    },
  ],
});

const Message = mongoose.model("Message", messageSchema); // Tên collection là "Message"
module.exports = Message;
