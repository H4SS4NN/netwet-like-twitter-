// src/components/CommentItem.jsx
import React from 'react';
import { Comment, Tooltip, Avatar } from 'antd';

const CommentItem = ({ comment }) => {
  return (
    <Comment
      author={comment.author.username}
      avatar={<Avatar src={comment.author.avatar} />}
      content={<p>{comment.content}</p>}
      datetime={
        <Tooltip title={new Date(comment.createdAt).toLocaleString()}>
          <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
        </Tooltip>
      }
    />
  );
};

export default CommentItem;
