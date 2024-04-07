const { Router } = require("express");
const conversationController = require("../controllers/ConversationController");

const router = Router();
const middlewareController = require("../middleware/middlewareController");

// API để test Postman
// http://localhost:3000/api/v1/conversation/getConversationById/60aae4843ae33121e0de0000
router.get(
  "/getConversationById/:id",
  middlewareController.verifyToken,
  conversationController.getConversationById
);

// http://localhost:3000/api/v1/conversation/getConversations
router.get(
  "/getConversations",
  // middlewareController.verifyToken,
  conversationController.getConversations
);

// để chọn nhóm nào mà thằng member đó tham gia
// http://localhost:3000/api/v1/conversation/getConversationByMemberId/60aae4843ae33121e0de8501
router.get(
  "/getConversationByMemberId/:memberId",
  // middlewareController.verifyToken,
  conversationController.getConversationByMemberId
);
// http://localhost:3000/api/v1/conversation/getConversationByUserId/60aae4843ae33121e0de8506
router.get(
  "/getConversationByUserId/:userId",
  // middlewareController.verifyToken,
  conversationController.getConversationByUserId
);
// tìm kiếm cuộc trò chuyện theo tên
// http://localhost:3000/api/v1/conversation/seachConversation?searchConversation=3
router.post("/seachConversation", conversationController.seachConversation);

module.exports = router;
