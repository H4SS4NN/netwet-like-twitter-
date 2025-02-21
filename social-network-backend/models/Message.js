module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define("Message", {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    conversationId: {  // Ajout de l'ID de conversation
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });

  return Message;
};
