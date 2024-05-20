const { Router } = require("express");
const userController = require("../controllers/userController");
const multer = require("multer");
const router = Router();
// API //
// http://localhost:3000/api/v1/users/login
router.post("/login", userController.login);
// http://localhost:3000/api/v1/users/sinup
router.post("/sinup", userController.signup);
// http://localhost:3000/api/v1/users/getfriend/60aae4843ae33121e0de8506
router.get("/getfriend/:id", userController.getfriend);
// http://localhost:3000/api/v1/users/getphonebook/60aae4843ae33121e0de8506
router.get("/getphonebook/:id", userController.getPhoneBook);
// http://localhost:3000/api/v1/users/getAllUser
router.get("/getAllUser", userController.getAllUser);
// http://localhost:3000/api/v1/users/60aae4843ae33121e0de8506
router.delete("/:id", userController.deleteUser);
// http://localhost:3000/api/v1/users/60aae4843ae33121e0de8506
router.get("/:id", userController.getUserByID);
// http://localhost:3000/api/v1/users/upload-avatar/60aae4843ae33121e0de8506
router.post("/upload-avatar", multer().single("avatar"), userController.uploadAvatarToS3);
// http://localhost:3000/api/v1/users/updateMK
router.post("/updateMK", userController.updateMK);
//http://localhost:3000/api/v1/users/username
router.post("/username", userController.postUserByUserName);
//http://localhost:3000/api/v1/users/forgot-password
router.post("/forgot-password", userController.forgotPassword);
// http://localhost:3000/api/v1/users/getfriendRequest/60aae4843ae33121e0de8506
router.get("/getfriendRequest/:id", userController.getfriendRequest);
// http://localhost:3000/api/v1/users/getfriendRecived/60aae4843ae33121e0de8506
router.get("/getfriendRecived/:id", userController.getfriendRecived);
// http://localhost:3000/api/v1/users/getFriendWithDetails/60aae4843ae33121e0de8506
router.post("/addFriendRequest", userController.addFriendRequest);
// http://localhost:3000/api/v1/users/deleteFriendRequest
router.post("/deleteFriendRequest", userController.deleteFriendRequest);
// http://localhost:3000/api/v1/users/acceptFriendRequest
router.post("/acceptFriendRequest", userController.acceptFriendRequest);
// http://localhost:3000/api/v1/users/deleteFriends
router.post("/deleteFriends", userController.deleteFriends);
// GET http://localhost:3000/api/v1/users/username/username_example
router.get("/username/:username", userController.getUserByUserName);
// http://localhost:3000/api/v1/users/getfriendRequest/60aae4843ae33121e0de8506
router.get("/getfriendRequestWeb/:id", userController.getfriendRequestWeb);
// http://localhost:3000/api/v1/users/getfriendRecived/60aae4843ae33121e0de8506
router.get("/getfriendRecivedWeb/:id", userController.getfriendRecivedWeb);
// http://localhost:3000/api/v1/users/getFriendWithDetails/60aae4843ae33121e0de8506
router.get("/getFriendWithDetails/:id", userController.getFriendWithDetails);
// http://localhost:3000/api/v1/users/demo/getAllUserName
router.get("/demo/getAllUserName", userController.getAllUserName);
//http://localhost:3000/api/v1/users/updateAvatar
router.post("/updateAvatar", userController.updateAvatar);
// http://localhost:3000/api/v1/users/updateCoverAvatar
router.post("/updateCoverAvatar", userController.updateCoverAvatar);
// http://localhost:3000/api/v1/users/updatePassword
router.post("/updatePassword", userController.updatePassword);
router.post("/changePassword", userController.changePassword);

// API //
module.exports = router;
