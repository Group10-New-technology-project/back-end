const fs = require("fs");
const socketIo = require("socket.io");
function initializeSocketServer(server) {
  const io = socketIo(server, {
    cors: "*",
  });

  const snakes = {};

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

    socket.on("leaveRoom", (room) => {
      socket.leave(room);
      console.log("User " + socket.id + " vừa thoát phòng " + room);
      // Gửi tin nhắn xác nhận khi người dùng rời khỏi phòng
      io.to(room).emit("message", "User " + socket.id + " vừa thoát phòng " + room);
      //     }
      // });
    });

    socket.on("message", (data) => {
      const { message, room } = data;
      console.log("Tin nhắn từ user " + socket.id + ":", message);
      console.log("Phòng gửi đến:", room);
      console.log("Danh sách phòng:", Array.from(socket.rooms));
      // Gửi tin nhắn đến tất cả các client trong phòng được chỉ đxịnh

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
