const { Router } = require("express");
const messageController = require("../controllers/messageController");

const router = Router();

router.post("/addMessage", messageController.postMessage);

module.exports = router;
