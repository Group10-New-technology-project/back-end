const { Router } = require("express");
const userController = require("../controllers/userController");
const multer = require("multer");
const router = Router();

// http://localhost:3000/api/v1/users/login
router.post("/login", userController.login);
// http://localhost:3000/api/v1/users/sinup
router.post("/sinup", userController.signup);
// lấy ra danh sách bạn bè của 1 user  theo id cuả user
// http://localhost:3000/api/v1/users/getfriend/60aae4843ae33121e0de8506
router.get("/getfriend/:id", userController.getfriend);
// lấy ra danh bạ của 1 user theo id của user
// http://localhost:3000/api/v1/users/getphonebook/60aae4843ae33121e0de8506
router.get("/getphonebook/:id", userController.getPhoneBook);
//get all user
router.get("/", userController.getAllUser);
//get delete user
router.delete("/:id", userController.deleteUser);
//get  user by id
///http://192.168.0.201:3000/api/v1/users/60aae4843ae33121e0de8506
router.get("/:id", userController.getUserByID);
//upload avatar s3
router.post("/upload-avatar", multer().single("avatar"), userController.uploadAvatarToS3);
//upload pasword  mới
router.post("/updateMK", userController.updateMK);
//http://localhost:3000/api/v1/users/username
router.post("/username", userController.postUserByUserName);
//forgot password
//http://localhost:3000/api/v1/users/forgot-password
router.post("/forgot-password", userController.forgotPassword);
// get friend request
// http://localhost:3000/api/v1/users/getfriendRequest/60aae4843ae33121e0de8506
router.get("/getfriendRequest/:id", userController.getfriendRequest);
// get friend recive
// http://localhost:3000/api/v1/users/getfriendRecived/60aae4843ae33121e0de8506
router.get("/getfriendRecived/:id", userController.getfriendRecived);
// add friend request
router.post("/addFriendRequest", userController.addFriendRequest);
// delete friend request
//http://192.168.0.201:3000/api/v1/users/deleteFriendRequest
router.post("/deleteFriendRequest", userController.deleteFriendRequest);
// accept friend request
//http://192.168.0.201:3000/api/v1/users/acceptFriendRequest
router.post("/acceptFriendRequest", userController.acceptFriendRequest);
// delete friends
//http://192.168.0.201:3000/api/v1/users/deleteFriends
router.post("/deleteFriends", userController.deleteFriends);
//-----------------------------------------------------------
module.exports = router;
