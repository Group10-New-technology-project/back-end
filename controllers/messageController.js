const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const multer = require("multer");
const AWS = require("aws-sdk");
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

const postMessageWeb = async (req, res) => {
  const { conversationId, content, memberId, type } = req.body; // Lấy thông tin tin nhắn từ request body
  const createAt = new Date(); // Lấy thời gian hiện tại

  try {
    // Tạo một tin nhắn mới
    const message = new Message({
      content,
      memberId,
      type,
      createAt, // Thêm thời gian tạo vào tin nhắn
    });

    // Lưu tin nhắn vào cơ sở dữ liệu
    const newMessage = await message.save();

    // Tìm cuộc trò chuyện hoặc nhóm tương ứng
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Thêm tin nhắn vào cuộc trò chuyện hoặc nhóm
    conversation.messages.push(newMessage._id);
    console.log("messageId vuuar adfd ", newMessage.id);
    await conversation.save();

    const conversation2 = await Conversation.findById(conversationId)
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
    if (!conversation2) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Trả về tin nhắn mới được tạo
    res.status(201).json(conversation2);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// const postMessage = async (req, res) => {
//   const { conversationId, memberId, content, type } = req.body; // Lấy thông tin tin nhắn từ request body
//   const createAt = new Date(); // Lấy thời gian hiện tại

//   try {
//     // Tạo một tin nhắn mới
//     const message = new Message({
//       content,
//       memberId,
//       type,
//       createAt, // Thêm thời gian tạo vào tin nhắn
//     });

//     // Nếu loại tin nhắn là text, không cần tải ảnh lên S3
//     if (type !== "text" && req.file) {
//       const { originalname, buffer, mimetype } = req.file;

//       // Tải lên ảnh lên Amazon S3
//       const params = {
//         Bucket: process.env.S3_BUCKET_NAME,
//         Key: `${username}_${Date.now()}_${originalname}`,
//         Body: buffer,
//         ContentType: mimetype,
//       };
//       await s3.upload(params).promise();
//     }

//     // Lưu tin nhắn vào cơ sở dữ liệu
//     const newMessage = await message.save();

//     // Tìm cuộc trò chuyện hoặc nhóm tương ứng
//     const conversation = await Conversation.findById(conversationId);
//     if (!conversation) {
//       return res.status(404).json({ error: "Conversation not found" });
//     }

//     // Thêm tin nhắn vào cuộc trò chuyện hoặc nhóm
//     conversation.messages.push(newMessage._id);
//     await conversation.save();

//     const conversation2 = await Conversation.findById(conversationId)
//       .populate({
//         path: "members",
//         populate: {
//           path: "userId",
//           model: "User", // Tên của model người dùng trong Mongoose
//         },
//       })
//       .populate({
//         path: "messages",
//         populate: {
//           path: "memberId",
//           model: "Member", // Tên của model người dùng trong Mongoose
//         },
//       });
//     if (!conversation2) {
//       return res.status(404).json({ error: "Conversation not found" });
//     }

//     // Trả về tin nhắn mới được tạo
//     res.status(201).json(conversation2);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

const getMessagesByConversationId = async (req, res) => {
  const conversationId = req.params.conversationId;
  try {
    // Tìm kiếm cuộc trò chuyện dựa trên ID
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    const uniqueMessages = [...new Set(conversation.messages)];

    const messages = await Message.find({ _id: { $in: uniqueMessages } }).populate({
      path: "memberId",
      model: "Member",
    });
    console.log("message", messages.length);

    // Trả về thông tin của cuộc trò chuyện
    res.status(200).json({ conversation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const postMessage = async (req, res) => {
  const { conversationId, content, memberId, type } = req.body; // Lấy thông tin tin nhắn từ request body
  const createAt = new Date(); // Lấy thời gian hiện tại

  try {
    // Tạo một tin nhắn mới
    const message = new Message({
      content,
      memberId,
      type,
      createAt, // Thêm thời gian tạo vào tin nhắn
    });

    // Lưu tin nhắn vào cơ sở dữ liệu
    const newMessage = await message.save();

    // Tìm cuộc trò chuyện hoặc nhóm tương ứng
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Thêm tin nhắn vào cuộc trò chuyện hoặc nhóm
    conversation.messages.push(newMessage._id);
    await conversation.save();

    // Trả về tin nhắn mới được tạo
    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  postMessage,
  getMessagesByConversationId,
  postMessageWeb,
};
