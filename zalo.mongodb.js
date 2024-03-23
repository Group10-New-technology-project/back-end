
// tạo 1 dbs tên là zalo

// có bảng tên là users
// có các trường sau
// _id
// avatar
// coveravatar
// dateofbirth
// gender
// username
// password
// isactive
// isadmin
// phoneBook : Object[] // mảng các số điện thoại trong danh bạ
// isdelete
// friends : Object[] // mảng các id bạn bè
// friendrequest : Object[] // mảng các id bạn bè đã gửi lời mời kết bạn

// bảng tên phonebook
// có các trường sau
// _id
// name
// phone
// updateat


// banng tên coversation
// có các trường sau
// _id
// name
// type
// members : Object[] // mảng các id thành viên
// pinMessage : Object[] // mảng các id tin nhắn đã pin
// lastMessage 
// learder  // id người tạo nhóm
// createAt
// isjoinfromlink // có tham gia từ link không

// bảng tên member
// có các trường sau
// _id
// userId
// isNotify // có thông báo không
// lastSeen // thời gian cuối cùng xem tin nhắn


// bảng tên message
// có các trường sau
// _id
// conversationId
// content
// memberId
// type
// createAt
// deleteMember : Object[] // mảng các id thành viên đã xóa tin nhắn
// recallMessage // id tin nhắn thu hồi
// reaction : Object[] // mảng các id người dùng đã phản ứng
// tag : Object[] // mảng các id người dùng đã tag


// bảng tên reaction
// có các trường sau
// _id
// typeReaction // loại phản ứng
// status // trạng thái phản ứng
// quantity // số lượng phản ứng

// bảng tên post
// có các trường sau
// _id
// title
// post_at // thời gian đăng
// content // nội dung
// image // ảnh
// user_id // id người đăng
// categories // danh mục
// isProject // có phải dự án không
// isDelete // đã xóa chưa
// isPublic // công khai không
// like // số lượt like

// bảng tên comment
// có các trường sau
// _id
// post_id // id bài viết
// user_id // id người dùng
// content // nội dung
// createAt // thời gian tạo
// isDelete // đã xóa chưa
// like // số lượt like
// reply // mảng các id reply


use('zalo')

// Tạo bảng users
db.createCollection('users')
// Tạo bảng phonebook
db.createCollection('phonebooks')
// Tạo bảng conversation
db.createCollection('conversations')
// Tạo bảng member
db.createCollection('members')
// Tạo bảng message
db.createCollection('messages')
// Tạo bảng reaction
db.createCollection('reactions')
// Tạo bảng post
db.createCollection('posts')
// Tạo bảng comment
db.createCollection('comments')


db.phonebooks.insertMany([
  { _id: ObjectId("60aae4843ae33121e0de8501"), name: "John Doe", phone: "123456789", updateat: new Date() },
  { _id: ObjectId("60aae4843ae33121e0de8502"), name: "Jane Smith", phone: "987654321", updateat: new Date() },
  { _id: ObjectId("60aae4843ae33121e0de8503"), name: "Michael Johnson", phone: "456789123", updateat: new Date() },
  { _id: ObjectId("60aae4843ae33121e0de8504"), name: "Emily Brown", phone: "741852963", updateat: new Date() },
  { _id: ObjectId("60aae4843ae33121e0de8505"), name: "David Wilson", phone: "159753456", updateat: new Date() }
]);

db.users.insertMany([
  {
    _id: ObjectId("60aae4843ae33121e0de8506"),
    avatar: "link_to_avatar_1",
    coveravatar: "link_to_cover_1",
    dateofbirth: ISODate("1990-01-01"),
    gender: "male",
    name: "John Doe",
    username: "0909878765",
    password: "password_1",
    isActive: true,
    isAdmin: false,
    phoneBook: [
      ObjectId("60aae4843ae33121e0de8501"),
      ObjectId("60aae4843ae33121e0de8502"),
      ObjectId("60aae4843ae33121e0de8503"),
    ],
    isDelete: false,
    friends: [
      ObjectId("60aae4843ae33121e0de8507"),
      ObjectId("60aae4843ae33121e0de4368")
    ],
    friendRequest: []
  },
  {
    _id: ObjectId("60aae4843ae33121e0de8507"),
    avatar: "link_to_avatar_2",
    coveravatar: "link_to_cover_2",
    dateofbirth: ISODate("1990-01-02"),
    gender: "female",
    name: "Jane Smith",
    username: "0987654324",
    password: "password_2",
    isActive: true,
    isAdmin: false,
    phoneBook: [
      ObjectId("60aae4843ae33121e0de8504"),
      ObjectId("60aae4843ae33121e0de8505"),
    ],
    isDelete: false,
    friends: [
      ObjectId("60aae4843ae33121e0de8506")
    ],
    friendRequest: []
  },
  {
    _id: ObjectId("60aae4843ae33121e0de4368"),
    avatar: "link_to_avatar_3",
    coveravatar: "link_to_cover_3",
    dateofbirth: ISODate("1990-01-04"),
    gender: "female",
    name: "Emily Brown",
    username: "0676542567",
    password: "password_3",
    isActive: true,
    isAdmin: false,
    phoneBook: [
      ObjectId("60aae4843ae33121e0de8501"),
      ObjectId("60aae4843ae33121e0de8502"),

    ],
    isDelete: false,
    friends: [
      ObjectId("60aae4843ae33121e0de8506")
    ],
    friendRequest: []
  }
]);


db.reactions.insertMany([
  {
    _id: ObjectId("60aae4843ae33121e0de7689"),
    typeReaction: "like",
    status: "active",
    quantity: 100
  },
  {
    _id: ObjectId("60aae4843ae33121e0de4329"),
    typeReaction: "love",
    status: "active",
    quantity: 50
  },
  {
    _id: ObjectId("60aae4843ae33121e0de0932"),
    typeReaction: "wow",
    status: "active",
    quantity: 30
  },
  {
    _id: ObjectId("60aae4843ae33121e0de9930"),
    typeReaction: "angry",
    status: "active",
    quantity: 20
  },
  {
    _id: ObjectId("60aae4843ae33121e0de2296"),
    typeReaction: "sad",
    status: "active",
    quantity: 10
  }
]);

db.members.insertMany([
  {
    _id: ObjectId("60aae4843ae33121e0de8501"),
    userId: ObjectId("60aae4843ae33121e0de8506"),
    isNotify: true,
    lastSeen: new Date()
  },
  {
    _id: ObjectId("60aae4843ae33121e0de1234"),
    userId: ObjectId("60aae4843ae33121e0de8507"),
    isNotify: false,
    lastSeen: new Date()
  },
  {
    _id: ObjectId("60aae4843ae33121e0de8763"),
    userId: ObjectId("60aae4843ae33121e0de4368"),
    isNotify: true,
    lastSeen: new Date()
  }
]);

db.messages.insertMany([
  {
    _id: ObjectId("60aae4843ae33121e0de1235"), // Giá trị _id có dữ liệu
    content: "Message chat 1 content 1",
    memberId: ObjectId("60aae4843ae33121e0de8501"), // ID của thành viên gửi tin nhắn
    type: "text",
    createAt: new Date(),
    deleteMember: [], // Không có thành viên nào đã xóa tin nhắn
    recallMessage: false, // Không có tin nhắn nào được thu hồi
    reaction: [
      ObjectId("60aae4843ae33121e0de7689")
    ], // Không có phản ứng nào
    tag: [] // Không có tag nào
  },
  {
    _id: ObjectId("60aae4843ae33121e0de5678"), // Giá trị _id có dữ liệu
    content: "Message chat 1 content 2",
    memberId: ObjectId("60aae4843ae33121e0de1234"), // ID của thành viên gửi tin nhắn
    type: "text",
    createAt: new Date(),
    deleteMember: [], // Không có thành viên nào đã xóa tin nhắn
    recallMessage: null, // Không có tin nhắn nào được thu hồi
    reaction: [], // Không có phản ứng nào
    tag: [] // Không có tag nào
  },
  {
    _id: ObjectId("60aae4843ae33121e0de9012"), // Giá trị _id có dữ liệu
    content: "Message chat 1 content 3",
    memberId: ObjectId("60aae4843ae33121e0de8763"), // ID của thành viên gửi tin nhắn
    type: "text",
    createAt: new Date(),
    deleteMember: [], // Không có thành viên nào đã xóa tin nhắn
    recallMessage: null, // Không có tin nhắn nào được thu hồi
    reaction: [], // Không có phản ứng nào
    tag: [] // Không có tag nào
  },
  {
    _id: ObjectId("60aae4843ae33121e0de7777"), // MongoDB sẽ tự động tạo _id mới
    content: "Message content 4",
    memberId: ObjectId("60aae4843ae33121e0de8501"), // ID của thành viên gửi tin nhắn
    type: "text",
    createAt: new Date(),
    deleteMember: [], // Không có thành viên nào đã xóa tin nhắn
    recallMessage: null, // Không có tin nhắn nào được thu hồi
    reaction: [], // Không có phản ứng nào
    tag: [] // Không có tag nào
  }
])

db.conversations.insertMany([
  {
    _id: ObjectId("60aae4843ae33121e0de0000"),
    name: "Group Chat 1",
    type: "Group",
    members: [
      ObjectId("60aae4843ae33121e0de8501"),
      ObjectId("60aae4843ae33121e0de1234"),
      ObjectId("60aae4843ae33121e0de8763")
    ],
    messages: [
      ObjectId("60aae4843ae33121e0de1235"),
      ObjectId("60aae4843ae33121e0de5678"),
      ObjectId("60aae4843ae33121e0de9012"),
    ],
    groupImage: "",
    leader: ObjectId("60aae4843ae33121e0de8501"),
    createAt: new Date("2024-03-23T10:00:00Z"),
    isjoinfromlink: true
  },
  {
    _id: ObjectId("60aae4843ae33121e0de8502"),
    name: "Group Chat 2",
    type: "Direct",
    members: [
      ObjectId("60aae4843ae33121e0de8501"),
      ObjectId("60aae4843ae33121e0de1234")
    ],
    messages: [],
    groupImage: "",
    leader: ObjectId("60aae4843ae33121e0de1234"),
    createAt: new Date("2024-03-24T11:00:00Z"),
    isjoinfromlink: false
  },
  {
    _id: ObjectId("60aae4843ae33121e0de8503"),
    name: "Group Chat 3",
    type: "Direct",
    members: [
      ObjectId("60aae4843ae33121e0de8763"),
      ObjectId("60aae4843ae33121e0de8501")
    ],
    messages: [],
    groupImage: "",
    leader: ObjectId("60aae4843ae33121e0de8763"),
    createAt: new Date("2024-03-24T11:00:00Z"),
    isjoinfromlink: false
  },
])

db.comments.insertMany([
  {
    _id: ObjectId("60aae4843ae09876e0de9012"), // MongoDB sẽ tự động tạo _id mới
    user_id: ObjectId("60aae4843ae33121e0de8506"), // ID của người dùng
    content: "Nội dung comment 1",
    createAt: new Date("2024-03-25T08:00:00Z"), // Thời gian tạo
    isDelete: false,
    like: 5 // Số lượt like
  },
  {
    _id: ObjectId("60aae4843ae44321e0de9012"), // MongoDB sẽ tự động tạo _id mới
    user_id: ObjectId("60aae4843ae33121e0de4368"), // ID của người dùng
    content: "Nội dung comment 2",
    createAt: new Date("2024-03-25T09:00:00Z"), // Thời gian tạo
    isDelete: false,
    like: 3 // Số lượt like
  }
])


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
    like: 10 // Số lượt like
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
    like: 5 // Số lượt like
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
    like: 8 // Số lượt like
  }
])



