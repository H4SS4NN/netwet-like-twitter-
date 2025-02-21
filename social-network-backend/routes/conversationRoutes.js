const express = require("express");
const router = express.Router();
const conversationController = require("../controllers/conversationController");
const authMiddleware = require("../middleware/authMiddleware");


router.get("/:userId", authMiddleware, conversationController.getUserConversations);


router.post("/", authMiddleware, conversationController.createConversation);

module.exports = router;
