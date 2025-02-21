import React, { useEffect, useState, useContext } from "react";
import { List, Avatar, Button, message } from "antd";
import { Link } from "react-router-dom";
import API from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

import { MessageOutlined } from "@ant-design/icons";

const UserList = () => {
  const { auth } = useContext(AuthContext);
  
  const currentUser = auth?.user;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/users");
        setUsers(res.data.users);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleCreateConversation = async (receiverId) => {
    try {
      const conversation = await createConversation(receiverId);
      message.success("Conversation créée !");
    } catch (error) {
      console.error("Erreur lors de la création de la conversation", error);
      message.error("Impossible de créer la conversation.");
    }
  };

  return (
    <List
      loading={loading}
      dataSource={users.filter(user => user.id !== currentUser.id)}
      renderItem={(user) => (
        <List.Item
          actions={[
            <Button type="primary" onClick={() => handleCreateConversation(user.id)}></Button>,
            <Link to={`/chat/${user.id}`}>
              <MessageOutlined />
            </Link>
          ]}
        >
          <List.Item.Meta
            avatar={<Avatar src={`http://localhost:5000${user.avatar}`} />}
            title={user.username}
          
          />
        </List.Item>
      )}
    />
  );
};

export default UserList;