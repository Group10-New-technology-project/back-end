const { Router } = require("express");
const router = Router();
const conversationController = require("../controllers/conversationController");
const middlewareController = require("../middleware/middlewareController");

// http://localhost:3000/api/v1/conversation/getConversationById/60aae4843ae33121e0de0000
router.get("/getConversationById/:id", conversationController.getConversationById);
// http://localhost:3000/api/v1/conversation/getConversations
router.get("/getConversations", conversationController.getConversations);
// để chọn nhóm nào mà thằng member đó tham gia
// http://localhost:3000/api/v1/conversation/getConversationByMemberId/60aae4843ae33121e0de8501
router.get("/getConversationByMemberId/:memberId", conversationController.getConversationByMemberId);
// http://localhost:3000/api/v1/conversation/getConversationByUserId/60aae4843ae33121e0de8506
router.get("/getConversationByUserId/:userId", conversationController.getConversationByUserId);
// tìm kiếm cuộc trò chuyện theo tên
// http://localhost:3000/api/v1/conversation/seachConversation?searchConversation=3
router.post("/seachConversation", conversationController.seachConversation);
//API get conversations app
// http://localhost:3000/api/v1/conversation/getConversationByIdApp/60aae4843ae33121e0de0000
router.get("/getConversationByIdApp/:id", conversationController.getConversationByIdApp);
//http://localhost:3000/api/v1/conversation/createConversation
router.post("/createConversation", conversationController.createConversation);
//http://localhost:3000/api/v1/conversation/createConversationWeb
router.post("/createConversationWeb", conversationController.createConversationWeb);
//addUserToConversation
//http:localhost:3000/api/v1/conversation/addUserToConversation
router.post("/addUserToConversation", conversationController.addUserToConversation);
//addDeputyToConversation
//http://localhost:3000/api/v1/conversation/addDeputyToConversation
router.post("/addDeputyToConversation", conversationController.addDeputyToConversation);
//removeDeputyFromConversation
//http://localhost:3000/api/v1/conversation/removeDeputyFromConversation
router.post("/removeDeputyFromConversation", conversationController.removeDeputyFromConversation);
//selectNewLeader
//http://localhost:3000/api/v1/conversation/selectNewLeader
router.post("/selectNewLeader", conversationController.selectNewLeader);
//leaveConversation
//http://localhost:3000/api/v1/conversation/leaveConversation
router.post("/leaveConversation", conversationController.leaveConversation);
//deleteConversation
// http://localhost:3000/api/v1/conversation/deleteConversation/60aae4843ae33121e0de0000
router.post("/deleteConversationById/:id", conversationController.deleteConversation);
//http://localhost:3000/api/v1/conversation/getArrayUserConversationUsers/60aae4843ae33121e0de8506
router.get("/getArrayUserConversationUsers/:conversationID", conversationController.getArrayUserConversationUsers);
//http://localhost:3000/api/v1/conversation/addUserToArrayConversation
router.post("/addUserToArrayConversation", conversationController.addUserToArrayConversation);
//http://localhost:3000/api/v1/conversation/getArrayUserConversationUsers/60aae4843ae33121e0de8506
router.get("/getArrayConversationUsersByUser/:userID", conversationController.getArrayConversationUsersByUser);
//http://localhost:3000/api/v1/conversation/updateConversationNameById
router.post("/updateConversationNameById", conversationController.updateConversationNameById);
// http://localhost:3000/api/v1/conversation/getConversationByUserId/60aae4843ae33121e0de8506
router.post("/getIdConversationByUserId", conversationController.getIdConversationByUserId);
module.exports = router;
