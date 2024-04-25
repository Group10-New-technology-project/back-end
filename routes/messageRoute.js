const { Router } = require("express");
const messageController = require("../controllers/messageController");
const router = Router();
const multer = require("multer");

router.post("/addMessage", messageController.postMessage);
//http://localhost:3000/api/v1/messages/addMessageWeb
router.post("/addMessageWeb", messageController.postMessageWeb);
router.get("/getMessagesByConversationId/:conversationId", messageController.getMessagesByConversationId);
router.post("/uploadImageToS3", multer().single("image"), messageController.uploadImageToS3);
router.post("/deleteMessage", messageController.deleteMessage);
router.post("/thuHoiMessage", messageController.thuHoiMessage);
router.post("/addReply", messageController.addReply);
router.post("/senderMessageToConversations", messageController.postMessageToConversations);
//http://localhost:3000/api/v1/messages/addPinMessageToConversations
router.post("/addPinMessageToConversations", messageController.addPinMessageToConversations);
//http://localhost:3000/api/v1/messages/deletePinMessageToConversations
router.post("/deletePinMessageToConversations", messageController.deletePinMessageToConversations);

module.exports = router;
