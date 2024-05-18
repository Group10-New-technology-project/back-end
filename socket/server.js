const fs = require("fs");
const socketIo = require("socket.io");

function initializeSocketServer(server) {
  const io = socketIo(server, {
    cors: "*",
  });

  let listUserInRoom = [];
  let activeUsers = [];

  io.on("connection", (socket) => {
    console.log(`User connected with id: ${socket.id}`);

    // Xử lý khi một người dùng kết nối mới
    socket.on("new-user-add", (newUserId) => {
      if (!activeUsers.some((user) => user.userId === newUserId)) {
        activeUsers.push({ userId: newUserId, socketId: socket.id });
        console.log("New User Connected", activeUsers);
      }
      io.emit("get-users", activeUsers);
    });

    // Xử lý khi một người dùng tham gia phòng
    socket.on("joinRoom", ({ roomId, userId }) => {
      const existingUser = listUserInRoom.find((user) => user.socketId === socket.id);

      if (existingUser) {
        if (existingUser.roomId !== roomId) {
          // Người dùng rời khỏi phòng hiện tại nếu roomId đã thay đổi
          const disconnectedUserId = existingUser.userId;
          const disconnectedRoomId = existingUser.roomId;

          listUserInRoom = listUserInRoom.filter((user) => user.socketId !== socket.id);
          socket.leave(disconnectedRoomId);

          console.log(`User ${disconnectedUserId} left room ${disconnectedRoomId}`);
          console.log("Updated listUserInRoom after user left:", listUserInRoom);

          io.to(disconnectedRoomId).emit("message", `User ${disconnectedUserId} left room ${disconnectedRoomId}`);

          const remainingUsersInRoom = listUserInRoom.filter((user) => user.roomId === disconnectedRoomId);
          io.to(disconnectedRoomId).emit("usersInRoom", remainingUsersInRoom);
        } else {
          // Người dùng đã tồn tại trong phòng mới
          return;
        }
      }

      // Thêm người dùng vào phòng mới
      listUserInRoom.push({ socketId: socket.id, roomId, userId });
      socket.join(roomId);

      console.log(`User ${userId} joined room ${roomId}`);
      console.log("Updated listUserInRoom after user joined:", listUserInRoom);

      io.to(roomId).emit("message");
      const usersInRoom = listUserInRoom.filter((user) => user.roomId === roomId);
      io.to(roomId).emit("usersInRoom");
    });

    // Xử lý khi một người dùng gửi tin nhắn
    socket.on("message", (data) => {
      const { message, room } = data;
      console.log("Tin nhắn từ user " + socket.id + ":", message);
      console.log("Phòng gửi đến:", room);
      io.to(room).emit("message", "User " + socket.id + ": " + message);
    });
    socket.on("sendMessage", (data) => {
      console.log(`Tin nhắn từ user ${socket.id}:`, data);

      io.emit("sendMessage", data);
    });

    socket.on("createGroup", (data) => {
      const { message, room } = data;
      console.log("Tin nhắn khi tạo " + message);
      console.log("Rom tạo là:", message);
      io.to(room).emit("createGroup", message);
    });

    socket.on("leaveGroup", (data) => {
      const { message, room } = data;
      console.log("Tin nhắn khi tạo " + message);
      console.log("Rom tạo là:", message);
      io.to(room).emit("leaveGroup", message);
    });

    // Xử lý khi một người dùng ngắt kết nối
    socket.on("disconnect", () => {
      io.emit("message", "User " + socket.id + " đã rời khỏi cuộc trò chuyện.");
      activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
      console.log("User Disconnected", activeUsers);
      io.emit("get-users", activeUsers);
    });
  });
}

module.exports = initializeSocketServer;
