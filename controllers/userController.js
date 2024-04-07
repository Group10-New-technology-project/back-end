const User = require("../models/User");
const PhoneBook = require("../models/PhoneBook");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const AWS = require("aws-sdk");
const bcrypt = require("bcrypt");
// Cấu hình AWS
AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});
const s3 = new AWS.S3();

// Cấu hình multer để xử lý tải lên ảnh
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn kích thước file 5MB
  },
});

// const login = async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const user = await User.findOne({ username });
//     if (!user || user.password !== password) {
//       return res.status(401).json({ error: "Invalid email or password" });
//     }
//     res.status(200).json({ user });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error" });
//   }
// };
const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid username " });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid password" });
    }
    if (user && validPassword) {
      return res.status(200).json({ user });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const signup = async (req, res) => {
  const { username, password, name, birthday, gender, imageAvatar } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }
    const newUser = new User({
      username: username,
      password: hashedPassword,
      avatar: imageAvatar,
      coveravatar: "",
      dateofbirth: birthday,
      gender: gender,
      name: name,
      phoneBook: [],
      friends: [],
      friendRequest: [],
      isActive: true,
      isAdmin: false,
      isDelete: false,
    });
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
    console.log("Đăng ký thành công");
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
const getUserByID = async (req, res) => {
  try {
    const user = await User.findById(req.body.id);
    res.status(200).json("Delete successfully");
  } catch (err) {
    res.status(500).json(err);
  }
};
//Update ảnh user
const uploadAvatarToS3 = async (req, res) => {
  try {
    const { username } = req.body;
    const { originalname, buffer, mimetype } = req.file;

    // Tải lên ảnh lên Amazon S3
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${username}_${Date.now()}_${originalname}`,
      Body: buffer,
      ContentType: mimetype,
    };
    const uploadResult = await s3.upload(params).promise();

    // Cập nhật URL hình ảnh của người dùng trong MongoDB
    const updatedUser = await User.findOneAndUpdate(
      { username: username }, // Điều kiện tìm kiếm người dùng
      { $set: { avatar: uploadResult.Location } }, // Dữ liệu cập nhật
      { new: true } // Trả về người dùng sau khi cập nhật
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      message: "Avatar uploaded and user updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error uploading avatar and updating user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateMK = async (req, res) => {
  const { username, passwordOld, passwordNew, passwordReNew } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid username" });
    }
    const validPassword = await bcrypt.compare(passwordOld, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid password" });
    }
    console.log("1", validPassword);
    console.log("2", user.password);
    if (passwordNew !== passwordReNew) {
      return res.status(401).json({ error: "Invalid Newpassword" });
    }
    // Cập nhật mật khẩu mới trong cơ sở dữ liệu
    const salt = await bcrypt.genSalt(10);
    const hashedPasswordNew = await bcrypt.hash(passwordNew, salt);
    user.password = hashedPasswordNew; // Không cần mã hóa mật khẩu mới
    await user.save();

    // Gửi phản hồi thành công
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const postUserByUserName = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found  ko ton tai " });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const forgotPassword = async (req, res) => {
  const { username, passwordNew } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid username" });
    }
    // if (passwordNew !== passwordReNew) {
    //   return res.status(401).json({ error: "New passwords do not match" });
    // }
    // Cập nhật mật khẩu mới trong cơ sở dữ liệu
    const salt = await bcrypt.genSalt(10);
    const hashedPasswordNew = await bcrypt.hash(passwordNew, salt);
    user.password = hashedPasswordNew;
    await user.save();

    // Gửi phản hồi thành công
    res.status(200).json({ message: "Password updated successfully" });
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
  getAllUser,
  deleteUser,
  uploadAvatarToS3,
  updateMK,
  postUserByUserName,
  forgotPassword,
};
