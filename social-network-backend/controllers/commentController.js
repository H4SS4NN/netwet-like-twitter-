// controllers/commentController.js
const { Comment, Post, User } = require('../models');

exports.createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;

 
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post non trouvé.' });
    }


    await Comment.create({
      content,
      postId: post.id,
      userId: req.user.id
    });

   
    const updatedPost = await Post.findByPk(postId, {
      include: [
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
      ]
    });

    res.status(201).json({ message: 'Commentaire ajouté.', post: updatedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};


exports.getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

  
    const comments = await Comment.findAll({
      where: { postId },
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'avatar']
      }],
      order: [['createdAt', 'ASC']]
    });

    res.json({ comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Commentaire non trouvé.' });
    }

  
    if (comment.userId !== req.user.id) {
      return res.status(403).json({ message: 'Action non autorisée.' });
    }

    
    const postId = comment.postId;
    await comment.destroy();

    const updatedPost = await Post.findByPk(postId, {
      include: [
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
      ]
    });

    res.json({ message: 'Commentaire supprimé.', post: updatedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

