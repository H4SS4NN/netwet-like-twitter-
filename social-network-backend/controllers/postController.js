
const { Post, User, Comment, Like } = require('../models');


exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newPost = await Post.create({
      content,
      imageUrl,
      userId: req.user.id
    });

   
    const postWithAuthor = await Post.findOne({
      where: { id: newPost.id },
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'avatar'] 
      }]
    });

    res.status(201).json({ message: 'Post créé.', post: postWithAuthor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};


exports.getAllPosts = async (req, res) => {
  try {
    const where = {};
    if (req.query.userId) {
      where.userId = req.query.userId;
    }

    const posts = await Post.findAll({
      where,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'avatar', 'status']
        },
        {
          model: Like,
          as: 'likes',
          attributes: ['userId']
        },
        {
          model: Comment,
          as: 'comments',
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'username', 'avatar']
            }
          ],
          order: [['createdAt', 'ASC']]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};




exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'avatar']
        },
        {
          model: Comment,
          as: 'comments',
          include: [{ model: User, as: 'author', attributes: ['id', 'username'] }]
        },
        {
          model: Like,
          as: 'likes',
          attributes: ['userId']
        }
      ]
    });
    if (!post) {
      return res.status(404).json({ message: 'Post non trouvé.' });
    }
    res.json({ post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: 'Post non trouvé.' });
    }

    if (post.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Action non autorisée.' });
    }
    let imageUrl = post.imageUrl;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }
    post.content = content || post.content;
    post.imageUrl = imageUrl;
    await post.save();
    
    const updatedPost = await Post.findOne({
      where: { id: post.id },
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'avatar']
      }]
    });
    
    res.json({ message: 'Post mis à jour.', post: updatedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};


// Supprimer un post (autorisé pour l'auteur ou un admin)
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: 'Post non trouvé.' });
    }
    // Vérifie si l'utilisateur est l'auteur ou un administrateur
    if (post.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Action non autorisée.' });
    }
    await post.destroy();
    res.json({ message: 'Post supprimé.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};


exports.likePost = async (req, res) => {
  try {
    const { id } = req.params; // ID du post
   
    const existingLike = await Like.findOne({ where: { postId: id, userId: req.user.id } });
    if (existingLike) {
      return res.status(400).json({ message: 'Vous avez déjà liké ce post.' });
    }
    const like = await Like.create({ postId: id, userId: req.user.id });
    res.json({ message: 'Post liké.', like });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};


exports.unlikePost = async (req, res) => {
  try {
    const { id } = req.params; 
    const like = await Like.findOne({ where: { postId: id, userId: req.user.id } });
    if (!like) {
      return res.status(400).json({ message: "Vous n'avez pas liké ce post." });
    }
    await like.destroy();
    res.json({ message: 'Like retiré.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};


exports.adminDeletePost = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Accès réservé aux administrateurs.' });
    }
    const { id } = req.params;
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: 'Post non trouvé.' });
    }
    await post.destroy();
    res.json({ message: 'Post supprimé par l\'administrateur.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
