const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const authMiddleware = require("../middleware/authMiddleware");


router.post("/", authMiddleware, messageController.sendMessage);


router.get("/conversation/:conversationId", authMiddleware, messageController.getMessages);

module.exports = router;
