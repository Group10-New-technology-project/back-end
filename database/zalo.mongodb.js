// DATABASE ZALO CHAT MONGODB

// BẢNG USERS
// _id: ObjectId, // ID duy nhất của người dùng
// avatar: String, // Đường dẫn đến hình đại diện của người dùng
// coverAvatar: String, // Đường dẫn đến ảnh bìa của hồ sơ của người dùng
// dateOfBirth: Date, // Ngày sinh của người dùng
// gender: String, // Giới tính của người dùng (Male, Female, Other)
// username: String, // Tên người dùng (số điện thoại)
// password: String, // Mật khẩu người dùng (cần được mã hóa)
// isActive: Boolean, // Trạng thái hoạt động của tài khoản
// isAdmin: Boolean, // Trạng thái quản trị viên của người dùng
// isDelete: Boolean, // Cho biết liệu người dùng đã bị xóa hay không
// friends: [ObjectId], // Mảng các ID của bạn bè của người dùng
// friendRequests: [ObjectId], // Mảng các ID của người đã gửi lời mời kết bạn
// friendReceived: [ObjectId]; // Mảng các ID của người nhận lời mời kết bạn từ người khác

// BẢNG COVERSATION
// _id: ObjectId, // ID duy nhất của cuộc trò chuyện
// name: String, // Tên của cuộc trò chuyện
// type: String, // Loại của cuộc trò chuyện (ví dụ: nhóm, cá nhân, ...)
// members: [ObjectId], // Mảng các ID của các thành viên trong cuộc trò chuyện
// pinMessage: [ObjectId], // Mảng các ID của các tin nhắn được ghim trong cuộc trò chuyện
// lastMessage: ObjectId, // ID của tin nhắn cuối cùng trong cuộc trò chuyện
// leader: ObjectId, // ID của người tạo cuộc trò chuyện
// createdAt: Date, // Thời điểm cuộc trò chuyện được tạo
// isJoinFromLink: Boolean // Cho biết liệu có tham gia cuộc trò chuyện từ một liên kết không

// BẢNG TÊN MEMBER
// _id: ObjectId, // ID duy nhất của thành viên
// userId: ObjectId, // ID của người dùng
// isNotify: Boolean, // Cho biết liệu thành viên có thông báo không
// lastSeen: Date // Thời điểm cuối cùng mà thành viên xem tin nhắn

// BẢNG TÊN MESSAGE
// _id: ObjectId, // ID duy nhất của tin nhắn
// conversationId: ObjectId, // ID của cuộc trò chuyện mà tin nhắn thuộc về
// content: String, // Nội dung của tin nhắn
// memberId: ObjectId, // ID của thành viên gửi tin nhắn
// type: String, // Loại của tin nhắn (ví dụ: text, hình ảnh, video, ...)
// createdAt: Date, // Thời điểm tạo tin nhắn
// deleteMembers: [ObjectId], // Mảng các ID của thành viên đã xóa tin nhắn
// recallMessage: ObjectId, // ID của tin nhắn được thu hồi (nếu có)
// reactions: [ObjectId], // Mảng các ID của người dùng đã phản ứng
// tags: [ObjectId] // Mảng các ID của người dùng đã được tag trong tin nhắn

// BẢNG TÊN REACTION
// _id: ObjectId, // ID duy nhất của phản ứng
// status: String, // Trạng thái của phản ứng (ví dụ: active, inactive)
// typeReaction: String, // Loại của phản ứng (ví dụ: like, love, haha, wow, sad, angry, ...)
// quantity: Number // Số lượng của phản ứng

// BẢNG TÊN POST
// _id: ObjectId, // ID duy nhất của bài viết
// title: String, // Tiêu đề của bài viết
// post_at: Date, // Thời gian đăng bài
// content: String, // Nội dung của bài viết
// image: String, // Đường dẫn đến hình ảnh của bài viết (nếu có)
// user_id: ObjectId, // ID của người đăng bài
// categories: [String], // Mảng các danh mục của bài viết
// isProject: Boolean, // Cho biết liệu bài viết có phải là dự án không
// isDelete: Boolean, // Cho biết liệu bài viết đã bị xóa chưa
// isPublic: Boolean, // Cho biết liệu bài viết có công khai không
// like: Number // Số lượt thích của bài viết

// BẢNG TÊN COMMENTS
// _id: ObjectId, // ID duy nhất của bình luận
// post_id: ObjectId, // ID của bài viết mà bình luận thuộc về
// user_id: ObjectId, // ID của người dùng đã bình luận
// content: String, // Nội dung của bình luận
// createdAt: Date, // Thời gian tạo bình luận
// isDelete: Boolean, // Cho biết liệu bình luận đã bị xóa chưa
// like: Number, // Số lượt thích của bình luận
// reply: [ObjectId] // Mảng các ID của câu trả lời cho bình luận này

use("zalo");
// Tạo bảng users
db.createCollection("users");
// Tạo bảng phonebook
db.createCollection("phonebooks");
// Tạo bảng conversation
db.createCollection("conversations");
// Tạo bảng member
db.createCollection("members");
// Tạo bảng message
db.createCollection("messages");
// Tạo bảng reaction
db.createCollection("reactions");
// Tạo bảng post
db.createCollection("posts");
// Tạo bảng comment
db.createCollection("comments");

db.phonebooks.insertMany([
  {
    _id: ObjectId("60aae4843ae33121e0de8501"),
    name: "John Doe",
    phone: "123456789",
    updateat: new Date(),
  },
  {
    _id: ObjectId("60aae4843ae33121e0de8502"),
    name: "Jane Smith",
    phone: "987654321",
    updateat: new Date(),
  },
  {
    _id: ObjectId("60aae4843ae33121e0de8503"),
    name: "Michael Johnson",
    phone: "456789123",
    updateat: new Date(),
  },
  {
    _id: ObjectId("60aae4843ae33121e0de8504"),
    name: "Emily Brown",
    phone: "741852963",
    updateat: new Date(),
  },
  {
    _id: ObjectId("60aae4843ae33121e0de8505"),
    name: "David Wilson",
    phone: "159753456",
    updateat: new Date(),
  },
]);

db.users.insertMany([
  {
    _id: ObjectId("60aae4843ae33121e0de8506"),
    avatar: "https://image666666.s3.ap-southeast-1.amazonaws.com/an.png",
    coveravatar: "link_to_cover_1",
    dateofbirth: ISODate("1990-01-01"),
    gender: "male",
    name: "Nguyễn Nhất An",
    username: "0909878765",
    password: "$2b$10$vbUKrFNutR00mYVq3M.2kOS5VTC0rZBdtsyEWAHJSmcydxiAi5L4m",
    isActive: true,
    isAdmin: false,
    phoneBook: [
      ObjectId("60aae4843ae33121e0de8501"),
      ObjectId("60aae4843ae33121e0de8502"),
      ObjectId("60aae4843ae33121e0de8503"),
    ],
    isDelete: false,
    friends: [],
    friendRequest: [],
    friendReceived: [],
  },
  {
    _id: ObjectId("60aae4843ae33121e0de8507"),
    avatar: "https://image666666.s3.ap-southeast-1.amazonaws.com/chanh.png",
    coveravatar: "link_to_cover_2",
    dateofbirth: ISODate("1990-01-02"),
    gender: "female",
    name: "Phan Lương Trung Chánh",
    username: "0987654324",
    password: "$2b$10$vbUKrFNutR00mYVq3M.2kOS5VTC0rZBdtsyEWAHJSmcydxiAi5L4m",
    isActive: true,
    isAdmin: false,
    phoneBook: [ObjectId("60aae4843ae33121e0de8504"), ObjectId("60aae4843ae33121e0de8505")],
    isDelete: false,
    friends: [ObjectId("60aae4843ae33121e0de8506")],
    friendRequest: [],
    friendReceived: [],
  },
  {
    _id: ObjectId("60aae4843ae33121e0de4368"),
    avatar: "https://image666666.s3.ap-southeast-1.amazonaws.com/duy.png",
    coveravatar: "link_to_cover_3",
    dateofbirth: ISODate("1990-01-04"),
    gender: "female",
    name: "Nguyễn Minh Duy",
    username: "0676542567",
    password: "$2b$10$vbUKrFNutR00mYVq3M.2kOS5VTC0rZBdtsyEWAHJSmcydxiAi5L4m",
    isActive: true,
    isAdmin: false,
    phoneBook: [ObjectId("60aae4843ae33121e0de8501"), ObjectId("60aae4843ae33121e0de8502")],
    isDelete: false,
    friends: [ObjectId("60aae4843ae33121e0de8506")],
    friendRequest: [],
    friendReceived: [],
  },
]);

db.reactions.insertMany([
  {
    _id: ObjectId("60aae4843ae33121e0de7689"),
    typeReaction: "like",
    status: "active",
    quantity: 100,
  },
  {
    _id: ObjectId("60aae4843ae33121e0de4329"),
    typeReaction: "love",
    status: "active",
    quantity: 50,
  },
  {
    _id: ObjectId("60aae4843ae33121e0de0932"),
    typeReaction: "wow",
    status: "active",
    quantity: 30,
  },
  {
    _id: ObjectId("60aae4843ae33121e0de9930"),
    typeReaction: "angry",
    status: "active",
    quantity: 20,
  },
  {
    _id: ObjectId("60aae4843ae33121e0de2296"),
    typeReaction: "sad",
    status: "active",
    quantity: 10,
  },
]);

db.members.insertMany([
  {
    _id: ObjectId("60aae4843ae33121e0de8501"),
    userId: ObjectId("60aae4843ae33121e0de8506"),
    isNotify: true,
    lastSeen: new Date(),
  },
  {
    _id: ObjectId("60aae4843ae33121e0de1234"),
    userId: ObjectId("60aae4843ae33121e0de8507"),
    isNotify: false,
    lastSeen: new Date(),
  },
  {
    _id: ObjectId("60aae4843ae33121e0de8763"),
    userId: ObjectId("60aae4843ae33121e0de4368"),
    isNotify: true,
    lastSeen: new Date(),
  },
]);
db.messages.insertMany([
  {
    _id: ObjectId("60aae4843ae33121e0de1235"), // Giá trị _id có dữ liệu
    content: "Làm bài tập nhóm nhé",
    memberId: ObjectId("60aae4843ae33121e0de8501"), // ID của thành viên gửi tin nhắn
    type: "text",
    createAt: new Date(),
    deleteMember: [], // Không có thành viên nào đã xóa tin nhắn
    recallMessage: false, // Không có tin nhắn nào được thu hồi
    reaction: [ObjectId("60aae4843ae33121e0de7689")], // Không có phản ứng nào
    tag: [], // Không có tag nào
  },
  {
    _id: ObjectId("60aae4843ae33121e0de5678"), // Giá trị _id có dữ liệu
    content:
      "Đoạn văn là một đơn vị văn bản nhỏ, được sắp xếp theo một luồng ý để trình bày một ý kiến, một suy nghĩ hoặc một phần của nội dung. Nó bao gồm một tập hợp các câu văn có liên quan, có mục đích chung và được sắp xếp một cách logic",
    memberId: ObjectId("60aae4843ae33121e0de1234"), // ID của thành viên gửi tin nhắn
    type: "text",
    createAt: new Date(),
    deleteMember: [], // Không có thành viên nào đã xóa tin nhắn
    recallMessage: null, // Không có tin nhắn nào được thu hồi
    reaction: [], // Không có phản ứng nào
    tag: [], // Không có tag nào
  },
  {
    _id: ObjectId("60aae4843ae33121e0de2312"), // Giá trị _id có dữ liệu
    content: "Mai có thể làm được không?",
    memberId: ObjectId("60aae4843ae33121e0de1234"), // ID của thành viên gửi tin nhắn
    type: "text",
    createAt: new Date(),
    deleteMember: [], // Không có thành viên nào đã xóa tin nhắn
    recallMessage: null, // Không có tin nhắn nào được thu hồi
    reaction: [], // Không có phản ứng nào
    tag: [], // Không có tag nào
  },
  {
    _id: ObjectId("60aae4843ae33121e0de1121"), // Giá trị _id có dữ liệu
    content: "Đang ở đâu vậy?",
    memberId: ObjectId("60aae4843ae33121e0de8501"), // ID của thành viên gửi tin nhắn
    type: "text",
    createAt: new Date(),
    deleteMember: [], // Không có thành viên nào đã xóa tin nhắn
    recallMessage: null, // Không có tin nhắn nào được thu hồi
    reaction: [], // Không có phản ứng nào
    tag: [], // Không có tag nào
  },
  {
    _id: ObjectId("60aae4843ae33121e0de9099"), // Giá trị _id có dữ liệu
    content: "Đi học không tao qua chở",
    memberId: ObjectId("60aae4843ae33121e0de8763"), // ID của thành viên gửi tin nhắn
    type: "text",
    createAt: new Date(),
    deleteMember: [], // Không có thành viên nào đã xóa tin nhắn
    recallMessage: null, // Không có tin nhắn nào được thu hồi
    reaction: [], // Không có phản ứng nào
    tag: [], // Không có tag nào
  },
  {
    _id: ObjectId("60aae4843ae33121e0de8888"), // Giá trị _id có dữ liệu
    content: "Ở nhà",
    memberId: ObjectId("60aae4843ae33121e0de8763"), // ID của thành viên gửi tin nhắn
    type: "text",
    createAt: new Date(),
    deleteMember: [], // Không có thành viên nào đã xóa tin nhắn
    recallMessage: null, // Không có tin nhắn nào được thu hồi
    reaction: [], // Không có phản ứng nào
    tag: [], // Không có tag nào
  },
  {
    _id: ObjectId("60aae4843ae33121e0de9012"), // Giá trị _id có dữ liệu
    content:
      "Lorem Ipsum chỉ đơn giản là một đoạn văn bản giả, được dùng vào việc trình bày và dàn trang phục vụ cho in ấn. Lorem Ipsum đã được sử dụng như một văn bản chuẩn cho ngành công nghiệp in ấn từ những năm 1500",
    memberId: ObjectId("60aae4843ae33121e0de8763"), // ID của thành viên gửi tin nhắn
    type: "text",
    createAt: new Date(),
    deleteMember: [], // Không có thành viên nào đã xóa tin nhắn
    recallMessage: null, // Không có tin nhắn nào được thu hồi
    reaction: [], // Không có phản ứng nào
    tag: [], // Không có tag nào
  },
  {
    _id: ObjectId("60aae4843ae33121e0de7777"), // MongoDB sẽ tự động tạo _id mới
    content: "Tối nay 7h tập trung nhé",
    memberId: ObjectId("60aae4843ae33121e0de8501"), // ID của thành viên gửi tin nhắn
    type: "text",
    createAt: new Date(),
    deleteMember: [], // Không có thành viên nào đã xóa tin nhắn
    recallMessage: null, // Không có tin nhắn nào được thu hồi
    reaction: [], // Không có phản ứng nào
    tag: [], // Không có tag nào
  },
]);

db.conversations.insertMany([
  {
    _id: ObjectId("60aae4843ae33121e0de0000"),
    name: "Nhóm 10 Công nghệ mới",
    type: "Group",
    members: [
      ObjectId("60aae4843ae33121e0de8501"),
      ObjectId("60aae4843ae33121e0de1234"),
      ObjectId("60aae4843ae33121e0de8763"),
    ],
    messages: [
      ObjectId("60aae4843ae33121e0de1235"),
      ObjectId("60aae4843ae33121e0de5678"),
      ObjectId("60aae4843ae33121e0de9012"),
      ObjectId("60aae4843ae33121e0de8888"),
      ObjectId("60aae4843ae33121e0de2312"),
      ObjectId("60aae4843ae33121e0de5678"),
      ObjectId("60aae4843ae33121e0de9012"),
    ],
    groupImage: "",
    leader: ObjectId("60aae4843ae33121e0de8501"),
    createAt: new Date("2024-03-23T10:00:00Z"),
    isjoinfromlink: true,
  },
  {
    _id: ObjectId("60aae4843ae33121e0de8502"),
    name: "Nguyễn Nhất An",
    type: "Direct",
    members: [ObjectId("60aae4843ae33121e0de1234"), ObjectId("60aae4843ae33121e0de8501")],
    messages: [ObjectId("60aae4843ae33121e0de1235"), ObjectId("60aae4843ae33121e0de5678")],
    groupImage: "",
    leader: ObjectId("60aae4843ae33121e0de1234"),
    createAt: new Date("2024-03-24T11:00:00Z"),
    isjoinfromlink: false,
  },
  {
    _id: ObjectId("60aae4843ae33121e0de8503"),
    name: "Nguyễn Minh Duy",
    type: "Direct",
    members: [ObjectId("60aae4843ae33121e0de8763"), ObjectId("60aae4843ae33121e0de1234")],
    messages: [ObjectId("60aae4843ae33121e0de8888"), ObjectId("60aae4843ae33121e0de2312")],
    groupImage: "",
    leader: ObjectId("60aae4843ae33121e0de8763"),
    createAt: new Date("2024-03-24T11:00:00Z"),
    isjoinfromlink: false,
  },
]);

db.comments.insertMany([
  {
    _id: ObjectId("60aae4843ae09876e0de9012"), // MongoDB sẽ tự động tạo _id mới
    user_id: ObjectId("60aae4843ae33121e0de8506"), // ID của người dùng
    content: "Nội dung comment 1",
    createAt: new Date("2024-03-25T08:00:00Z"), // Thời gian tạo
    isDelete: false,
    like: 5, // Số lượt like
  },
  {
    _id: ObjectId("60aae4843ae44321e0de9012"), // MongoDB sẽ tự động tạo _id mới
    user_id: ObjectId("60aae4843ae33121e0de4368"), // ID của người dùng
    content: "Nội dung comment 2",
    createAt: new Date("2024-03-25T09:00:00Z"), // Thời gian tạo
    isDelete: false,
    like: 3, // Số lượt like
  },
]);

// Thêm dữ liệu vào bảng post
db.posts.insertMany([
  {
    _id: ObjectId("60aae4843ae65437e0de9012"), // MongoDB sẽ tự động tạo _id mới
    title: "Tiêu đề bài đăng 1",
    post_at: new Date("2024-03-21T08:00:00Z"), // Thời gian đăng
    content: "Nội dung bài đăng 1",
    image: ["link_to_image_1"],
    user_id: ObjectId("60aae4843ae33121e0de8506"), // ID của người đăng
    isProject: true,
    isDelete: false,
    isPublic: true,
    comments: [ObjectId("60aae4843ae09876e0de9012")],
    like: 10, // Số lượt like
  },
  {
    _id: ObjectId("60aae4843ae00098e0de9012"), // MongoDB sẽ tự động tạo _id mới
    title: "Tiêu đề bài đăng 2",
    post_at: new Date("2024-03-23T09:00:00Z"), // Thời gian đăng
    content: "Nội dung bài đăng 2",
    image: ["link_to_image_2"],
    user_id: ObjectId("60aae4843ae33121e0de8507"), // ID của người đăng
    isProject: false,
    isDelete: false,
    isPublic: true,
    comments: [ObjectId("60aae4843ae44321e0de9012")],
    like: 5, // Số lượt like
  },
  {
    _id: ObjectId("60aae4843ae44435e0de9012"), // MongoDB sẽ tự động tạo _id mới
    title: "Tiêu đề bài đăng 3",
    post_at: new Date("2024-03-25T10:00:00Z"), // Thời gian đăng
    content: "Nội dung bài đăng 3",
    image: ["link_to_image_3"],
    user_id: ObjectId("60aae4843ae33121e0de4368"), // ID của người đăng
    isProject: true,
    isDelete: false,
    isPublic: true,
    comments: [],
    like: 8, // Số lượt like
  },
]);
