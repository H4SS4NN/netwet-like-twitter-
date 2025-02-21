// models/Post.js
module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true // Permet de poster un post avec ou sans image
      }
    });
  
    return Post;
  };
  