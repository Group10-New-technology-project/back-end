const authController = require("../controllers/authController");
const { Router } = require("express");
const middlewareController = require("../middleware/middlewareController");

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
router.get("/", authController.getAllUser);
//delete user
router.delete(
  "/:id",
  middlewareController.verifyToken,
  authController.deleteUser
);
module.exports = router;
