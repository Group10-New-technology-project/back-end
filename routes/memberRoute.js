const { Router } = require("express");
const memBerController = require("../controllers/memberController");

const router = Router();
// thêm 1 member
router.post("/addMember/:userId", memBerController.createMember);

router.get("/allMember", memBerController.getAllMember);
//http://localhost:3000/api/v1/member/getMemberByUserId/60aae4843ae33121e0de8506
router.get("/getMemberByUserId/:userId", memBerController.getMemberbyUserId);

router.get("/getMemberById/:memberId", memBerController.getMemberbyId);

module.exports = router;
