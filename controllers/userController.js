const User = require('../models/User');
const PhoneBook = require('../models/PhoneBook');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username ' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    if (user && validPassword) {
      return res.status(200).json({ user });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const signup = async (req, res) => {
  const { username, password } = req.body;
  try {
    console.log(username, password);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const existingUser = await User.findOne({ username }).lean();
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    const newUser = new User({
      username,
      password: hashedPassword,
      avatar: '',
      coveravatar: '',
      dateofbirth: new Date(),
      gender: 'Không xác định',
      name: 'user',
      phoneBook: [],
      friends: [],
      friendRequest: [],
      isActive: true,
      isAdmin: false,
      isDelete: false
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
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

const getAllUser = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json("Delete successfully");
  } catch (err) {
    res.status(500).json(err);
  }
};

// const checkUser = async (req, res) => {
//   const { username } = req.body;
//   try {
//     const user = await User.findByUsername(req.);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
  
//   }
// }
// , passwordOld, passwordNew, passwordReNew 

//check user
const checkUser = async (req, res) => {
  const { username } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username ' });
    }
    if (user) {
      return res.status(200).json({ user });
    }
  }catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateMK = async (req, res) => {
  const { username , passwordOld, passwordNew, passwordReNew} = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username' });
    }
    const validPassword = await bcrypt.compare(passwordOld, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    console.log("1", validPassword)
    console.log("2", user.password)
    if (passwordNew !== passwordReNew) {
      return res.status(401).json({ error: 'Invalid Newpassword' });
    }
    // Cập nhật mật khẩu mới trong cơ sở dữ liệu
    const salt = await bcrypt.genSalt(10);
    const hashedPasswordNew = await bcrypt.hash(passwordNew, salt);
    user.password = hashedPasswordNew; // Không cần mã hóa mật khẩu mới
    await user.save();

    // Gửi phản hồi thành công
    res.status(200).json({ message: 'Password updated successfully' });

   
  }catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  login,
  signup,
  getfriend,
  getPhoneBook,
  getAllUser,
  deleteUser,
  updateMK,
};
