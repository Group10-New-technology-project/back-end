const { Router } = require("express");
const conversationController = require("../controllers/conversationController");

const router = Router();
const middlewareController = require("../middleware/middlewareController");

// API để test Postman
// http://localhost:3000/api/v1/conversation/getConversationById/60aae4843ae33121e0de0000
router.get("/getConversationById/:id", conversationController.getConversationById);

// http://localhost:3000/api/v1/conversation/getConversations
router.get("/getConversations", conversationController.getConversations);

// để chọn nhóm nào mà thằng member đó tham gia
// http://localhost:3000/api/v1/conversation/getConversationByMemberId/60aae4843ae33121e0de8501
router.get(
  "/getConversationByMemberId/:memberId",
  conversationController.getConversationByMemberId
);
// http://localhost:3000/api/v1/conversation/getConversationByUserId/60aae4843ae33121e0de8506
router.get("/getConversationByUserId/:userId", conversationController.getConversationByUserId);
// tìm kiếm cuộc trò chuyện theo tên
// http://localhost:3000/api/v1/conversation/seachConversation?searchConversation=3
router.post("/seachConversation", conversationController.seachConversation);

//API get conversations app
// http://localhost:3000/api/v1/conversation/getConversationByIdApp/60aae4843ae33121e0de0000
router.get("/getConversationByIdApp/:id", conversationController.getConversationByIdApp);

module.exports = router;
