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

//upload avatar s3
router.post("/upload-avatar", multer().single("avatar"), userController.uploadAvatarToS3);
//upload pasword  mới
router.post("/updateMK", userController.updateMK);
//http://localhost:3000/api/v1/users/username
router.post("/username", userController.postUserByUserName);
//forgot password
//http://localhost:3000/api/v1/users/forgot-password
router.post("/forgot-password", userController.forgotPassword);
module.exports = router;
