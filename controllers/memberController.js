const Member = require("../models/Member");

const createMember = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(userId);

    if (!userId) {
      return res.status(400).json({ error: "Missing userId in request body" });
    }
    const member = new Member({
      userId,
      isNotify: true,
      lastSeen: new Date(),
    });

    await member.save();
    res.status(201).json(member);
  } catch (error) {
    console.error("Error creating member:", error);
    res.status(500).json({ error: "Server error occurred" });
  }
};

const getMemberbyUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(userId);
    const member = await Member.findOne({ userId: userId });
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }
    res.json(member);
  } catch (error) {
    console.error("Error getting member:", error);
    res.status(500).json({ error: "Server error occurred" });
  }
};

const getMemberbyId = async (req, res) => {
  try {
    const memberId = req.params.memberId; // hoặc req.params._id
    const member = await Member.findOne({ _id: memberId });
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }
    res.json(member);
  } catch (error) {
    console.error("Error getting member:", error);
    res.status(500).json({ error: "Server error occurred" });
  }
};

// get all member
const getAllMember = async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (error) {
    console.error("Error getting members:", error);
    res.status(500).json({ error: "Server error occurred" });
  }
};

module.exports = {
  createMember,
  getMemberbyUserId,
  getAllMember,
  getMemberbyId,
};
