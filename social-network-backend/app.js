require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const sequelize = require('./config/db');
const logger = require('./config/logger');

const app = express();
const server = http.createServer(app); 


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  
}));



app.use(express.json());


const routes = require('./routes');
app.use('/api', routes);


global.logger = logger;
console.error = (...args) => logger.error(...args);
console.log   = (...args) => logger.info(...args);
console.warn  = (...args) => logger.warn(...args);


const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});



const userSocketMap = new Map();

io.on('connection', (socket) => {
  console.log(`🟢 Nouvel utilisateur connecté : ${socket.id}`);


  socket.on('register', (userId) => {
    userSocketMap.set(userId, socket.id);
    console.log(`👤 Utilisateur ${userId} enregistré avec le socket ${socket.id}`);
    
   
    io.emit('userOnline', userId);
  });


  socket.on('sendMessage', async (data) => {
    try {
      const { senderId, receiverId, content } = data;
      const { Message } = require('./models');

     
      const newMessage = await Message.create({
        senderId,
        receiverId,
        content
      });

   
      socket.emit('messageSent', newMessage);

    
      const receiverSocketId = userSocketMap.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('newMessage', newMessage);
      }
    } catch (error) {
      console.error('❌ Erreur lors de l’envoi du message', error);
      socket.emit('errorMessage', { message: 'Erreur serveur lors de l’envoi du message.' });
    }
  });


  socket.on('disconnect', () => {
    for (const [userId, sId] of userSocketMap.entries()) {
      if (sId === socket.id) {
        userSocketMap.delete(userId);
        
      
        io.emit('userOffline', userId);
        console.log(`🔴 Utilisateur ${userId} déconnecté.`);
        break;
      }
    }
  });
});


const PORT = process.env.PORT || 5000;
sequelize.sync({ alter: true })
  .then(() => {
    console.log("✅ La base de données est synchronisée.");
    server.listen(PORT, () => {
      console.log(`🚀 Serveur en cours d'exécution sur le port ${PORT}`);
    });
  })
  .catch(err => console.error("❌ Erreur lors de la synchronisation de la base de données :", err));
