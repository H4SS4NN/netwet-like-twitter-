import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";

const Chat = () => {
  const { conversationId } = useParams(); 
  const socket = useSocket();
  const { auth } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [receiverId, setReceiverId] = useState(null); 

  useEffect(() => {
    if (socket && auth.user) {
      socket.emit("register", auth.user.id);

  
      API.get(`/messages/conversation/${conversationId}`)
        .then((res) => setMessages(res.data.messages))
        .catch((err) => console.error("Erreur chargement messages :", err));

      
      API.get(`/conversations/${conversationId}`)
        .then((res) => {
          if (Array.isArray(res.data.conversations) && res.data.conversations.length > 0) {
            const conv = res.data.conversations.find(c => c.id === parseInt(conversationId));

            if (!conv) {
              console.error("🚨 Erreur : aucune conversation trouvée avec cet ID.");
              return;
            }

            console.log("✅ Conversation reçue :", conv);
            
            
            const otherUserId = conv.user1Id === auth.user.id ? conv.user2Id : conv.user1Id;
            setReceiverId(otherUserId); 
            console.log("✅ Receiver ID défini :", otherUserId); 
          } else {
            console.error("🚨 Erreur : aucune conversation trouvée.");
          }
        })
        .catch((err) => console.error("Erreur chargement conversation :", err));

  
      socket.on("newMessage", (newMessage) => {
        if (newMessage.conversationId === parseInt(conversationId)) {
          setMessages((prev) => [...prev, newMessage]);
        }
      });

      return () => socket.off("newMessage");
    }
  }, [socket, auth.user, conversationId]);

  const sendMessage = async () => {
    if (!socket || !message.trim() || !receiverId) {
      console.error("🚨 Erreur: receiverId non défini ou message vide !");
      return;
    }

    try {
     
      const res = await API.post("/messages", {
        receiverId,
        content: message,
        conversationId,
      });

      setMessages((prev) => [...prev, res.data.messageData]);
      setMessage("");

     
      socket.emit("sendMessage", {
        senderId: auth.user.id,
        receiverId,
        content: message,
        conversationId,
      });

    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
    }
  };

  return (
    <div>
      <h3>💬 Discussion</h3>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.senderId === auth.user.id ? "Moi" : "Autre"}</strong>: {msg.content}
          </p>
        ))}
      </div>
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Envoyer</button>
    </div>
  );
};

export default Chat;
