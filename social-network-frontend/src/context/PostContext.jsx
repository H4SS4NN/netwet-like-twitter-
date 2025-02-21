
import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchPosts = async () => {
    try {
      const res = await API.get('/posts');
      setPosts(res.data.posts);
    } catch (err) {
      console.error('Erreur lors de la récupération des posts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const addPost = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const updatePost = (updatedPost) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  const deletePost = (postId) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  return (
    <PostContext.Provider value={{ posts, loading, addPost, updatePost, deletePost }}>
      {children}
    </PostContext.Provider>
  );
};
