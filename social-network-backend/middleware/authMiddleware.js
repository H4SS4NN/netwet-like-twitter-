
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const jwtSecret = process.env.JWT_SECRET || 'votre_secret';

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Accès refusé, aucun token fourni.' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
   
    const decoded = jwt.verify(token, jwtSecret);
    
    
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Accès refusé, utilisateur non trouvé.' });
    }
    
   
    req.user = user;
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide.' });
  }
};
