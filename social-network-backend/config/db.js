// db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_DATABASE, 
  process.env.DB_USER,    
  process.env.DB_PASS,    
  {
    host: process.env.DB_HOST,     
    dialect: process.env.DB_DIALECT || 'mysql', 
  }
);

sequelize
  .authenticate()
  .then(() => console.log("Connecté à la base de données avec succès"))
  .catch((err) => console.error("Erreur de connexion à la base de données:", err));

module.exports = sequelize;
