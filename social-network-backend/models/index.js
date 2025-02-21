
const fs = require('fs');
const path = require('path');
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

const db = {};
// Read all files in the current directory, except index.js
fs.readdirSync(__dirname)
  .filter(file => file !== 'index.js' && file.slice(-3) === '.js')
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });



if (db.User && db.Post) {
  db.User.hasMany(db.Post, { foreignKey: 'userId', as: 'posts' });
  db.Post.belongsTo(db.User, { foreignKey: 'userId', as: 'author' });
}


if (db.User && db.Comment && db.Post) {
  db.User.hasMany(db.Comment, { foreignKey: 'userId', as: 'comments' });
  db.Comment.belongsTo(db.User, { foreignKey: 'userId', as: 'author' });

  db.Post.hasMany(db.Comment, { foreignKey: 'postId', as: 'comments' });
  db.Comment.belongsTo(db.Post, { foreignKey: 'postId', as: 'post' });
}


if (db.User && db.Like && db.Post) {
  db.User.hasMany(db.Like, { foreignKey: 'userId', as: 'likes' });
  db.Like.belongsTo(db.User, { foreignKey: 'userId' });

  db.Post.hasMany(db.Like, { foreignKey: 'postId', as: 'likes' });
  db.Like.belongsTo(db.Post, { foreignKey: 'postId' });
}


if (db.Message && db.User) {
  db.User.hasMany(db.Message, { foreignKey: 'senderId', as: 'sentMessages' });
  db.Message.belongsTo(db.User, { foreignKey: 'senderId', as: 'sender' });

  db.User.hasMany(db.Message, { foreignKey: 'receiverId', as: 'receivedMessages' });
  db.Message.belongsTo(db.User, { foreignKey: 'receiverId', as: 'receiver' });
}


if (db.User && db.Conversation) {
  db.User.hasMany(db.Conversation, { foreignKey: "user1Id", as: "conversationsInitiated" });
  db.User.hasMany(db.Conversation, { foreignKey: "user2Id", as: "conversationsReceived" });

  db.Conversation.belongsTo(db.User, { foreignKey: "user1Id", as: "user1" });
  db.Conversation.belongsTo(db.User, { foreignKey: "user2Id", as: "user2" });
}

db.sequelize = sequelize;
db.Sequelize = sequelize.constructor; 

module.exports = db;
