const Member = require("../models/Member");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const Members = require("../models/Member");
const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find()
      .populate({
        path: "members",
        populate: {
          path: "userId",
          model: "User", // Tên của model người dùng trong Mongoose
        },
      })
      .populate("messages");

    res.status(200).json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const getConversationById = async (req, res) => {
  const id = req.params.id;
  try {
    const conversation = await Conversation.findById(id).populate("members").populate("messages");
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    res.status(200).json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const getConversationByMemberId = async (req, res) => {
  try {
    const memberId = req.params.memberId;
    const conversations = await Conversation.find({ members: memberId });
    if (!conversations) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    res.status(200).json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
const getConversationByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Tìm các thành viên có userId trùng khớp
    const members = await Members.find({ userId: userId });
    if (!members || members.length === 0) {
      return res.status(200).json([]);
    }

    const memberId = members[0]._id;
    console.log("menid da lay", memberId);
    const conversations = await Conversation.find({
      members: memberId,
    })
      .populate({
        path: "members",
        populate: {
          path: "userId",
          model: "User", // Tên của model người dùng trong Mongoose
        },
      })
      .populate({
        path: "messages",
        populate: {
          path: "memberId",
          model: "Member", // Tên của model người dùng trong Mongoose
        },
      });
    if (!conversations) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    res.status(200).json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
const seachConversation = async (req, res) => {
  try {
    const searchKeyword = req.query.searchConversation;
    console.log(searchKeyword);
    const conversations = await Conversation.find({
      $or: [{ name: { $regex: searchKeyword, $options: "i" } }],
    });
    res.status(200).json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getConversations,
  getConversationById,
  getConversationByMemberId,
  seachConversation,
  getConversationByUserId,
};
