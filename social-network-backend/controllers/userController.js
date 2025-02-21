
const { User } = require('../models');
const fs = require('fs');
const path = require('path');

exports.getAllUsers = async (req, res) => {
  try {
 
    const users = await User.findAll({
      attributes: ['id', 'username', 'avatar']
    });

    
    const filteredUsers = users.filter(user => user.id !== req.user.id);

    res.json({ users: filteredUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
exports.getProfile = async (req, res) => {
  try {
    
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { username, description, location, avatar } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

 
    user.username = username || user.username;
    user.description = description || user.description;
    user.location = location || user.location;
    user.avatar = avatar || user.avatar;

    await user.save();

    res.json({ message: 'Profil mis à jour.', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.updateAvatar = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
    if (req.file) {
    
      user.avatar = `/uploads/avatars/${req.file.filename}`;
      await user.save();
      return res.json({ message: 'Avatar mis à jour.', user });
    } else {
      return res.status(400).json({ message: 'Aucun fichier uploadé.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.deleteAvatar = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
   
    if (user.avatar) {
      
   
      const filePath = path.join(__dirname, '../../public', user.avatar);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Erreur lors de la suppression du fichier:', err);
       
        }
      });
    }
   
    user.avatar = null;
    await user.save();
    return res.json({ message: 'Avatar supprimé.', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
const bcrypt = require('bcrypt');
const saltRounds = 10;


exports.updateSensitive = async (req, res) => {
  try {
   
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }


    const { email, oldPassword, newPassword } = req.body;

    
    if (email && email !== user.email) {
    
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ message: "Cet email est déjà utilisé." });
      }
      user.email = email;
    }

 
    if (newPassword) {
      if (!oldPassword) {
        return res.status(400).json({ message: "L'ancien mot de passe est requis pour changer le mot de passe." });
      }
     
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "L'ancien mot de passe est incorrect." });
      }
    
      if (newPassword.length < 12) {
        return res.status(400).json({ message: "Le nouveau mot de passe doit contenir au moins 12 caractères." });
      }
    
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      user.password = hashedPassword;
    }

 
    await user.save();
    return res.json({ message: "Informations sensibles mises à jour.", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};