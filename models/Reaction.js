const mongoose = require("mongoose");

const reactionSchema = new mongoose.Schema({
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
    required: true,
  },
});

const Reaction = mongoose.model("Reaction", reactionSchema); // Tên collection là "Reaction"
module.exports = Reaction;
