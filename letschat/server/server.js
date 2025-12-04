const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/messages', require('./routes/messages'));

// Socket.io Configuration
const User = require('./models/User');
const Message = require('./models/Message');

const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // User joins
  socket.on('user_connected', async ({ userId, username }) => {
    socket.userId = userId;
    socket.username = username;
    
    onlineUsers.set(userId, {
      socketId: socket.id,
      username,
      userId
    });

    // Update user online status
    await User.findByIdAndUpdate(userId, { isOnline: true });

    // Broadcast online users
    io.emit('online_users', Array.from(onlineUsers.values()));

    // System message
    const systemMessage = await Message.create({
      sender: userId,
      content: `${username} joined the chat`,
      type: 'system'
    });

    io.emit('system_message', systemMessage);
  });

  // Chat message
  socket.on('chat_message', async (data) => {
    try {
      const message = await Message.create({
        sender: data.userId,
        content: data.message,
        room: data.room || 'general'
      });

      const populatedMessage = await Message.findById(message._id)
        .populate('sender', 'username avatar');

      io.emit('new_message', populatedMessage);
    } catch (error) {
      console.error('Message error:', error);
    }
  });

  // Typing indicator
  socket.on('typing', (data) => {
    socket.broadcast.emit('user_typing', {
      username: data.username,
      isTyping: data.isTyping
    });
  });

  // Private message
  socket.on('private_message', async (data) => {
    const recipientSocket = onlineUsers.get(data.recipientId);
    
    if (recipientSocket) {
      io.to(recipientSocket.socketId).emit('private_message', {
        from: socket.username,
        message: data.message,
        timestamp: new Date()
      });
    }
  });

  // Disconnect
  socket.on('disconnect', async () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      
      await User.findByIdAndUpdate(socket.userId, {
        isOnline: false,
        lastSeen: new Date()
      });

      io.emit('online_users', Array.from(onlineUsers.values()));

      const systemMessage = await Message.create({
        sender: socket.userId,
        content: `${socket.username} left the chat`,
        type: 'system'
      });

      io.emit('system_message', systemMessage);
    }
    
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});