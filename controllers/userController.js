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
      coveravatar: "https://i.pinimg.com/564x/7b/8f/3a/7b8f3a829162b7656214494b0b87e4e0.jpg",
      dateofbirth: birthday,
      gender: gender,
      name: name,
      phoneBook: [],
      friends: [],
      friendRequest: [],
      friendReceived: [],
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
  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const friendIds = user.friends;
    res.status(200).json(friendIds);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const getFriendWithDetails = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id).populate("friends");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user.friends);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteFriends = async (req, res) => {
  const { id_sender, id_receiver } = req.body;
  try {
    // Tìm người gửi và người nhận dựa trên id_sender và id_receiver
    const sender = await User.findById(id_sender);
    const receiver = await User.findById(id_receiver);
    // Kiểm tra xem người gửi và người nhận có tồn tại không
    if (!sender || !receiver) {
      return res.status(400).json({ error: "Sender or receiver not found" });
    }
    // Loại bỏ yêu cầu kết bạn khỏi mảng friendRequest của người gửi
    sender.friends = sender.friends.filter((requestId) => requestId.toString() !== id_receiver);
    // Loại bỏ yêu cầu kết bạn khỏi mảng friendReceived của người nhận
    receiver.friends = receiver.friends.filter((requestId) => requestId.toString() !== id_sender);
    // Lưu các thay đổi vào cơ sở dữ liệu
    await sender.save();
    await receiver.save();
    // Trả về phản hồi thành công
    res.status(200).json({ sender, receiver });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
const getfriendRecivedWeb = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const friendIds = user.friendReceived;

    // Mảng để lưu thông tin của các bạn bè
    const friendsInfo = [];

    // Duyệt qua mảng friendIds để lấy thông tin của từng bạn bè
    for (const friend of friendIds) {
      const friendUser = await User.findById(friend._id);

      if (friendUser) {
        // Thu thập thông tin của bạn bè
        const friendInfo = {
          _id: friend._id,
          avatar: friendUser.avatar,
          name: friendUser.name,
          content: friend.content,
          date: friend.date,
        };

        // Thêm thông tin của bạn bè vào mảng friendsInfo
        friendsInfo.push(friendInfo);
      }
    }

    // Trả về danh sách thông tin của các bạn bè
    res.status(200).json(friendsInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
const getfriendRequestWeb = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const friendIds = user.friendRequest;
    // Mảng để lưu thông tin của các bạn bè
    const friendsInfo = [];
    // Duyệt qua mảng friendIds để lấy thông tin của từng bạn bè
    for (const friend of friendIds) {
      const friendUser = await User.findById(friend._id);
      if (friendUser) {
        // Thu thập thông tin của bạn bè
        const friendInfo = {
          _id: friend._id,
          avatar: friendUser.avatar,
          name: friendUser.name, // Sử dụng friendUser.username thay vì friendUser.name
          content: friend.content,
          date: friend.date,
        };

        // Thêm thông tin của bạn bè vào mảng friendsInfo
        friendsInfo.push(friendInfo);
      }
    }
    // Trả về danh sách thông tin của các bạn bè
    res.status(200).json(friendsInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
const getfriendRecived = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const friendIds = user.friendReceived;
    // const friends = await User.find({ _id: { $in: friendIds } });
    res.status(200).json(friendIds);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
const getfriendRequest = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const friendIds = user.friendRequest;
    // const friends = await User.find({ _id: { $in: friendIds } });
    res.status(200).json(friendIds);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
const addFriendRequest = async (req, res) => {
  const { id_sender, id_receiver } = req.body;
  try {
    const sender = await User.findById(id_sender);
    const receiver = await User.findById(id_receiver);
    if (!sender || !receiver) {
      return res.status(400).json({ error: "Sender or receiver not found" });
    }

    // Tạo đối tượng friendRequest để lưu vào mảng friendRequest của sender
    const newFriendRequest = {
      _id: id_receiver, // Người nhận yêu cầu kết bạn
      date: new Date(), // Ngày hiện tại
      content: "Friend request message", // Nội dung yêu cầu kết bạn (bạn có thể thay đổi nội dung này)
    };

    // Thêm newFriendRequest vào mảng friendRequest của sender
    sender.friendRequest.push(newFriendRequest);
    await sender.save();

    // Tạo đối tượng friendRequest để lưu vào mảng friendReceived của receiver
    const newFriendReceived = {
      _id: id_sender, // Người gửi yêu cầu kết bạn
      date: new Date(), // Ngày hiện tại
      content: "Bạn đã nhận được lời mời kết bạn!", // Nội dung thông báo
    };

    // Thêm newFriendReceived vào mảng friendReceived của receiver
    receiver.friendReceived.push(newFriendReceived);
    await receiver.save();

    console.log("Gửi yêu cầu kết bạn thành công");
    res.status(200).json({ sender, receiver });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteFriendRequest = async (req, res) => {
  const { id_sender, id_receiver } = req.body;
  try {
    // Tìm người gửi và người nhận dựa trên id_sender và id_receiver
    const sender = await User.findById(id_sender);
    const receiver = await User.findById(id_receiver);

    // Kiểm tra xem người gửi và người nhận có tồn tại không
    if (!sender || !receiver) {
      return res.status(400).json({ error: "Sender or receiver not found" });
    }

    // Loại bỏ yêu cầu kết bạn từ mảng friendRequest của người gửi
    sender.friendRequest = sender.friendRequest.filter((request) => request._id.toString() !== id_receiver);

    // Loại bỏ yêu cầu kết bạn từ mảng friendReceived của người nhận
    receiver.friendReceived = receiver.friendReceived.filter((received) => received._id.toString() !== id_sender);

    // Lưu các thay đổi vào cơ sở dữ liệu
    await sender.save();
    await receiver.save();

    // Trả về phản hồi thành công
    res.status(200).json("Delete friend request successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const acceptFriendRequest = async (req, res) => {
  const { id_sender, id_receiver } = req.body;
  try {
    const sender = await User.findById(id_sender);
    const receiver = await User.findById(id_receiver);
    if (!sender || !receiver) {
      return res.status(400).json({ error: " sender null or receiver null" });
    }
    // Loại bỏ yêu cầu kết bạn từ mảng friendRequest của người gửi
    sender.friendRequest = sender.friendRequest.filter((request) => request._id.toString() !== id_receiver);
    // Loại bỏ yêu cầu kết bạn từ mảng friendReceived của người nhận
    receiver.friendReceived = receiver.friendReceived.filter((received) => received._id.toString() !== id_sender);
    // Thêm id_receiver vào mảng friends của sender
    sender.friends.addToSet(id_receiver);
    await sender.save();
    // Thêm id_sender vào mảng friends của receiver
    receiver.friends.addToSet(id_sender);
    await receiver.save();
    // Gửi phản hồi khi mọi thứ hoàn thành mà không gây ra lỗi
    res.status(200).json("Accept friend request successfully");
    console.log("Chấp nhận yêu cầu kết bạn thành công");
    // Gọi hàm xóa yêu cầu kết bạn
  } catch (error) {
    console.error(error);
    console.log("Thất bại");
    // Gửi phản hồi lỗi nếu có lỗi xảy ra
    res.status(500).json({ error: "Server error" });
  }
};

const getPhoneBook = async (req, res) => {
  const id = req.params.id;
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
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
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

const getUserByUserName = async (req, res) => {
  try {
    // Tìm người dùng theo tên người dùng
    const user = await User.findOne({ username: req.params.username });
    // Kiểm tra xem người dùng có tồn tại không
    if (user) {
      res.status(200).json(user); // Trả về thông tin người dùng nếu tìm thấy
    } else {
      res.status(404).json({ message: "Không tìm thấy người dùng" }); // Trả về lỗi nếu không tìm thấy người dùng
    }
  } catch (err) {
    res.status(500).json(err); // Trả về lỗi nếu có lỗi xảy ra trong quá trình tìm kiếm người dùng
  }
};

const getAllUserName = async (req, res) => {
  try {
    const users = await User.find(); // Lấy tất cả các người dùng từ cơ sở dữ liệu
    const listUsernames = users.map((user) => user.username); // Lấy danh sách tên người dùng từ các đối tượng người dùng
    res.status(200).json(listUsernames); // Trả về mảng các tên người dùng
  } catch (err) {
    res.status(500).json(err);
  }
};
const updateAvatar = async (req, res) => {
  const { id, avatar } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.avatar = avatar;
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const updateCoverAvatar = async (req, res) => {
  const { id, coveravatar } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.coveravatar = coveravatar;
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
// viết hàm update password khi biết username
const updatePassword = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const changePassword = async (req, res) => {
  const { username, passwordOld, passwordNew } = req.body; // Thêm passwordOld vào đây
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid username" });
    }

    // Kiểm tra mật khẩu cũ
    const isPasswordValid = await bcrypt.compare(passwordOld, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid old password" });
    }

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
  getUserByID,
  getUserByUserName,
  getfriend,
  getfriendRequest,
  getfriendRecived,
  getPhoneBook,
  getAllUser,
  deleteUser,
  uploadAvatarToS3,
  updateMK,
  postUserByUserName,
  forgotPassword,
  addFriendRequest,
  deleteFriendRequest,
  acceptFriendRequest,
  deleteFriends,
  getfriendRequestWeb,
  getfriendRecivedWeb,
  getFriendWithDetails,
  getAllUserName,
  updateAvatar,
  updateCoverAvatar,
  updatePassword,
  changePassword,
};
