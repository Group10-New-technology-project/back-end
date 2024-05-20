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
//http://localhost:3000/api/v1/messages/addPinMessageToConversation
router.post("/addPinMessageToConversation", messageController.addPinMessageToConversation);
//http://localhost:3000/api/v1/messages/deletePinMessageToConversation
router.post("/deletePinMessageToConversation", messageController.deletePinMessageToConversation);
//http://localhost:3000/api/v1/messages/prioritizePinMessage
router.post("/prioritizePinMessage", messageController.prioritizePinMessage);
//http://localhost:3000/api/v1/messages/getAllPinMessages
router.post("/getAllPinMessages", messageController.getAllPinMessages);
//http://localhost:3000/api/v1/messages/getMessageById/iddd
router.get("/getMessageById/:messageId", messageController.getMessageById);
//http://localhost:3000/api/v1/messages/getMessageById
router.post("/getMessageByIdWeb", messageController.getMessageByIdWeb);
router.post("/addReaction", messageController.addReaction);
router.post("/deleteReaction", messageController.deleteAllReactions);
//http://localhost:3000/api/v1/messages/deleteReactionById
router.post("/deleteMessageById", messageController.deleteMessageById);
//http://localhost:3000/api/v1/messages/deleteAllReactionByMessageID
router.post("/deleteAllReactionByMessageID", messageController.deleteAllReactionByMessageID);

module.exports = router;
