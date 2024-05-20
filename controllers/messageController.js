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

    const currentTime = new Date();
    const formattedTime = currentTime.toISOString().slice(0, 19).replace(/[-T:]/g, "");
    const milliseconds = currentTime.getMilliseconds();

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${formattedTime}/${milliseconds}/${originalname}`,
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
const addPinMessageToConversation = async (req, res) => {
  try {
    const { conversationId, messageId } = req.body;

    if (!conversationId || !messageId) {
      return res.status(400).json("conversationId and messageId are required");
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json("Conversation not found");
    }
    if (conversation.pinMessages && conversation.pinMessages.includes(messageId)) {
      return res.status(400).json("Message is already pinned in this conversation");
    }

    if (!conversation.pinMessages) {
      conversation.pinMessages = [];
    }

    conversation.pinMessages.unshift(messageId);

    await conversation.save();
    const updateConversation = await Conversation.findById(conversationId).populate({
      path: "pinMessages",
      select: "_id content type",
      populate: {
        path: "memberId",
        select: "_id",
        populate: {
          path: "userId",
          model: "User",
          select: "name",
        },
      },
    });

    // Trả về cuộc trò chuyện đã cập nhật
    return res.status(200).json(updateConversation);
  } catch (error) {
    console.error("Error adding pin message to conversation:", error);
    return res.status(500).json("Internal server error");
  }
};
const deletePinMessageToConversation = async (req, res) => {
  try {
    const { conversationId, messageId } = req.body;

    if (!conversationId || !messageId) {
      return res.status(400).json("conversationId and messageId are required");
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json("Conversation not found");
    }

    if (!conversation.pinMessages || conversation.pinMessages.length === 0) {
      return res.status(400).json("There are no pinned messages in this conversation");
    }

    // Tìm index của messageId trong mảng pinMessages
    const index = conversation.pinMessages.indexOf(messageId);

    // Kiểm tra xem messageId có tồn tại trong mảng pinMessages không
    if (index === -1) {
      return res.status(404).json("Message not found in pinned messages");
    }

    // Xóa messageId khỏi mảng pinMessages
    conversation.pinMessages.splice(index, 1);

    await conversation.save();
    const updateConversation = await Conversation.findById(conversationId).populate({
      path: "pinMessages",
      select: "_id content type",
      populate: {
        path: "memberId",
        select: "_id",
        populate: {
          path: "userId",
          model: "User",
          select: "name",
        },
      },
    });

    // Trả về cuộc trò chuyện đã cập nhật sau khi xóa tin nhắn được ghim
    return res.status(200).json(updateConversation);
  } catch (error) {
    console.error("Error removing pin message from conversation:", error);
    return res.status(500).json("Internal server error");
  }
};
const prioritizePinMessage = async (req, res) => {
  try {
    const { conversationId, messageId } = req.body;

    if (!conversationId || !messageId) {
      return res.status(400).json("conversationId and messageId are required");
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json("Conversation not found");
    }

    if (!conversation.pinMessages || conversation.pinMessages.length === 0) {
      return res.status(400).json("There are no pinned messages in this conversation");
    }

    // Tìm index của messageId trong mảng pinMessages
    const index = conversation.pinMessages.indexOf(messageId);

    // Kiểm tra xem messageId có tồn tại trong mảng pinMessages không
    if (index === -1) {
      return res.status(404).json("Message not found in pinned messages");
    }

    // Di chuyển tin nhắn được ghim lên đầu mảng
    conversation.pinMessages.splice(index, 1);
    conversation.pinMessages.unshift(messageId);

    await conversation.save();

    // Trả về cuộc trò chuyện đã cập nhật sau khi sắp xếp tin nhắn được ghim
    return res.status(200).json(conversation);
  } catch (error) {
    console.error("Error prioritizing pin message in conversation:", error);
    return res.status(500).json("Internal server error");
  }
};
const getAllPinMessages = async (req, res) => {
  try {
    const { conversationId } = req.body; // Lấy id của cuộc trò chuyện từ request parameters

    if (!conversationId) {
      return res.status(400).json("conversationId is required");
    }

    const conversation = await Conversation.findById(conversationId).populate({
      path: "pinMessages",
      select: "_id content type",
      populate: {
        path: "memberId",
        select: "_id",
        populate: {
          path: "userId",
          model: "User",
          select: "name",
        },
      },
    }); // Sử dụng populate để lấy thông tin chi tiết của các tin nhắn được ghim

    if (!conversation) {
      return res.status(404).json("Conversation not found");
    }

    // Trả về danh sách các tin nhắn được ghim trong cuộc trò chuyện
    return res.status(200).json(conversation.pinMessages);
  } catch (error) {
    console.error("Error getting all pin messages in conversation:", error);
    return res.status(500).json("Internal server error");
  }
};

const getMessageById = async (req, res) => {
  try {
    const { messageId } = req.params; // Ensure messageId is taken from req.params
    console.log("Received request to fetch message with ID:", messageId); // Debug log
    // Kiểm tra xem có tồn tại id tin nhắn không
    if (!messageId) {
      console.warn("No messageId provided in request"); // Warning log
      return res.status(400).json({ error: "Message ID is required" });
    }
    // Tìm tin nhắn bằng id
    const message = await Message.findById(messageId)
      .populate({
        path: "memberId",
        model: "Member", // Tên của model người dùng trong Mongoose
        populate: {
          path: "userId",
          model: "User",
          select: "avatar name",
        },
      })
      .populate({
        path: "reaction",
        populate: {
          path: "memberId",
          model: "Member",
          select: "memberId",
          populate: {
            path: "userId",
            model: "User",
            select: "avatar name",
          },
        },
      });
    // Kiểm tra xem tin nhắn có tồn tại không
    if (!message) {
      console.warn(`Message with ID ${messageId} not found`); // Warning log
      return res.status(404).json({ error: "Message not found" });
    }
    console.log("Message found:", message); // Debug log
    // Trả về thông tin tin nhắn
    return res.json(message);
  } catch (error) {
    console.error("Error fetching message by id:", error); // Error log
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getMessageByIdWeb = async (req, res) => {
  try {
    const { messageId } = req.body;

    // Kiểm tra xem có tồn tại id tin nhắn không
    if (!messageId) {
      return res.status(400).json({ error: "Message ID is required" });
    }

    // Tìm tin nhắn bằng id
    const message = await Message.findById(messageId);

    // Kiểm tra xem tin nhắn có tồn tại không
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Trả về thông tin tin nhắn
    res.json(message);
  } catch (error) {
    console.error("Error fetching message by id:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const addReaction = async (req, res) => {
  const { messageId, typeReaction, memberId } = req.body;
  try {
    // Tìm tin nhắn dựa trên ID
    let message = await Message.findById(messageId).populate({
      path: "reaction",
      populate: {
        path: "memberId",
        model: "Member",
        select: "memberId",
        populate: {
          path: "userId",
          model: "User",
          select: "avatar name",
        },
      },
    });
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Tìm phản ứng của thành viên trong tin nhắn
    let memberReaction = message.reaction.find((reaction) => reaction.memberId._id.toString() === memberId);
    console.log("memberReaction", memberReaction);
    if (memberReaction) {
      // Nếu đã có phản ứng từ thành viên này, kiểm tra xem đã có loại phảnn ứng này chưa
      const existingTypeReaction = memberReaction.reactions.find((reaction) => reaction.typeReaction === typeReaction);
      if (existingTypeReaction) {
        // Nếu đã có loại phản ứng này, tăng số lượng lên 1
        existingTypeReaction.quantity += 1;
      } else {
        // Nếu chưa có loại phản ứng này, thêm mới vào mảng phản ứng của thành viên
        memberReaction.reactions.push({ typeReaction, quantity: 1 });
      }
    } else {
      // Nếu chưa có phản ứng từ thành viên này, tạo một phản ứng mới và thêm vào mảng phản ứng của tin nhắn
      memberReaction = {
        memberId,
        reactions: [{ typeReaction, quantity: 1 }],
      };
      message.reaction.push(memberReaction);
    }

    // Lưu tin nhắn vào cơ sở dữ liệu
    await message.save();

    // Trả về tin nhắn đã cập nhật
    message = await Message.findById(messageId).populate({
      path: "reaction",
      populate: {
        path: "memberId",
        model: "Member",
        select: "memberId",
        populate: {
          path: "userId",
          model: "User",
          select: "avatar name",
        },
      },
    });

    return res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteAllReactions = async (req, res) => {
  const { messageId, memberId } = req.body;
  try {
    // Xóa tất cả các phản ứng của thành viên khỏi tin nhắn
    const updatedMessage = await Message.findOneAndUpdate(
      { _id: messageId },
      { $pull: { reaction: { memberId: memberId } } },
      { new: true }
    ).populate({
      path: "reaction",
      populate: {
        path: "memberId",
        model: "Member",
        select: "memberId",
        populate: {
          path: "userId",
          model: "User",
          select: "avatar name",
        },
      },
    });

    if (!updatedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }
    return res.status(200).json(updatedMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteMessageById = async (req, res) => {
  try {
    const { messageId } = req.body;

    // Kiểm tra xem có tồn tại id tin nhắn không
    if (!messageId) {
      return res.status(400).json({ error: "Message ID is required" });
    }

    // Xóa tin nhắn dựa trên ID
    const deletedMessage = await Message.findByIdAndDelete(messageId);

    // Kiểm tra xem tin nhắn có tồn tại không
    if (!deletedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Trả về tin nhắn đã xóa
    res.json(deletedMessage);
  } catch (error) {
    console.error("Error deleting message by id:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteAllReactionByMessageID = async (req, res) => {
  const { messageId } = req.body;
  try {
    // Đảm bảo tin nhắn tồn tại trước khi cập nhật
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: "Không tìm thấy tin nhắn" });
    }

    // Đặt trường reaction thành mảng rỗng nếu nó không tồn tại
    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      { $set: { reaction: [] } },
      { new: true, upsert: true } // `upsert: true` đảm bảo tài liệu được tạo nếu nó không tồn tại
    ).populate({
      path: "reaction",
      populate: {
        path: "memberId",
        model: "Member",
        select: "memberId",
        populate: {
          path: "userId",
          model: "User",
          select: "avatar name",
        },
      },
    });

    return res.status(200).json(updatedMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi máy chủ" });
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
  addPinMessageToConversation,
  deletePinMessageToConversation,
  prioritizePinMessage,
  getAllPinMessages,
  getMessageById,
  addReaction,
  deleteAllReactions,
  deleteMessageById,
  getMessageByIdWeb,
  deleteAllReactionByMessageID,
};
