import React from 'react';
import { MessageCircle, LogOut, User } from 'lucide-react';

const Header = ({ user, onLogout }) => {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <MessageCircle className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-purple-600"></div>
          </div>
          <div>
            <h1 className="text-2xl font-bold">LetsChat</h1>
            <p className="text-sm text-purple-200">Real-time messaging</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
            <User className="w-4 h-4" />
            <span className="font-medium">{user.username}</span>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors backdrop-blur-sm"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;