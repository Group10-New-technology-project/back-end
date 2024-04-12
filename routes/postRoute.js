const { Router } = require("express");
const postController = require("../controllers/postController");

const router = Router();

// http://localhost:3000/api/v1/posts/getPostById/60aae4843ae33121e0de8506
router.get("/getPostById/:userId", postController.getPostsOfUser);

module.exports = router;
