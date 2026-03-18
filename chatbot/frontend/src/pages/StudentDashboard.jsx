import React from 'react';
import { Plus, MessageSquare, HelpCircle, Send, User, Bot, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChatInterface = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  const recentChats = [
    { title: "New Conversation", time: "Just now", active: false },
    { title: "Course Registration Help", time: "2 hours ago", active: false },
    { title: "Library Hours Query", time: "Yesterday", active: true },
    { title: "Transcript Request", time: "3 days ago", active: false },
    { title: "Financial Aid Information", time: "1 week ago", active: false },
    { title: "Campus Parking Pass", time: "2 weeks ago", active: false },
  ];

  return (
    <div className="flex h-screen w-full bg-gray-900 font-sans text-white">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-gray-800 flex flex-col p-4 text-gray-300 border-r border-gray-700">
        <button className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition-all mb-8">
          <Plus size={18} /> New Chat
        </button>

        <nav className="space-y-4 mb-10">
          <div className="flex items-center gap-3 px-2 cursor-pointer hover:text-white transition">
            <MessageSquare size={18} /> <span>FAQ Section</span>
          </div>
          <div className="flex items-center gap-3 px-2 cursor-pointer hover:text-white transition">
            <HelpCircle size={18} /> <span>Help & Support</span>
          </div>
        </nav>

        <div className="flex-1 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-4">Recent Chats</p>
          <div className="space-y-1">
            {recentChats.map((chat, i) => (
              <div 
                key={i} 
                className={`p-3 rounded-lg cursor-pointer transition ${chat.active ? 'bg-gray-700 text-white' : 'hover:bg-gray-700'}`}
              >
                <p className="text-sm font-medium truncate">{chat.title}</p>
                <p className="text-[10px] text-gray-500 mt-1">{chat.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white w-full py-3 rounded-lg font-medium transition-all mt-4"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* MAIN CHAT AREA */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-gray-800 flex items-center px-8 border-b border-gray-700 justify-between">
          <h2 className="text-xl font-semibold text-white">Student Helpdesk Chatbot</h2>
          <span className="text-sm text-gray-400">Welcome, Student</span>
        </header>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {/* User Message */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 text-white p-4 rounded-2xl rounded-tr-none max-w-lg shadow-sm">
                <p className="text-sm">What are the library hours?</p>
              </div>
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                <User size={16} />
              </div>
            </div>
            <span className="text-[10px] text-gray-500 mr-11">2:15 PM</span>
          </div>

          {/* Bot Message */}
          <div className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-indigo-400">
                <Bot size={18} />
              </div>
              <div className="bg-gray-800 p-4 rounded-2xl rounded-tl-none max-w-lg shadow-sm border border-gray-700">
                <p className="text-sm leading-relaxed text-gray-200">
                  The main library is open Monday-Friday: 8:00 AM - 10:00 PM, Saturday-Sunday: 10:00 AM - 8:00 PM. 
                  During exam periods, we extend hours to 24/7 access.
                </p>
              </div>
            </div>
            <span className="text-[10px] text-gray-500 ml-11">2:15 PM</span>
          </div>

        </div>

        {/* Input Area */}
        <div className="p-4">
          <div className="max-w-4xl mx-auto relative flex items-center">
            <input 
              type="text" 
              placeholder="Ask your queries..." 
              className="w-full bg-gray-700 border border-gray-600 py-4 px-6 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400 pr-16"
            />
            <button className="absolute right-2 p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
              <Send size={20} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatInterface;