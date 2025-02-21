module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "unique_username", // ✅ Évite la création de multiples index
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "unique_email", // ✅ Donne un nom d’index spécifique
      validate: { isEmail: true }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM("online", "offline", "away"),
      allowNull: false,
      defaultValue: "offline"
    },
    lastActive: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    indexes: [] 
  });

  return User;
};
