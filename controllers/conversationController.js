const Member = require("../models/Member");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const Members = require("../models/Member");
//1
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
//2
const getConversationById = async (req, res) => {
  const id = req.params.id;
  try {
    const conversation = await Conversation.findById(id)
      .populate({
        path: "members",
        populate: {
          path: "userId",
          model: "User",
        },
      })
      .populate({
        path: "messages",
        populate: {
          path: "memberId",
          model: "Member",
        },
      })
      .populate({
        path: "messages",
        populate: {
          path: "deleteMember",
          model: "Member",
        },
      });
    if (!conversation) {
      return res.status(404).json([]);
    }
    res.status(200).json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json([]);
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
    const members = await Members.find({ userId: userId });
    if (!members || members.length === 0) {
      return res.status(200).json([]);
    }

    const memberId = members[0]._id;

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
      return res.status(404).json([]);
    }
    res.status(200).json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json([]);
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

const getConversationByIdApp = async (req, res) => {
  const id = req.params.id;
  console.log("id", id);
  try {
    const conversation = await Conversation.findById(id)
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
          populate: {
            path: "userId",
            model: "User",
            select: "avatar",
          },
        },
      });
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    res.status(200).json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
const createConversation = async (req, res) => {
  try {
    const { name, type, members, leader } = req.body;
    const conversation = new Conversation({
      name,
      type,
      members,
      messages: [],
      groupImage: "",
      leader,
      createAt: new Date(),
      isjoinfromlink: true,
    });
    await conversation.save();
    res.status(201).json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
const createConversationWeb = async (req, res) => {
  try {
    const { userId1, userId2 } = req.body;

    // Tìm thông tin thành viên thứ nhất
    const member1 = await Member.findOne({ userId: userId1 });
    if (!member1) {
      return res.status(404).json({ error: `Member with userId ${userId1} not found` });
    }

    // Tìm thông tin thành viên thứ hai
    const member2 = await Member.findOne({ userId: userId2 });
    if (!member2) {
      return res.status(404).json({ error: `Member with userId ${userId2} not found` });
    }

    // Kiểm tra xem đã tồn tại cuộc hội thoại giữa hai thành viên chưa
    const existingConversation = await Conversation.findOne({
      members: { $all: [member1._id, member2._id] },
      type: "Direct", // Loại cuộc hội thoại là Direct (tùy theo yêu cầu)
    });

    if (existingConversation) {
      return res.status(400).json([]);
    }

    // Tạo cuộc hội thoại mới nếu chưa tồn tại
    const newConversation = new Conversation({
      name: `Chat ${member1.userId} and ${member2.userId}`,
      type: "Direct",
      members: [member1._id, member2._id],
      messages: [],
      groupImage: "",
      leader: member1._id, // Thành viên thứ nhất là người chủ đề
      createAt: new Date(),
      isjoinfromlink: false,
    });
    await newConversation.save();
    res.status(201).json(newConversation);
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({ error: "Server error occurred" });
  }
};

module.exports = {
  getConversations,
  getConversationById,
  getConversationByMemberId,
  seachConversation,
  getConversationByIdApp,
  getConversationByUserId,
  createConversation,
  createConversationWeb,
};
