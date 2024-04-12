const authController = require("../controllers/authController");
const { Router } = require("express");
const middlewareController = require("../middleware/middlewareController");
const userController = require("../controllers/userController");
const router = Router();
// const { verifyToken } = require("../controllers/verifyToken");

//REGISTER
router.post("/signup", authController.signup);
// REFRESH TOKEN
router.post("/refresh", authController.requestRefreshToken);
// //LOG IN
router.post("/login", authController.loginUser);
// //LOG OUT
router.post("/logout", middlewareController.verifyToken, authController.logOut);
// //GET USER
router.get("/", middlewareController.verifyToken, authController.getAllUser);
//delete user
router.delete("/:id", middlewareController.verifyToken, authController.deleteUser);
//http://localhost:3000/api/v1/auth/60aae4843ae33121e0de8506
//get user by id
router.get("/:id", middlewareController.verifyToken, authController.getUserByID);
//http://localhost:3000/api/v1/users/auth/forgot-password
router.post("/forgot-password", userController.forgotPassword);
module.exports = router;
