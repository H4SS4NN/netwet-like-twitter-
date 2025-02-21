
import React, { useContext } from 'react';
import { Layout, Tabs, List, message } from 'antd';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { PostContext } from '../context/PostContext';
import PostCard from '../components/post/cardpost';

const { Content } = Layout;
const { TabPane } = Tabs;

const Home = () => {
  const { auth } = useContext(AuthContext);
  const { posts, loading, updatePost, deletePost } = useContext(PostContext);


  const allPosts = posts;
  const myPosts = posts.filter((post) => post.userId === auth.user.id);
  const likedPosts = posts.filter(
    (post) =>
      post.likes && post.likes.some((like) => like.userId === auth.user.id)
  );



 

  const handleDelete = async (post) => {
    try {
      await API.delete(`/posts/${post.id}`);
      deletePost(post.id);
      message.success('Post supprimé.');
    } catch (err) {
      console.error("Erreur lors de la suppression du post", err);
      message.error("Erreur lors de la suppression du post");
    }
  };


 const handleLike = async (post) => {
  try {
    await API.post(`/posts/${post.id}/like`);
    
    
    updatePost({
      ...post,
      likes: [...post.likes, { userId: auth.user.id }],
    });

    message.success("Post liké !");
  } catch (err) {
    message.error("Erreur lors du like");
  }
};

const handleUnlike = async (post) => {
  try {
    await API.delete(`/posts/${post.id}/like`);

   
    updatePost({
      ...post,
      likes: post.likes.filter((like) => like.userId !== auth.user.id),
    });

    message.success("Like retiré !");
  } catch (err) {
    message.error("Erreur lors du retrait du like");
  }
};

const handleAddComment = async (post, content) => {
  try {
    const res = await API.post(`/comments/${post.id}`, { content });

    
    updatePost({
      ...post,
      comments: res.data.post.comments,
      likes: post.likes, 
    });

    message.success("Commentaire ajouté !");
  } catch (err) {
    console.error("Erreur lors de l'ajout du commentaire", err);
    message.error("Erreur lors de l'ajout du commentaire");
  }
};

const handleDeleteComment = async (comment) => {
  try {
    const res = await API.delete(`/comments/${comment.id}`);


    updatePost({
      ...res.data.post,
      likes: res.data.post.likes ?? [],
    });

    message.success("Commentaire supprimé !");
  } catch (err) {
    message.error("Erreur lors de la suppression du commentaire");
  }
};


  
 
  
  
  const handleUpdate = async (post, formData) => {
    try {
      const res = await API.put(`/posts/${post.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updatePost(res.data.post);
      message.success('Post mis à jour.');
    } catch (error) {
      console.error("Erreur lors de la mise à jour du post", error);
      message.error("Erreur lors de la mise à jour du post");
    }
  };

  return (
    <Content style={{ padding: '20px' }}>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Tous les posts" key="1">
          <List
            loading={loading}
            itemLayout="vertical"
            dataSource={allPosts}
            renderItem={(post) => (
              <List.Item key={post.id}>
                <PostCard
                  post={post}
                  currentUser={auth.user}
                  onLike={handleLike}
                  onUnlike={handleUnlike}
                  onComment={handleAddComment}
                  onUncomment={handleDeleteComment}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                  updatePost={updatePost} 
                />
              </List.Item>
            )}
          />
        </TabPane>
        <TabPane tab="Mes posts" key="2">
          <List
            loading={loading}
            itemLayout="vertical"
            dataSource={myPosts}
            renderItem={(post) => (
              <List.Item key={post.id}>
                <PostCard
                  post={post}
                  currentUser={auth.user}
                  onLike={handleLike}
                  onUnlike={handleUnlike}
                  onComment={handleAddComment}
                  onUncomment={handleDeleteComment}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                  updatePost={updatePost} 
                />
              </List.Item>
            )}
          />
        </TabPane>
        <TabPane tab="Posts likés" key="3">
          <List
            loading={loading}
            itemLayout="vertical"
            dataSource={likedPosts}
            renderItem={(post) => (
              <List.Item key={post.id}>
                <PostCard
                  post={post}
                  currentUser={auth.user}
                  onLike={handleLike}
                  onUnlike={handleUnlike}
                  onComment={handleAddComment}
                  onUncomment={handleDeleteComment}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                  updatePost={updatePost} 
                />
              </List.Item>
            )}
          />
        </TabPane>
      </Tabs>
    </Content>
  );
};

export default Home;
