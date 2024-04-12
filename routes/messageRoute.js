const { Router } = require("express");
const messageController = require("../controllers/messageController");
const router = Router();
const multer = require("multer");

router.post("/addMessage", messageController.postMessage);
<<<<<<< Updated upstream
=======
router.post("/addMessageWeb", messageController.postMessageWeb);
router.get("/getMessagesByConversationId/:conversationId", messageController.getMessagesByConversationId);
router.post("/uploadImageToS3", multer().single("image"), messageController.uploadImageToS3);
router.delete("/deleteMessage", messageController.deleteMessage);
router.post("/thuHoiMessage", messageController.thuHoiMessage);
>>>>>>> Stashed changes

module.exports = router;
