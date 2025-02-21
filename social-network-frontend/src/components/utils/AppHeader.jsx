import React, { useState, useContext } from 'react';
import { Layout, Input, Button, Avatar, Dropdown, Menu } from 'antd';
import { SearchOutlined, PlusOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'; 
import PostModal from '../post/Post';
import { AuthContext } from '../../context/AuthContext';

const { Header } = Layout;

const AppHeader = () => {
  const { auth, logout } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();  

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);


  const userMenu = (
    <Menu>
      <Menu.Item key="profile" onClick={() => navigate('/profile')}>  
        <UserOutlined style={{ marginRight: 8 }} />
        Mon Profil
      </Menu.Item>
      <Menu.Item key="logout" onClick={logout}>
        <LogoutOutlined style={{ marginRight: 8, color: 'red' }} />
        Déconnexion
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Header style={styles.header}>
        <h1 style={styles.logo}>Netwet</h1>

        <Input
          placeholder="Rechercher..."
          prefix={<SearchOutlined />}
          style={styles.searchInput}
        />

        <Button type="primary" icon={<PlusOutlined />} onClick={openModal} style={styles.postButton}>
          Créer un Post
        </Button>

        {/* ✅ Avatar utilisateur avec menu */}
        <Dropdown overlay={userMenu} trigger={['click']}>
          <Avatar
            src={auth.user?.avatar ? `http://localhost:5000${auth.user.avatar}` : null}
            icon={!auth.user?.avatar && <UserOutlined />}
            style={styles.avatar}
          />
        </Dropdown>
      </Header>

      <PostModal visible={modalVisible} onClose={closeModal} onPostCreated={() => {}} />
    </>
  );
};

// ✅ Styles
const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    height: '70px',
    backgroundImage: "url('https://www.shutterstock.com/image-vector/snowcovered-mountain-landscape-trees-under-600nw-2477760795.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderBottom: '1px solid #e0e0e0',
  },
  logo: {
    color: '#fff',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0,
  },
  searchInput: {
    maxWidth: '300px',
    flex: 1,
    margin: '0 20px',
  },
  postButton: {
    marginRight: '20px',
  },
  avatar: {
    cursor: 'pointer',
    backgroundColor: '#1890ff',
  },
};

export default AppHeader;
