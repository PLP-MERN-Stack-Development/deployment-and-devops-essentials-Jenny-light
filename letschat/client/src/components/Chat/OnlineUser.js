import React from 'react';
import { Users } from 'lucide-react';
import { getInitials, generateAvatar } from '../../utils/helpers';

const OnlineUsers = ({ users, currentUser }) => {
  return (
    <div className="hidden md:block w-64 bg-white border-r border-gray-200 p-4">
      <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-gray-200">
        <Users className="w-5 h-5 text-purple-600" />
        <h2 className="font-semibold text-gray-800">
          Online ({users.length})
        </h2>
      </div>
      
      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.userId}
            className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-purple-50 transition-colors ${
              user.username === currentUser.username ? 'bg-purple-50' : ''
            }`}
          >
            <div className="relative">
              <div className={`w-10 h-10 bg-gradient-to-br ${generateAvatar(user.username)} rounded-full flex items-center justify-center text-white font-semibold`}>
                {getInitials(user.username)}
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-medium text-gray-700 block truncate">
                {user.username}
              </span>
              {user.username === currentUser.username && (
                <span className="text-xs text-purple-600">You</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OnlineUsers;