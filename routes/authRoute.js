const authController = require("../controllers/authController");
const { Router } = require("express");
const middlewareController = require("../controllers/middlewareController");

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

module.exports = router;
