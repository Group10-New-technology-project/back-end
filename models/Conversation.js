const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      enum: ["Group", "Direct"],
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member", // Tham chiếu tới collection 'Member'
        required: true,
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message", // Tham chiếu tới collection 'Message'
        required: true,
      },
    ],
    pinMessages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: null,
      },
    ],
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member", // Tham chiếu tới collection 'Member'
      required: true,
    },
    deputy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member", // Tham chiếu tới collection 'Member'
        default: null, // Phó nhóm mặc định là null (không có phó nhóm)
      },
    ],
    createAt: {
      type: Date,
      required: true,
    },
    isjoinfromlink: {
      type: Boolean,
      default: false,
    },
    groupImage: {
      type: String,
      default: "",
    },
    notifications: [
      {
        message: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { strict: false }
);

const Conversation = mongoose.model("Conversation", conversationSchema); // Tên collection là "Conversation"
module.exports = Conversation;
