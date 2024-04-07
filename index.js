const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const ip = process.env.IP;
const port = process.env.PORT;
process.env.AWS_SDK_SUPPRESS_MAINTENANCE_MODE_MESSAGE = "1";
// routes
const userRoute = require("./routes/userRoute");
const conversationRoute = require("./routes/conversationRoute");
const postRoute = require("./routes/postRoute");
const authRoute = require("./routes/authRoute");
const postMessageRoute = require("./routes/messageRoute");
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

// app.listen(3000, () => {
//   console.log("Server is running on port 3000.");
// });

app.listen(port, ip, () => {
  console.log("Server is running on IP: " + ip);
  console.log("Server is running on PORT: " + port);
});
//CHANH