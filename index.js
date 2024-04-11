// require("dotenv").config();
// const express = require("express");
// const path = require("path");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const { getIPv4Address } = require("./config/ipConfig");
// const http = require("http");

// require("dotenv").config();
// const cors = require("cors");
// const app = express();
// const server = http.createServer(app);
// const ip = process.env.IP;
// const port = process.env.PORT;
// const mongodb = process.env.MONGODB_URI;

// process.env.AWS_SDK_SUPPRESS_MAINTENANCE_MODE_MESSAGE = "1";

// // routes
// const userRoute = require("./routes/userRoute");
// const conversationRoute = require("./routes/conversationRoute");
// const postRoute = require("./routes/postRoute");
// const authRoute = require("./routes/authRoute");
// const postMessageRoute = require("./routes/messageRoute");

// //socketio
// const initializeSocketServer = require("./socketio/server");
// initializeSocketServer(server);

// // middleware
// app.use(express.static(path.join(__dirname, "public")));
// app.use(express.json());
// app.use(cors());
// app.use(cookieParser());
// // database connection
// const dbURI = process.env.MONGODB_URI;

// mongoose
//   .connect(dbURI)
//   .then(() => {
//     console.log("Connected to MongoDB");
//   })
//   .catch((error) => {
//     console.error("Connection failed:", error);
//   });

// // routes
// app.use("/api/v1/users", userRoute);
// app.use("/api/v1/conversation", conversationRoute);
// app.use("/api/v1/posts", postRoute);
// app.use("/api/v1/auth", authRoute);
// app.use("/api/v1/messages", postMessageRoute);
// app.use(function (req, res) {
//   res.status(404).send("Not found");
// });

// server.listen(3000, () => {
//   console.log("Server is running on port 3000.");
// });

// // CHANH
// server.listen(port, ip, () => {
//   console.log("Server is running on IP: " + ip);
//   console.log("Server is running on PORT: " + port);
//   console.log("Server is running on DB: " + mongodb);
// });

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const http = require("http");
const server = http.createServer(app);
const ip = process.env.IP;
const port = process.env.PORT;
const mongodb = process.env.MONGODB_URI;
process.env.AWS_SDK_SUPPRESS_MAINTENANCE_MODE_MESSAGE = "1";
// routes
const userRoute = require("./routes/userRoute");
const conversationRoute = require("./routes/conversationRoute");
const postRoute = require("./routes/postRoute");
const authRoute = require("./routes/authRoute");
const postMessageRoute = require("./routes/messageRoute");
const initializeSocketServer = require("./socket/server");
initializeSocketServer(server);
// middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
// database connection

const dbURI = process.env.MONGODB_URI;
mongoose
  .connect(dbURI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Connection failed:", error);
  });

// routes
app.use("/api/v1/users", userRoute);
app.use("/api/v1/conversation", conversationRoute);
app.use("/api/v1/posts", postRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/messages", postMessageRoute);
app.use(function (req, res) {
  res.status(404).send("Not found");
});

// server.listen(3000, () => {
//   console.log("Server is running on port 3000.");
// });

server.listen(port, ip, () => {
  console.log("Server is running on IP: " + ip);
  console.log("Server is running on PORT: " + port);
  console.log("Server is running on DB: " + mongodb);
});
