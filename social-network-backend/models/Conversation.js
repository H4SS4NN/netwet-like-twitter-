module.exports = (sequelize, DataTypes) => {
    const Conversation = sequelize.define("Conversation", {
      user1Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user2Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
  
    return Conversation;
  };
  