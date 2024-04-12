const fs = require("fs");
const socketIo = require("socket.io");
function initializeSocketServer(server) {
  const io = socketIo(server, {
    cors: "*",
  });

<<<<<<< HEAD
  const snakes = {};

=======
>>>>>>> 77add1e6981857561e6d9683dfaded2291843678
  io.on("connection", (socket) => {
    console.log("Có 1 user kết nối có id là: " + socket.id);

    socket.emit("message", "Chào mừng bạn đến với chat!");

    socket.on("joinRoom", (room) => {
      socket.join(room);
      console.log("User " + socket.id + " joined room " + room);
      // Gửi tin nhắn xác nhận khi người dùng tham gia phòng
      const rooms = Array.from(socket.adapter.rooms);
      console.log("Danh sách phòng:", rooms);
      io.to(room).emit("message", "User " + socket.id + " vừa tham gia phòng " + room);
    });

<<<<<<< Updated upstream
    socket.on("leaveRoom", (room) => {
      socket.leave(room);
      console.log("User " + socket.id + " vừa thoát phòng " + room);
      // Gửi tin nhắn xác nhận khi người dùng rời khỏi phòng
      io.to(room).emit("message", "User " + socket.id + " vừa thoát phòng " + room);
      //     }
      // });
=======
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

      io.to(roomId).emit("message", `User ${userId} joined room ${roomId}`);
      const usersInRoom = listUserInRoom.filter((user) => user.roomId === roomId);
      io.to(roomId).emit("usersInRoom", usersInRoom);
>>>>>>> Stashed changes
    });

    socket.on("message", (data) => {
      const { message, room } = data;
      console.log("Tin nhắn từ user " + socket.id + ":", message);
      console.log("Phòng gửi đến:", room);
      console.log("Danh sách phòng:", Array.from(socket.rooms));
<<<<<<< HEAD
      // Gửi tin nhắn đến tất cả các client trong phòng được chỉ đxịnh
=======
      // Gửi tin nhắn đến tất cả các client trong phòng được chỉ định
>>>>>>> 77add1e6981857561e6d9683dfaded2291843678

      io.to(room).emit("message", "User " + socket.id + ": " + message);
    });

    socket.on("rooms", () => {
      updateRoomList();
    });

    socket.on("disconnect", () => {
      console.log("User disconnected: " + socket.id);
      io.emit("message", "User " + socket.id + " đã rời khỏi cuộc trò chuyện.");
    });
    function updateRoomList() {
      const rooms = Array.from(socket.adapter.rooms);
      console.log("Danh sách phòng:", rooms);
      socket.emit("room", rooms);
    }
  });
}

module.exports = initializeSocketServer;
