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
    enum: ["text", "image", "video", "audio", "file", "notify"], // Thể loại tin nhắn có thể là văn bản, hình ảnh, video hoặc âm thanh
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
  pin: {
    type: Boolean,
    default: false,
  },
  reaction: [
    {
      memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
        required: true,
      },
      reactions: [
        {
          typeReaction: {
            type: String,
            required: true,
          },
          status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
          },
          quantity: {
            type: Number,
          },
        },
      ],
    },
  ],

  tag: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member", // Tham chiếu tới collection 'Member' cho danh sách các thành viên được gắn thẻ
    },
  ],
  reply: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message", // Tham chiếu tới collection 'Message' cho danh sách các tin nhắn được trả lời
    },
  ],
});

const Message = mongoose.model("Message", messageSchema); // Tên collection là "Message"
module.exports = Message;
