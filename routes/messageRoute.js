const { Router } = require("express");
const messageController = require("../controllers/messageController");

const router = Router();

router.post("/addMessage", messageController.postMessage);

router.post("/addMessageWeb", messageController.postMessageWeb);
router.get(
  "/getMessagesByConversationId/:conversationId",
  messageController.getMessagesByConversationId
);

module.exports = router;
