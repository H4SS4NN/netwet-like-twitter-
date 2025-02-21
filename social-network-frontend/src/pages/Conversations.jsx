import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api"; 

const Conversations = () => {
  const { auth } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.user) {
      API.get(`/conversations/${auth.user.id}`) 
        .then((res) => setConversations(res.data.conversations))
        .catch((err) => console.error("Erreur lors de la récupération des conversations :", err));
    }
  }, [auth.user]);

  const openChat = (conversationId) => {
    navigate(`/chat/${conversationId}`); 
  };

  return (
    <div>
      <h2>📩 Vos discussions</h2>
      {conversations.length === 0 ? (
        <p>Aucune conversation.</p>
      ) : (
        <ul>
          {conversations.map((conv) => {
            const otherUser = conv.user1.id === auth.user.id ? conv.user2 : conv.user1;
            return (
              <li key={conv.id} onClick={() => openChat(conv.id)} style={{ cursor: "pointer", padding: "10px", borderBottom: "1px solid #ddd" }}>
                <strong>{otherUser.username}</strong>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Conversations;
