import React, { useContext } from 'react';
import { Menu, Avatar, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { HomeOutlined, UserOutlined, LogoutOutlined, LoginOutlined, UserAddOutlined, MessageFilled, CommentOutlined } from '@ant-design/icons';

const { Text } = Typography;

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ width: 256 }}>
      <div style={{ padding: '20px', textAlign: 'center', borderBottom: '1px solid #f0f0f0' }}>
        {auth.user && (
          <>
            <Avatar size={80} src={`http://localhost:5000${auth.user.avatar}`} />
            <div style={{ marginTop: 10 }}>
              <Text strong>{auth.user.username}</Text>
              <br />
              <Text type="secondary">{auth.user.email}</Text>
            </div>
          </>
        )}
      </div>
      <Menu mode="inline" defaultSelectedKeys={['1']} style={{ borderRight: 0 }}>
        <Menu.Item key="1" icon={<HomeOutlined />}>
          <Link to="/">Accueil</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<MessageFilled />}>
          <Link to="/conversations">Messages</Link> 
        </Menu.Item>
        {auth.user ? (
          <>
            <Menu.Item key="3" icon={<UserOutlined />}>
              <Link to="/profile">Profile</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<CommentOutlined />}>
              <Link to="/chat/1">Chat</Link> 
            </Menu.Item>
            <Menu.Item key="5" icon={<LogoutOutlined />} onClick={handleLogout}>
              Logout
            </Menu.Item>
          </>
        ) : (
          <>
            <Menu.Item key="6" icon={<LoginOutlined />}>
              <Link to="/login">Login</Link>
            </Menu.Item>
            <Menu.Item key="7" icon={<UserAddOutlined />}>
              <Link to="/signup">Signup</Link>
            </Menu.Item>
          </>
        )}
      </Menu>
    </div>
  );
};

export default Navbar;
