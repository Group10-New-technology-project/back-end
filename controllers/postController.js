const User = require("../models/User");
const Comment = require("../models/Comment");

const Post = require("../models/Post");

const getPostsOfUser = async (req, res) => {
  const userId = req.params.userId; // ID của người dùng
  console.log(userId);
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const friendIds = user.friends.map((friend) => friend._id);
    friendIds.push(userId);
    const posts = await Post.find({ user_id: { $in: friendIds } });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getPostsOfUser,
};
