const Member = require("../models/Member");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

const getConversations = async (req, res) => {
  try {
    // await Conversation.deleteMany();
    const conversation = await Conversation.find()
      .populate("members")
      .populate("messages");

    res.status(200).json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const getConversationById = async (req, res) => {
  const id = req.params.id;
  try {
    const conversation = await Conversation.findById(id)
      .populate("members")
      .populate("messages");
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
};
