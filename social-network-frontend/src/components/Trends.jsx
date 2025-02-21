// src/components/Trends.jsx
import React from 'react';
import { List } from 'antd';

const Trends = () => {
  const trends = ['ReactJS', 'NodeJS', 'Ant Design', 'JavaScript', 'CSS', 'API'];
  return (
    <div>
      <h3 style={{ marginBottom: '20px' }}>Tendances</h3>
      <List
        dataSource={trends}
        renderItem={(trend) => (
          <List.Item style={{ padding: '5px 0' }}>
            <a href="#" style={{ color: '#1890ff' }}>{trend}</a>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Trends;
