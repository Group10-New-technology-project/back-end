const User = require("../models/User");
const PhoneBook = require("../models/PhoneBook");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const signup = async (req, res) => {
  const { username, password, dateofbirth, gender, name } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }
    const newUser = new User({
      username,
      password,
      avatar: "",
      coveravatar: "",
      dateofbirth,
      gender,
      name,
      phoneBook: [],
      friends: [],
      friendRequest: [],
      isActive: true,
      isAdmin: false,
      isDelete: false,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const getfriend = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const user = await User.findById(id);
    console.log(user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const friendIds = user.friends;
    const friends = await User.find({ _id: { $in: friendIds } });
    res.status(200).json(friends);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const getPhoneBook = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const phoneBook = user.phoneBook;
    const listphoneBook = await PhoneBook.find({ _id: { $in: phoneBook } }); // Sử dụng PhoneBook thay vì User
    res.status(200).json(listphoneBook);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  login,
  signup,
  getfriend,
  getPhoneBook,
};
