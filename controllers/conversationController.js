const Member = require("../models/Member");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const Members = require("../models/Member");
const User = require("../models/User");
const { get } = require("http");
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
      })
      .populate({
        path: "messages",
        populate: {
          path: "deleteMember",
          model: "Member",
        },
      })
      .populate({
        path: "messages",
        populate: {
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
        },
      })
      .populate({
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
        path: "leader",
        populate: {
          path: "userId",
          model: "User",
          select: "avatar name",
        },
      })
      .populate({
        path: "deputy",
        populate: {
          path: "userId",
          model: "User",
          select: "avatar name",
        },
      });

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
          model: "Member", // Tên của model người dùng trong Mongoose
          populate: {
            path: "userId",
            model: "User",
            select: "avatar name",
          },
        },
      })
      .populate({
        path: "messages",
        populate: {
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
        },
      })
      .populate({
        path: "messages",
        populate: {
          path: "deleteMember",
          model: "Member",
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
        path: "leader",
        populate: {
          path: "userId",
          model: "User",
          select: "avatar name",
        },
      })
      .populate({
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
      })
      .populate({
        path: "deputy",
        populate: {
          path: "userId",
          model: "User",
          select: "avatar name",
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
      })
      .populate({
        path: "messages",
        populate: {
          path: "deleteMember",
          model: "Member",
        },
      })
      .populate({
        path: "messages",
        populate: {
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
      })
      .populate({
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
        path: "leader",
        populate: {
          path: "userId",
          model: "User",
          select: "avatar name",
        },
      })
      .populate({
        path: "deputy",
        populate: {
          path: "userId",
          model: "User",
          select: "avatar name",
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
        populate: [
          {
            path: "memberId",
            model: "Member",
            populate: {
              path: "userId",
              model: "User",
              select: "avatar name",
            },
          },
          {
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
          {
            path: "reaction",
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
        ],
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
    const { members, leader } = req.body;
    //Kiểm tra xem cuộc trò chuyện này đã được tạo hay chưa
    const existingConversation = await Conversation.findOne({
      members: { $all: members },
      type: "Direct",
    });
    if (existingConversation) {
      console.log("Conversation already exists");
      return res.status(400).json({ error: "Conversation already exists" });
    }
    const conversation = new Conversation({
      name: "",
      type: "Direct",
      members,
      messages: [],
      groupImage: "",
      leader,
      createAt: new Date(),
      isjoinfromlink: true,
    });
    await conversation.save();
    // res.status(201).json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const generateNotifications = (type, user1, user2) => {
  const currentDate = new Date(); // Lấy thời gian hiện tại

  if (type === "Group") {
    // For Group type, use user1's name in the notification
    return [
      {
        message: `${user1.name} và ${user2.name} đã trở thành bạn bè. Hãy trò chuyện nhé.`,
        date: currentDate,
      },
    ];
  } else {
    return [
      {
        message: `${user1.name} started a conversation with ${user2.name}`,
        date: currentDate,
      },
    ];
  }
};
const createConversationWeb = async (req, res) => {
  try {
    const { groupImage, name, arrayUserId, notifications } = req.body;
    // Kiểm tra và gán giá trị mặc định nếu groupImage là null hoặc undefined

    // Kiểm tra xem arrayUserId có chứa đúng số lượng userId phù hợp hay không
    if (!Array.isArray(arrayUserId) || arrayUserId.length < 2) {
      return res.status(400).json({ error: "arrayUserId must contain exactly 2 or 3 userIds" });
    }
    const [userId1, userId2] = arrayUserId; // Giả sử userId3 chỉ được sử dụng khi mảng có 3 thành viên
    // Tìm thông tin thành viên thứ nhất
    const member1 = await Member.findOne({ userId: userId1 });
    const user1 = await User.findOne({ _id: userId1 });
    const user2 = await User.findOne({ _id: userId2 });
    if (!user1 || !user2) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!member1) {
      return res.status(404).json({ error: `Member with userId ${userId1} not found` });
    }
    // Tìm thông tin thành viên thứ hai
    const member2 = await Member.findOne({ userId: userId2 });
    if (!member2) {
      return res.status(404).json({ error: `Member with userId ${userId2} not found` });
    }
    let type = "Direct"; // Loại cuộc hội thoại mặc định là Direct
    let members = [member1._id, member2._id]; // Mặc định chỉ có 2 thành viên

    //Nếu 2 thành viên thì kiểm tra đã có cuộc hội thoại giữa 2 thành viên này chưa
    if (arrayUserId.length === 2) {
      const existingConversation = await Conversation.findOne({
        members: { $all: members },
        type: type,
      });

      if (existingConversation) {
        return res.status(400).json({ error: "Conversation already exists" });
      }
    }
    // Nếu mảng chứa 3 thành viên, tạo cuộc hội thoại nhóm (Group)
    if (arrayUserId.length > 2) {
      const userIdsForGroup = arrayUserId.slice(2);
      for (const userId of userIdsForGroup) {
        const member = await Member.findOne({ userId });
        if (!member) {
          return res.status(404).json({ error: `Member with userId ${userId} not found` });
        }
        type = "Group"; // Loại cuộc hội thoại là Group
        members.push(member._id);
      }
    }

    // Tạo cuộc hội thoại mới nếu chưa tồn tại
    const newConversation = new Conversation({
      name: name || "",
      type: type,
      members: members,
      messages: [],
      groupImage: groupImage || "https://image666666.s3.ap-southeast-1.amazonaws.com/no-image.png",
      leader: member1._id, // Thành viên thứ nhất là người chủ đề
      createAt: new Date(),
      isJoinFromLink: false,
      notifications: generateNotifications(type, user1, user2),
    });
    const updateConver = await newConversation.save();
    const conversation = await Conversation.findById(updateConver._id)
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
          model: "Member", // Tên của model người dùng trong Mongoose
          populate: {
            path: "userId",
            model: "User",
            select: "avatar name",
          },
        },
      })
      .populate({
        path: "messages",
        populate: {
          path: "deleteMember",
          model: "Member",
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
        path: "leader",
        populate: {
          path: "userId",
          model: "User",
          select: "avatar name",
        },
      })
      .populate({
        path: "deputy",
        populate: {
          path: "userId",
          model: "User",
          select: "avatar name",
        },
      });

    res.status(201).json(conversation);
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({ error: "Server error occurred" });
  }
};

const addUserToConversation = async (req, res) => {
  try {
    const { conversationID, arrayUserID } = req.body;

    // Xác nhận tồn tại của conversationID
    const conversation = await Conversation.findById(conversationID);
    if (!conversation) {
      return res.status(404).json({ error: `Conversation with ID ${conversationID} not found` });
    }

    // Xác nhận tồn tại của các thành viên trong arrayUserID và lấy thông tin của từng thành viên mới
    const newMemberNames = []; // Danh sách tên người dùng của các thành viên mới được thêm vào
    for (const userID of arrayUserID) {
      const member = await Member.findOne({ userId: userID }).populate("userId", "name");
      if (!member) {
        return res.status(404).json({ error: `Member with userID ${userID} not found` });
      }
      if (!conversation.members.includes(member._id)) {
        // Nếu thành viên chưa tồn tại trong cuộc trò chuyện, thêm tên người dùng vào danh sách
        newMemberNames.push(member.userId.name);
        // Thêm thành viên vào cuộc trò chuyện
        conversation.members.push(member._id);
      }
    }

    // Cập nhật danh sách thành viên của cuộc hội thoại sau khi đã thêm các thành viên mới
    await conversation.save();

    // Trả về danh sách tên người dùng của các thành viên mới được thêm vào
    res.status(200).json({ newMemberNames });
  } catch (error) {
    console.error("Error adding members to conversation:", error);
    res.status(500).json({ error: "Failed to add members to conversation" });
  }
};

const addUserToArrayConversation = async (req, res) => {
  try {
    const { userID, arrayConversationID } = req.body;

    // Kiểm tra xem userID và arrayConversationID đã được cung cấp trong req.body hay không
    if (!userID || !arrayConversationID || !Array.isArray(arrayConversationID)) {
      return res.status(400).json({ error: "userID and arrayConversationID must be provided in the request body as an array" });
    }

    // Xác nhận tồn tại của userID
    const user = await Member.findOne({ userId: userID });
    if (!user) {
      return res.status(404).json({ error: `User with userID ${userID} not found` });
    }

    // Xác nhận tồn tại của các cuộc hội thoại trong arrayConversationID và lấy ObjectId của từng cuộc hội thoại
    const conversationsToAddUser = [];
    for (const conversationID of arrayConversationID) {
      const conversation = await Conversation.findById(conversationID);
      if (!conversation) {
        return res.status(404).json({ error: `Conversation with ID ${conversationID} not found` });
      }
      if (!conversation.members.includes(user._id)) {
        conversationsToAddUser.push(conversation._id);
      }
    }
    // Nếu không có cuộc hội thoại mới cần thêm user vào, không cần cập nhật gì và trả về user hiện tại
    if (conversationsToAddUser.length === 0) {
      return res.status(200).json(user);
    }

    // Thêm user vào các cuộc hội thoại
    for (const conversationID of conversationsToAddUser) {
      await Conversation.findByIdAndUpdate(conversationID, { $push: { members: user._id } });
    }

    // Sau khi cập nhật thành công, lấy lại thông tin user sau khi đã được cập nhật
    const updatedUser = await Member.findOne({ userId: userID });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error adding user to conversations:", error);
    res.status(500).json({ error: "Failed to add user to conversations" });
  }
};

const getArrayUserConversationUsers = async (req, res) => {
  try {
    const { conversationID } = req.params;

    // Kiểm tra xem conversationID đã được cung cấp trong req.params hay không
    if (!conversationID) {
      return res.status(400).json({ error: "conversationID must be provided in the request params" });
    }

    // Tìm cuộc trò chuyện với conversationID đã cung cấp
    const conversation = await Conversation.findById(conversationID);
    if (!conversation) {
      return res.status(404).json({ error: `Conversation with ID ${conversationID} not found` });
    }
    // Lấy thông tin về thành viên từ danh sách thành viên của cuộc trò chuyện
    const members = await Member.find({ _id: { $in: conversation.members } });
    // Trích xuất chỉ các trường "userId" từ mảng members và trả về
    const userIds = members.map((member) => member.userId);

    res.status(200).json(userIds);
  } catch (error) {
    console.error("Error fetching conversation members:", error);
    res.status(500).json({ error: "Failed to fetch conversation members" });
  }
};

const selectNewLeader = async (req, res) => {
  try {
    const { conversationID, newLeaderUserID } = req.body;

    // Kiểm tra xem conversationID và newLeaderUserID đã được cung cấp trong req.body hay không
    if (!conversationID || !newLeaderUserID) {
      return res.status(400).json({ error: "conversationID and newLeaderUserID must be provided in the request body" });
    }

    // Tìm cuộc trò chuyện dựa trên conversationID
    const conversation = await Conversation.findById(conversationID);
    if (!conversation) {
      return res.status(404).json({ error: `Conversation with ID ${conversationID} not found` });
    }

    let newLeader = null;

    // Tìm thành viên mới được chọn làm leader dựa trên newLeaderUserID
    const newLeaderMember = await Member.findOne({ userId: newLeaderUserID });
    if (!newLeaderMember) {
      return res.status(404).json({ error: `Member with userID ${newLeaderUserID} not found` });
    }

    // Kiểm tra xem newLeaderMember có trong danh sách thành viên của cuộc trò chuyện không
    if (!conversation.members.includes(newLeaderMember._id)) {
      return res.status(400).json({ error: `Member with userID ${newLeaderUserID} is not part of the conversation` });
    }

    // Thiết lập newLeader là newLeaderMember
    newLeader = newLeaderMember._id;
    let updatedDeputy = conversation.deputy || [];
    // Kiểm tra xem newLeader có là phó nhóm hiện tại không
    if (conversation.deputy && conversation.deputy.length > 0 && conversation.deputy.includes(newLeader)) {
      // Nếu newLeader là phó nhóm, cập nhật danh sách phó nhóm (loại bỏ newLeader)
      updatedDeputy = conversation.deputy.filter((deputyId) => !deputyId.equals(newLeader));
    }

    // Cập nhật leader và phó nhóm của cuộc trò chuyện
    await Conversation.findByIdAndUpdate(conversationID, { leader: newLeader, deputy: updatedDeputy });
    const updatedConversation = await Conversation.findById(conversationID);
    res.status(200).json(updatedConversation);
  } catch (error) {
    console.error("Error selecting new leader:", error);
    res.status(500).json({ error: "Failed to select new leader" });
  }
};

const leaveConversation = async (req, res) => {
  try {
    const { conversationID, userID } = req.body;

    // Kiểm tra xem conversationID và userID đã được cung cấp trong req.body hay không
    if (!conversationID || !userID) {
      return res.status(400).json({ error: "conversationID and userID must be provided in the request body" });
    }

    // Tìm cuộc trò chuyện dựa trên conversationID
    const conversation = await Conversation.findById(conversationID);
    if (!conversation) {
      return res.status(404).json({ error: `Conversation with ID ${conversationID} not found` });
    }

    // Tìm thành viên dựa trên userID
    const member = await Member.findOne({ userId: userID });
    if (!member) {
      return res.status(404).json({ error: `Member with userID ${userID} not found` });
    }

    // Kiểm tra xem thành viên có tham gia vào cuộc trò chuyện không
    if (!conversation.members.includes(member._id)) {
      return res.status(400).json({ error: `Member with userID ${userID} is not part of the conversation` });
    }

    // Lọc ra danh sách thành viên mới sau khi loại bỏ thành viên có userID ra khỏi danh sách thành viên của cuộc hội thoại
    const updatedMembers = conversation.members.filter((memberId) => !memberId.equals(member._id));

    // Kiểm tra xem userID có phải là phó nhóm không
    if (conversation.deputy && conversation.deputy.includes(member._id)) {
      // Nếu là phó nhóm, loại bỏ userID ra khỏi danh sách phó nhóm
      const updatedDeputy = conversation.deputy.filter((deputyId) => !deputyId.equals(member._id));

      // Cập nhật lại danh sách phó nhóm của cuộc trò chuyện
      await Conversation.findByIdAndUpdate(conversationID, { members: updatedMembers, deputy: updatedDeputy });
    } else {
      // Nếu không phải là phó nhóm, chỉ cập nhật lại danh sách thành viên của cuộc trò chuyện
      await Conversation.findByIdAndUpdate(conversationID, { members: updatedMembers });
    }
    // Sau khi cập nhật thành công, lấy lại thông tin cuộc hội thoại sau khi đã được cập nhật
    const updatedConversation = await Conversation.findById(conversationID);

    res.status(200).json(updatedConversation);
  } catch (error) {
    console.error("Error leaving conversation:", error);
    res.status(500).json({ error: "Failed to leave conversation" });
  }
};
const addDeputyToConversation = async (req, res) => {
  try {
    const { conversationID, deputyUserID } = req.body;

    // Kiểm tra xem conversationID và deputyUserID đã được cung cấp trong req.body hay không
    if (!conversationID || !deputyUserID) {
      return res.status(400).json({ error: "conversationID and deputyUserID must be provided in the request body" });
    }

    // Tìm cuộc trò chuyện dựa trên conversationID
    const conversation = await Conversation.findById(conversationID);
    if (!conversation) {
      return res.status(404).json({ error: `Conversation with ID ${conversationID} not found` });
    }

    // Tìm thành viên được chọn làm phó nhóm dựa trên deputyUserID
    const deputyMember = await Member.findOne({ userId: deputyUserID });
    if (!deputyMember) {
      return res.status(404).json({ error: `Member with userID ${deputyUserID} not found` });
    }

    // Kiểm tra xem thành viên đã là phó nhóm trong cuộc trò chuyện chưa
    if (conversation.deputy && conversation.deputy.includes(deputyMember._id)) {
      // Nếu thành viên đã là phó nhóm, trả về dữ liệu cuộc trò chuyện hiện tại mà không cập nhật gì
      const currentConversation = await Conversation.findById(conversationID).populate({
        path: "deputy",
        populate: {
          path: "userId",
          model: "User",
        },
      });
      return res.status(404).json({ error: "Deputy already exists", currentConversation });
    }

    // Kiểm tra xem conversation có tồn tại danh sách phó nhóm không
    if (!conversation.deputy) {
      conversation.deputy = []; // Nếu không có, khởi tạo danh sách phó nhóm là một mảng rỗng
    }

    // Thêm deputyMember vào danh sách phó nhóm của cuộc trò chuyện
    conversation.deputy.push(deputyMember._id);

    // Lưu lại cuộc trò chuyện sau khi đã cập nhật
    await conversation.save();
    const updatedConversation = await Conversation.findById(conversationID).populate({
      path: "deputy",
      populate: {
        path: "userId",
        model: "User",
      },
    });
    res.status(200).json(updatedConversation);
  } catch (error) {
    console.error("Error adding deputy to conversation:", error);
    res.status(500).json({ error: "Failed to add deputy to conversation" });
  }
};

const removeDeputyFromConversation = async (req, res) => {
  try {
    const { conversationID, deputyUserID } = req.body;

    // Kiểm tra xem conversationID và deputyUserID đã được cung cấp trong req.body hay không
    if (!conversationID || !deputyUserID) {
      return res.status(400).json({ error: "conversationID and deputyUserID must be provided in the request body" });
    }

    // Tìm cuộc trò chuyện dựa trên conversationID
    const conversation = await Conversation.findById(conversationID);
    if (!conversation) {
      return res.status(404).json({ error: `Conversation with ID ${conversationID} not found` });
    }

    // Tìm thành viên phó nhóm dựa trên deputyUserID
    const deputyMember = await Member.findOne({ userId: deputyUserID });
    if (!deputyMember) {
      return res.status(404).json({ error: `Member with userID ${deputyUserID} not found` });
    }

    // Kiểm tra xem deputyMember có trong danh sách phó nhóm của cuộc trò chuyện không
    if (!conversation.deputy || conversation.deputy.length === 0 || !conversation.deputy.includes(deputyMember._id)) {
      return res.status(400).json({ error: `Member with userID ${deputyUserID} is not a deputy in the conversation` });
    }

    // Lọc ra danh sách phó nhóm mới sau khi loại bỏ deputyMember
    const updatedDeputy = conversation.deputy.filter((deputyId) => !deputyId.equals(deputyMember._id));

    // Cập nhật danh sách phó nhóm của cuộc trò chuyện sau khi loại bỏ deputyMember
    await Conversation.findByIdAndUpdate(conversationID, { deputy: updatedDeputy });

    // Trả về thông tin cuộc trò chuyện sau khi đã cập nhật thành công
    const updatedConversation = await Conversation.findById(conversationID);
    res.status(200).json(updatedConversation);
  } catch (error) {
    console.error("Error removing deputy from conversation:", error);
    res.status(500).json({ error: "Failed to remove deputy from conversation" });
  }
};
const deleteConversation = async (req, res) => {
  try {
    const conversationID = req.params.id;
    // Kiểm tra xem conversationID đã được cung cấp trong req.params hay không
    if (!conversationID) {
      return res.status(400).json({ error: "conversationID must be provided in the request params" });
    }
    // Tìm và xóa cuộc trò chuyện dựa trên conversationID
    const deletedConversation = await Conversation.findByIdAndDelete(conversationID);
    if (!deletedConversation) {
      return res.status(404).json({ error: `Conversation with ID ${conversationID} not found` });
    }

    res.status(200).json({ message: "Conversation deleted successfully" });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    res.status(500).json({ error: "Failed to delete conversation" });
  }
};

const getArrayConversationUsersByUser = async (req, res) => {
  try {
    const userID = req.params.userID;
    const members = await Member.find({ userId: userID });
    if (!members || members.length === 0) {
      return res.status(200).json([]);
    }
    const memberId = members[0]._id;
    const conversations = await Conversation.find({
      members: memberId,
    });
    if (!conversations) {
      return res.status(404).json([]);
    }
    const arrayConversation = conversations.map((conversation) => {
      return conversation._id;
    });
    res.status(200).json(arrayConversation);
  } catch (error) {
    console.error(error);
    res.status(500).json([]);
  }
};

const updateConversationNameById = async (req, res) => {
  const { conversationID, name } = req.body;

  try {
    // Tìm conversation dựa trên conversationID
    const conversation = await Conversation.findById(conversationID);

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Cập nhật trường name của conversation
    conversation.name = name;

    // Lưu lại conversation đã cập nhật vào cơ sở dữ liệu
    const updatedConversation = await conversation.save();

    return res.status(200).json(updatedConversation); // Trả về conversation sau khi đã được cập nhật
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" }); // Trả về lỗi nếu có lỗi xảy ra
  }
};

const getIdConversationByUserId = async (req, res) => {
  try {
    const { user1, user2 } = req.body;

    const member1 = await Member.findOne({ userId: user1 });
    const member2 = await Member.findOne({ userId: user2 });

    if (!member1 || !member2) {
      return res.status(404).json({ error: "One or both users not found" });
    }

    let conversation = await Conversation.findOne({
      members: { $all: [member1._id, member2._id] },
      type: "Direct",
    });

    if (!conversation) {
      console.log("Chưa tạo cuộc trò chuyện, đang tạo mới...");
      conversation = new Conversation({
        name: "",
        type: "Direct",
        members: [member1._id, member2._id],
        messages: [],
        groupImage: "",
        leader: member1._id,
        createAt: new Date(),
        isjoinfromlink: true,
      });
      await conversation.save();
    }
    return res.status(200).json(conversation._id);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getConversations,
  getConversationById,
  getConversationByMemberId,
  getConversationByIdApp,
  getArrayUserConversationUsers,
  getArrayConversationUsersByUser, // Moi them
  seachConversation,
  getConversationByUserId,
  createConversation,
  createConversationWeb,
  leaveConversation,
  addDeputyToConversation,
  removeDeputyFromConversation,
  selectNewLeader,
  deleteConversation,
  addUserToConversation,
  addUserToArrayConversation, // Moi them
  updateConversationNameById,
  getIdConversationByUserId,
};
