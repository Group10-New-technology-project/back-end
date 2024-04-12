const { Router } = require("express");
const router = Router();
const conversationController = require("../controllers/conversationController");
const middlewareController = require("../middleware/middlewareController");

// http://localhost:3000/api/v1/conversation/getConversationById/60aae4843ae33121e0de0000
<<<<<<< Updated upstream
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
=======
router.get("/getConversationById/:id", conversationController.getConversationById);
// http://localhost:3000/api/v1/conversation/getConversations
router.get("/getConversations", conversationController.getConversations);
// để chọn nhóm nào mà thằng member đó tham gia
// http://localhost:3000/api/v1/conversation/getConversationByMemberId/60aae4843ae33121e0de8501
router.get("/getConversationByMemberId/:memberId", conversationController.getConversationByMemberId);
>>>>>>> Stashed changes
// http://localhost:3000/api/v1/conversation/getConversationByUserId/60aae4843ae33121e0de8506
router.get(
  "/getConversationByUserId/:userId",
  // middlewareController.verifyToken,
  conversationController.getConversationByUserId
);
// tìm kiếm cuộc trò chuyện theo tên
// http://localhost:3000/api/v1/conversation/seachConversation?searchConversation=3
router.post("/seachConversation", conversationController.seachConversation);
//API get conversations app
// http://localhost:3000/api/v1/conversation/getConversationByIdApp/60aae4843ae33121e0de0000
<<<<<<< Updated upstream
router.get(
  "/getConversationByIdApp/:id",
  // middlewareController.verifyToken,
  conversationController.getConversationByIdApp
);
=======
router.get("/getConversationByIdApp/:id", conversationController.getConversationByIdApp);
//http://localhost:3000/api/v1/conversation/createConversationApp
router.post("/createConversationApp", conversationController.createConversation);
//http://localhost:3000/api/v1/conversation/createConversationWeb
router.post("/createConversationWeb", conversationController.createConversationWeb);
>>>>>>> Stashed changes

module.exports = router;
