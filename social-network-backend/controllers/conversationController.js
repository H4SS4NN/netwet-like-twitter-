const { Conversation, User } = require("../models");
const { Op } = require("sequelize");


exports.getUserConversations = async (req, res) => {
  try {
    const { userId } = req.params;

    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: [{ user1Id: userId }, { user2Id: userId }],
      },
      include: [
        { model: User, as: "user1", attributes: ["id", "username", "avatar"] },
        { model: User, as: "user2", attributes: ["id", "username", "avatar"] },
      ],
    });

    if (!conversations || conversations.length === 0) {
      return res.status(404).json({ message: "Aucune conversation trouvée." });
    }

    res.json({ conversations });
  } catch (error) {
    console.error("Erreur lors de la récupération des conversations :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};


exports.createConversation = async (req, res) => {
  try {
    const { user1Id, user2Id } = req.body;

    let conversation = await Conversation.findOne({
      where: {
        [Op.or]: [
          { user1Id, user2Id },
          { user1Id: user2Id, user2Id: user1Id },
        ],
      },
    });

    if (!conversation) {
      conversation = await Conversation.create({ user1Id, user2Id });
    }

    res.status(201).json({ conversation });
  } catch (error) {
    console.error("Erreur lors de la création de la conversation :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
