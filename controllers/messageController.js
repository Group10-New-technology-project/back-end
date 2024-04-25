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
      })
      .populate({
        path: "messages",
        populate: {
          path: "reply",
          model: "Message",
          populate: {
            path: "memberId",
            model: "Member",
            populate: {
              path: "userId",
              model: "User",
              select: "avatar name",
            },
          },
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
            select: "avatar name",
          },
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
const uploadImageToS3 = async (req, res) => {
  try {
    const { originalname, buffer, mimetype } = req.file;

    // Specify key and parameters for S3 upload
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${Date.now()}_${originalname}`,
      Body: buffer,
      ContentType: mimetype,
    };

    // Upload image to S3
    s3.upload(params, (err, data) => {
      if (err) {
        console.error("Error uploading image to S3:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      } else {
        // Image upload successful, return S3 URL
        return res.json({ imageUrl: data.Location });
      }
    });
  } catch (error) {
    console.error("Error handling image upload:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { conversationId, messageId, memberId } = req.body;

    // Kiểm tra xem conversationId, messageId và memberId có tồn tại trong request body hay không
    if (!conversationId || !messageId || !memberId) {
      return res.status(400).json({ error: "Thiếu thông tin cần thiết hoặc memberId không hợp lệ" });
    }

    // Tìm cuộc trò chuyện dựa trên conversationId
    const conversation = await Conversation.findById(conversationId)
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
      })
      .populate({
        path: "messages",
        populate: {
          path: "reply",
          model: "Message",
          populate: {
            path: "memberId",
            model: "Member",
            populate: {
              path: "userId",
              model: "User",
              select: "avatar name",
            },
          },
        },
      })
      .populate({
        path: "messages",
        populate: {
          path: "deleteMember",
          model: "Member", // Tên của model người dùng trong Mongoose
        },
      });

    if (!conversation) {
      return res.status(404).json({ error: "Cuộc trò chuyện không tồn tại" });
    }

    // Tìm tin nhắn đã xóa bằng ID của nó
    const deleteMessage = await Message.findById(messageId).populate({
      path: "memberId",
      model: "Member", // Tên của model người dùng trong Mongoose
    });

    const deleteMember = {
      _id: memberId,
    };

    console.log("deleteMember", deleteMember);
    deleteMessage.deleteMember.push(deleteMember);

    console.log("deleteMessage", deleteMessage);

    await deleteMessage.save();

    const updatedConversation = await Conversation.findById(conversationId)
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
      })
      .populate({
        path: "messages",
        populate: {
          path: "reply",
          model: "Message",
          populate: {
            path: "memberId",
            model: "Member",
            populate: {
              path: "userId",
              model: "User",
              select: "avatar name",
            },
          },
        },
      })
      .populate({
        path: "messages",
        populate: {
          path: "deleteMember",
          model: "Member", // Tên của model người dùng trong Mongoose
        },
      });

    // Lưu lại cuộc trò chuyện
    await updatedConversation.save();

    res.status(200).json(updatedConversation);

    console.log("conversation", updatedConversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi khi xóa tin nhắn" });
  }
};

const thuHoiMessage = async (req, res) => {
  try {
    const { conversationId, messageId, memberId } = req.body;

    // Kiểm tra xem conversationId, messageId và memberId có tồn tại trong request body hay không
    if (!conversationId || !messageId || !memberId) {
      return res.status(400).json({ error: "Thiếu thông tin cần thiết hoặc memberId không hợp lệ" });
    }

    // Tìm cuộc trò chuyện dựa trên conversationId
    const conversation = await Conversation.findById(conversationId)
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
      })
      .populate({
        path: "messages",
        populate: {
          path: "reply",
          model: "Message",
          populate: {
            path: "memberId",
            model: "Member",
            populate: {
              path: "userId",
              model: "User",
              select: "avatar name",
            },
          },
        },
      })
      .populate({
        path: "messages",
        populate: {
          path: "deleteMember",
          model: "Member", // Tên của model người dùng trong Mongoose
        },
      });

    if (!conversation) {
      return res.status(404).json({ error: "Cuộc trò chuyện không tồn tại" });
    }

    // Tìm tin nhắn đã xóa bằng ID của nó
    const deleteMessage = await Message.findById(messageId).populate({
      path: "memberId",
      model: "Member", // Tên của model người dùng trong Mongoose
    });

    deleteMessage.recallMessage = true;

    await deleteMessage.save();

    const updatedConversation = await Conversation.findById(conversationId)
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
      })
      .populate({
        path: "messages",
        populate: {
          path: "reply",
          model: "Message",
          populate: {
            path: "memberId",
            model: "Member",
            populate: {
              path: "userId",
              model: "User",
              select: "avatar name",
            },
          },
        },
      })
      .populate({
        path: "messages",
        populate: {
          path: "deleteMember",
          model: "Member", // Tên của model người dùng trong Mongoose
        },
      });

    // Lưu lại cuộc trò chuyện
    await updatedConversation.save();

    res.json(updatedConversation);

    console.log("conversation", updatedConversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi khi xóa tin nhắn" });
  }
};
const addReply = async (req, res) => {
  const { conversationId, content, memberId, type, messageRepliedId } = req.body; // Lấy thông tin tin nhắn từ request body
  const createAt = new Date(); // Lấy thời gian hiện tại
  try {
    // Tạo một tin nhắn mới
    const message = new Message({
      content,
      memberId,
      type,
      createAt,
      reply: [messageRepliedId], // Corrected line
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

///Send message to conversations
const postMessageToConversations = async (req, res) => {
  const { conversationIds, content, memberId, type } = req.body; // Lấy thông tin từ request body
  const createAt = new Date(); // Lấy thời gian hiện tại

  try {
    for (const conversationId of conversationIds) {
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
        console.log(`Conversation with ID ${conversationId} not found`);
        continue;
      }

      // Thêm tin nhắn vào cuộc trò chuyện hoặc nhóm
      conversation.messages.push(newMessage._id);
      await conversation.save();

      console.log(`Message sent to conversation with ID ${conversationId}`);
    }

    // Trả về tin nhắn mới được tạo
    res.status(201).json({ message: "Messages sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
const addPinMessageToConversations = async (req, res) => {
  try {
    const { messageId } = req.body;
    const message = await Message.findById(messageId);

    if (!message) {
      // Nếu không tìm thấy tin nhắn, throw error
      return res.status(500).json("Message not found");
    }
    message.pin = true;
    const messageUpdate = await message.save();
    return res.status(200).json(messageUpdate);
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};
const deletePinMessageToConversations = async (req, res) => {
  try {
    const { messageId } = req.body;
    const message = await Message.findById(messageId);

    if (!message) {
      // Nếu không tìm thấy tin nhắn, throw error
      return res.status(500).json("Message not found");
    }
    message.pin = false;
    const messageUpdate = await message.save();
    return res.status(200).json(messageUpdate);
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  postMessage,
  getMessagesByConversationId,
  postMessageWeb,
  uploadImageToS3,
  deleteMessage,
  thuHoiMessage,
  addReply,
  postMessageToConversations,
  addPinMessageToConversations,
  deletePinMessageToConversations,
};
