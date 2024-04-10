const fs = require("fs");
const socketIo = require("socket.io");
function initializeSocketServer(server) {
  const io = socketIo(server, {
    cors: "*",
  });

  const snakes = {};

  io.on("connection", (socket) => {
    console.log("Có 1 user kết nối có id là: " + socket.id);

    // Gửi tin nhắn chào mừng khi một người dùng kết nối
    socket.emit("message", "Chào mừng bạn đến với chat!");

    // Lắng nghe sự kiện 'joinRoom' từ client để tham gia phòng
    socket.on("joinRoom", ({ roomId, userId }) => {
      socket.join(roomId);
      console.log("rocketid", socket.id);
      io.to(roomId).emit("message", `User ${userId} vừa tham gia phòng ${roomId}`);
    });

    // Lắng nghe sự kiện 'message' từ client
    socket.on("message", (data) => {
      const { message, room } = data;
      console.log("Tin nhắn từ user " + socket.id + ":", message);
      console.log("Phòng gửi đến:", room);
      console.log("Danh sách phòng:", Array.from(socket.rooms));
      // Gửi tin nhắn đến tất cả các client trong phòng được chỉ định
      io.to(room).emit("message", "User " + socket.id + ": " + message);
    });

    socket.on("rooms", () => {
      updateRoomList();
    });
    // socket.on("file", (data) => {
    //   try {
    //     const { fileName, fileData, room } = data;
    //     const fileBuffer = Buffer.from(fileData.split(";base64,").pop(), "base64");

    //     // Gửi tệp tin trực tiếp cho người dùng
    //     io.to(room).emit("fileResponse", { fileName: fileName, fileData: fileData });
    //   } catch (error) {
    //     console.log(error);
    //   }
    // });

    socket.on("disconnect", () => {
      console.log("User disconnected: " + socket.id);
      io.emit("message", "User " + socket.id + " đã rời khỏi cuộc trò chuyện.");
    });
  });
}

module.exports = initializeSocketServer;
