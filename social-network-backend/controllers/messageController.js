const { Message, Conversation, User } = require("../models");
const { Op } = require("sequelize");



exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user.id;

    if (!receiverId) {
      return res.status(400).json({ message: "receiverId est requis" });
    }

  
    let conversation = await Conversation.findOne({
      where: {
        [Op.or]: [
          { user1Id: senderId, user2Id: receiverId },
          { user1Id: receiverId, user2Id: senderId },
        ],
      },
    });

    if (!conversation) {
      conversation = await Conversation.create({ user1Id: senderId, user2Id: receiverId });
    }


    if (!conversation || !conversation.id) {
      return res.status(500).json({ message: "Erreur: conversation non créée" });
    }

  
    const newMessage = await Message.create({
      senderId,
      receiverId,
      content,
      conversationId: conversation.id,
    });

    res.status(201).json({ message: "Message envoyé.", messageData: newMessage, conversationId: conversation.id });
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};


exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    
    const messages = await Message.findAll({
      where: { conversationId },
      order: [["createdAt", "ASC"]],
    });

    res.json({ messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
