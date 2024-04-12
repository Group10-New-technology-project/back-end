const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Tham chiếu tới collection 'User'
    required: true,
  },
  isNotify: {
    type: Boolean,
    default: true,
  },
  lastSeen: {
    type: Date,
    required: true,
  },
});

const Member = mongoose.model("Member", memberSchema); // Tên collection là "Member"
module.exports = Member;
