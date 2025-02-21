import React, { useState } from 'react';
import { 
  Card, 
  Avatar, 
  Tooltip, 
  Button, 
  Dropdown, 
  Menu, 
  Input, 
  List, 
  Upload,

} from 'antd';
import {
  MoreOutlined,
  LikeOutlined,
  LikeFilled,
  CommentOutlined,
  EditOutlined,
  UploadOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

const PostCard = ({ 
  post, 
  currentUser, 
  onLike, 
  onUnlike, 
  onComment,   
  onUncomment, 
  onDelete, 
  onUpdate,
  updatePost
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editImage, setEditImage] = useState(null);

 
  const hasLiked = post.likes?.some((like) => like.userId === currentUser.id);


  const handleCommentSubmit = () => {
    if (commentInput.trim() === '') return;
    if (onComment) {
      onComment(post, commentInput);
      setCommentInput('');
    }
  };

 
  const handleDeleteComment = (comment) => {
    if (onUncomment) {
      onUncomment(comment);
    }
  };

  const handleLikeClick = async () => {
    try {
      if (hasLiked) {
        await onUnlike(post);
        updatePost({
          ...post,
          likes: (post.likes ?? []).filter((like) => like.userId !== currentUser.id),
        });
      } else {
        await onLike(post);
        updatePost({
          ...post,
          likes: [...(post.likes ?? []), { userId: currentUser.id }],
        });
      }
    } catch (err) {
      if (
        err.response &&
        err.response.data &&
        err.response.data.message === 'Vous avez déjà liké ce post.'
      ) {
        updatePost({
          ...post,
          likes: (post.likes ?? []).filter((like) => like.userId !== currentUser.id),
        });
      } else {
        console.error('Erreur lors du like:', err);
      }
    }
  };
  
  


  const menu = (
    <Menu>
      {currentUser.id === post.author?.id && (
        <>
          <Menu.Item key="update" onClick={() => setEditMode(true)} style={{ padding: '10px', cursor: 'pointer' }}>
            <EditOutlined style={{ marginRight: '8px' }} />
            Modifier
          </Menu.Item>
          <Menu.Item key="delete" onClick={() => onDelete(post)} style={{ padding: '10px', cursor: 'pointer' }}>
            <DeleteOutlined style={{ marginRight: '8px', color: 'red' }} />
            Supprimer
          </Menu.Item>
        </>
      )}
    </Menu>
  );

  // Gestion de l'upload d'image
  const handleBeforeUpload = (file) => {
    setEditImage(file);
    return false; 
  };

  // Mise à jour d'un post
  const handleUpdateSubmit = () => {
    const formData = new FormData();
    formData.append('content', editContent);
    if (editImage) {
      formData.append('image', editImage);
    }
    onUpdate(post, formData);
    setEditMode(false);
  };

  return (
    <Card
      style={{ marginBottom: '20px' }}
      title={post.author?.username || 'Utilisateur inconnu'}
      extra={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={`http://localhost:5000${post.author?.avatar}`}>
            {!post.author?.avatar && post.author?.username
              ? post.author.username.charAt(0).toUpperCase()
              : '?'}
          </Avatar>
          <Dropdown overlay={menu} trigger={['click']}>
            <Button type="text" icon={<MoreOutlined style={{ fontSize: '16px' }} />} />
          </Dropdown>
        </div>
      }
    >
      {editMode ? (
        <>
          <Input.TextArea 
            rows={4} 
            value={editContent} 
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Modifier le contenu..."
          />
          <Upload 
            beforeUpload={handleBeforeUpload} 
            maxCount={1}
            showUploadList={{ showRemoveIcon: true }}
            onRemove={() => setEditImage(null)}
          >
            <Button icon={<UploadOutlined />}>Choisir une image</Button>
          </Upload>
          <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
            <Button type="primary" onClick={handleUpdateSubmit}>
              Enregistrer
            </Button>
            <Button onClick={() => setEditMode(false)}>
              Annuler
            </Button>
          </div>
        </>
      ) : (
        <>
          <p>{post.content}</p>
          {post.imageUrl && (
            <img
              src={`http://localhost:5000${post.imageUrl}`}
              alt="post"
              style={{
                width: '100%',
                maxWidth: '500px',
                height: '200px',
                objectFit: 'cover',
                marginTop: '10px',
                borderRadius: '8px',
              }}
            />
          )}
          <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Tooltip title={hasLiked ? "Retirer le like" : "J'aime"}>
              <Button
                type="text"
                icon={hasLiked ? <LikeFilled style={{ color: '#1890ff' }} /> : <LikeOutlined />}
                onClick={handleLikeClick}
              />
            </Tooltip>
            <span>{post.likes?.length || 0} likes</span>

            <Tooltip title="Commenter">
              <Button
                type="text"
                icon={<CommentOutlined />}
                onClick={() => setShowComments(!showComments)}
              />
            </Tooltip>
          </div>

          {showComments && (
            <div style={{ marginTop: '20px' }}>
              {post.comments && post.comments.length > 0 && (
                <List
                  dataSource={post.comments}
                  header={<strong>Commentaires</strong>}
                  renderItem={(comment) => (
                    <List.Item key={comment.id}>
                      <strong>{comment.author.username}:</strong> {comment.content}
                      {comment.userId === currentUser.id && (
                        <Button
                          type="text"
                          icon={<DeleteOutlined />}
                          onClick={() => handleDeleteComment(comment)}
                          danger
                        />
                      )}
                    </List.Item>
                  )}
                />
              )}
              <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                <Input
                  placeholder="Ajouter un commentaire..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                />
                <Button type="primary" onClick={handleCommentSubmit}>
                  Envoyer
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
};

export default PostCard;
