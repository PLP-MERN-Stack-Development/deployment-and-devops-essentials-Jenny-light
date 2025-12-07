import React, { useEffect, useRef } from 'react';
import { formatTime } from '../../utils/helpers';
import { getInitials, generateAvatar } from '../../utils/helpers';

const MessageList = ({ messages, currentUser, typingUser }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUser]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg) => (
        <div
          key={msg._id || msg.id}
          className={`flex ${msg.type === 'system' ? 'justify-center' : msg.sender?.username === currentUser.username ? 'justify-end' : 'justify-start'} animate-fadeIn`}
        >
          {msg.type === 'system' ? (
            <div className="bg-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm">
              {msg.content}
            </div>
          ) : (
            <div className={`max-w-xs lg:max-w-md ${msg.sender?.username === currentUser.username ? 'order-2' : 'order-1'}`}>
              <div className="flex items-end space-x-2">
                {msg.sender?.username !== currentUser.username && (
                  <div className={`w-8 h-8 bg-gradient-to-br ${generateAvatar(msg.sender?.username || 'User')} rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0`}>
                    {getInitials(msg.sender?.username || 'User')}
                  </div>
                )}
                <div>
                  {msg.sender?.username !== currentUser.username && (
                    <p className="text-xs text-gray-500 mb-1 ml-1">{msg.sender?.username}</p>
                  )}
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      msg.sender?.username === currentUser.username
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p className={`text-xs mt-1 ${msg.sender?.username === currentUser.username ? 'text-purple-200' : 'text-gray-500'}`}>
                      {formatTime(msg.createdAt || msg.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
      
      {typingUser && (
        <div className="flex items-center space-x-2 text-gray-500 text-sm animate-fadeIn">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <span>{typingUser} is typing...</span>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;