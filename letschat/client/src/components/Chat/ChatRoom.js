import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import socketService from '../../services/socket';
import { messageAPI } from '../../services/api';
import Header from '../Layout/Header';
import OnlineUsers from './OnlineUser';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import toast from 'react-hot-toast';

const ChatRoom = () => {
  const { user, logout } = useAuth();
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Connect to socket
    const socket = socketService.connect(user.id, user.username);

    // Load previous messages
    messageAPI.getMessages()
      .then(res => {
        setMessages(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading messages:', err);
        toast.error('Failed to load messages');
        setLoading(false);
      });

    // Socket event listeners
    socket.on('new_message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on('system_message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on('online_users', (users) => {
      setOnlineUsers(users);
    });

    socket.on('user_typing', ({ username, isTyping }) => {
      if (isTyping) {
        setTypingUser(username);
        setTimeout(() => setTypingUser(''), 3000);
      } else {
        setTypingUser('');
      }
    });

    // Cleanup
    return () => {
      socketService.disconnect();
    };
  }, [user]);

  const handleSendMessage = (message) => {
    socketService.emit('chat_message', {
      userId: user.id,
      message: message.trim(),
      room: 'general'
    });
  };

  const handleTyping = (isTyping) => {
    socketService.emit('typing', {
      username: user.username,
      isTyping
    });
  };

  if (loading) {
    return (
      <div className="h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <Header user={user} onLogout={logout} />
      
      <div className="flex-1 flex max-w-7xl mx-auto w-full overflow-hidden">
        <OnlineUsers users={onlineUsers} currentUser={user} />
        
        <div className="flex-1 flex flex-col bg-white">
          <MessageList 
            messages={messages} 
            currentUser={user}
            typingUser={typingUser}
          />
          <MessageInput 
            onSendMessage={handleSendMessage}
            onTyping={handleTyping}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;