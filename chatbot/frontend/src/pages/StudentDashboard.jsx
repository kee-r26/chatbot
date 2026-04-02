import React, { useState, useEffect, useRef } from "react";
import {
  Plus, MessageSquare, HelpCircle, Send, User, Bot, LogOut, Trash2,
} from "lucide-react";
// ADD THIS import
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import {
  createConversation,
  listConversations,
  getMessages,
  updateTitle,
  deleteConversation,
} from "../actions/conversationActions";
import { sendMessage } from "../actions/chatActions";
import { formatReply } from "../utils/formatReply";

const cookies = new Cookies();

// ── Typing indicator bubble ───────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-indigo-400 shrink-0">
          <Bot size={18} />
        </div>
        <div className="bg-gray-800 px-5 py-4 rounded-2xl rounded-tl-none border border-gray-700 flex gap-1 items-center">
          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

// ── Bot bubble — renders plain text or structured table ───────────────────────
function BotBubble({ text, time }) {
  const parsed = formatReply(text);

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-indigo-400 shrink-0 mt-1">
          <Bot size={18} />
        </div>
        <div className="bg-gray-800 p-4 rounded-2xl rounded-tl-none max-w-lg shadow-sm border border-gray-700">
          {parsed.type === "text" ? (
            <p className="text-sm leading-relaxed text-gray-200">{parsed.content}</p>
          ) : (
            <div className="text-sm text-gray-200">
              <p className="font-semibold mb-2 text-white">{parsed.heading}</p>
              <div className="space-y-1">
                {parsed.rows.map((row, i) => (
                  <div key={i} className="flex gap-3">
                    {row.left && (
                      <span className="font-mono text-indigo-300 text-xs whitespace-nowrap shrink-0 pt-0.5">
                        {row.left}
                      </span>
                    )}
                    <span className="text-gray-200">{row.right}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {time && (
        <span className="text-[10px] text-gray-500 ml-11">{time}</span>
      )}
    </div>
  );
}

// ── User bubble ───────────────────────────────────────────────────────────────
function UserBubble({ text, time }) {
  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-start gap-3">
        <div className="bg-indigo-600 text-white p-4 rounded-2xl rounded-tr-none max-w-lg shadow-sm">
          <p className="text-sm">{text}</p>
        </div>
        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white shrink-0 mt-1">
          <User size={16} />
        </div>
      </div>
      {time && (
        <span className="text-[10px] text-gray-500 mr-11">{time}</span>
      )}
    </div>
  );
}

// ── Sidebar skeleton ──────────────────────────────────────────────────────────
function SidebarSkeleton() {
  return (
    <div className="space-y-2 px-1">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-3 rounded-lg animate-pulse">
          <div className="h-3 bg-gray-600 rounded w-3/4 mb-2" />
          <div className="h-2 bg-gray-700 rounded w-1/3" />
        </div>
      ))}
    </div>
  );
}

// ── Welcome / empty state ─────────────────────────────────────────────────────

function WelcomeScreen({ onSuggest }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 text-center px-8">
      <div>
        <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Bot size={32} className="text-white" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          How can I help you today?
        </h3>
        <p className="text-gray-400 text-sm">
          Ask me about your timetable, exams, or fees.
        </p>
      </div>
    </div>
  );
}

// ── Format timestamp ──────────────────────────────────────────────────────────
function formatTime(ts) {
  if (!ts) return "";
  const d = ts instanceof Date ? ts : new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ── FAQ section ───────────────────────────────────────────────────────────
const SUGGESTIONS = [
  "What are my classes today?",
  "When is my next exam?",
  "What are my semester fees?",
  "What are my exam fees?"
];

function FAQScreen({ onSuggest }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 text-center px-8">
      <div>
        <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Bot size={32} className="text-white" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          How can I help you today?
        </h3>
        <p className="text-gray-400 text-sm">
          Ask me about your timetable, exams, or fees.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onSuggest(s)}
            className="text-left px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Help & Support ───────────────────────────────────────────────────────────
function HelpScreen() {
  return (
    <div className="flex items-center justify-center h-full text-center px-8">
      <div>
        <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <HelpCircle size={32} className="text-white" />
        </div>

        <h3 className="text-xl font-semibold text-white mb-2">
          Need Help?
        </h3>

        <p className="text-gray-400 text-sm mb-3">
          For further queries, please contact{" "}
          <span className="text-indigo-400">support@college.edu</span>
        </p>

        <p className="text-gray-400 text-sm">
          📞 +91 98765 43210
        </p>

        <p className="text-gray-500 text-xs mt-2">
          Mon – Fri, 9:00 AM – 5:00 PM
        </p>

        <p className="text-gray-400 text-sm mt-4">
          🎓 Exams: <span className="text-indigo-400">exams@college.edu</span>
        </p>

        <p className="text-gray-400 text-sm">
          💳 Fees: <span className="text-indigo-400">accounts@college.edu</span>
        </p>

        <p className="text-gray-400 text-sm">
          📚 Academics: <span className="text-indigo-400">academics@college.edu</span>
        </p>

        <p className="text-gray-400 text-sm mt-4">
          🌐 www.college.edu
        </p>

        <p className="text-gray-400 text-sm">
          📸 @college_official
        </p>

        <p className="text-gray-500 text-xs mt-4">
          We usually respond within 24 hours on working days.
        </p>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
const StudentDashboard = ({ showUnauthorized }) => {
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarLoading, setIsSidebarLoading] = useState(true);
  const [hoveredConvId, setHoveredConvId] = useState(null);

  const [view, setView] = useState("chat"); // "chat" | "faq" | "help"

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load conversations on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await listConversations();
        setConversations(res.data);
      } catch {
        // handled silently — user sees empty sidebar
      } finally {
        setIsSidebarLoading(false);
      }
    })();
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleLogout = () => {
    cookies.remove("authToken", { path: "/" });
    navigate("/login");
  };

  // Open a past conversation
  const handleSelectConversation = async (id) => {
    setView("chat");
    if (id === activeConversationId) return;
    setActiveConversationId(id);
    setMessages([]);
    try {
      const res = await getMessages(id);
      setMessages(res.data);
    } catch {
      setMessages([]);
    }
    inputRef.current?.focus();
  };

  // Start a brand-new conversation
  const handleNewChat = async () => {
    setView("chat");
    try {
      const res = await createConversation();
      const newConv = res.data;
      setConversations((prev) => [newConv, ...prev]);
      setActiveConversationId(newConv.id);
      setMessages([]);
      inputRef.current?.focus();
    } catch {
      // fail silently
    }
  };

  // Delete a conversation
  const handleDeleteConversation = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeConversationId === id) {
        setActiveConversationId(null);
        setMessages([]);
      }
    } catch {
      // fail silently
    }
  };

  // Core send logic
  const handleSend = async (text) => {
    const trimmed = (text ?? inputValue).trim();
    if (!trimmed || isLoading) return;

    setView("chat");

    setInputValue("");

    // If no active conversation, create one first
    let convId = activeConversationId;
    if (!convId) {
      try {
        const res = await createConversation();
        const newConv = res.data;
        setConversations((prev) => [newConv, ...prev]);
        setActiveConversationId(newConv.id);
        convId = newConv.id;
      } catch {
        return;
      }
    }

    const userMsg = { role: "user", text: trimmed, created_at: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const reply = await sendMessage(trimmed, convId);

      const botMsg = { role: "bot", text: reply, created_at: new Date() };
      setMessages((prev) => [...prev, botMsg]);

      // Set conversation title from first user message
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === convId && c.title === "New Conversation") {
            const newTitle = trimmed.slice(0, 40);
            updateTitle(convId, newTitle).catch(() => {});
            return { ...c, title: newTitle, updated_at: new Date().toISOString() };
          }
          // Bubble conversation to top on new message
          if (c.id === convId) {
            return { ...c, updated_at: new Date().toISOString() };
          }
          return c;
        }).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      );
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Sorry, something went wrong. Please try again.", created_at: new Date() },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-900 font-sans text-white">

     {/* ── SIDEBAR ───────────────────────────────────────────────────────── */}
<aside
  className={`${
    sidebarOpen ? "w-72" : "w-16"
  } bg-gray-800 flex flex-col px-3 py-4 text-gray-300 border-r border-gray-700 shrink-0 transition-all duration-300`}
>
  {/* ── COLLAPSED MODE ── */}
  {!sidebarOpen ? (
    <div className="flex flex-col items-center h-full">

      {/* ICON STACK (perfect spacing) */}
      <div className="flex flex-col items-center gap-3">
        
        {/* Toggle FIRST */}
        <button
          onClick={() => setSidebarOpen(true)}
          title="Open Sidebar"
          className="p-2 rounded-lg hover:bg-gray-700 transition"
        >
          <Menu size={18} />
        </button>

        <button
          onClick={handleNewChat}
          title="New Chat"
          className="p-2 rounded-lg hover:bg-gray-700 transition"
        >
          <Plus size={18} />
        </button>

        <button
          title="FAQ"
          onClick={() => {
            setView("faq");
            setActiveConversationId(null);
            setMessages([]);
          }}
          className={`p-2 rounded-lg transition ${
            view === "faq" ? "bg-gray-700 text-white" : "hover:bg-gray-700"
          }`}
        >
          <MessageSquare size={18} />
        </button>

        <button
          title="Help"
          onClick={() => {
            setView("help");
            setActiveConversationId(null);
            setMessages([]);
          }}
          className={`p-2 rounded-lg transition ${
            view === "help" ? "bg-gray-700 text-white" : "hover:bg-gray-700"
          }`}
        >
          <HelpCircle size={18} />
        </button>
      </div>

      {/* Logout pinned bottom */}
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          title="Logout"
          className="p-2 rounded-lg hover:bg-red-600/30 text-gray-300 hover:text-red-400 transition"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  ) : (
    /* ── OPEN MODE (UNCHANGED STRUCTURE) ── */
    <>
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleNewChat}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-14 rounded-lg font-medium"
        >
          <Plus size={18} /> New Chat
        </button>

        <button
          onClick={() => setSidebarOpen(false)}
          title="Close Sidebar"
          className="p-2 rounded-lg hover:bg-gray-700 transition"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="space-y-3 mb-6">
        <div
          onClick={() => {
            setView("faq");
            setActiveConversationId(null);
            setMessages([]);
          }}
          className={`flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer transition ${
            view === "faq" ? "bg-gray-700 text-white" : "hover:bg-gray-700"
          }`}
        >
          <MessageSquare size={18} />
          <span className="text-sm">FAQ Section</span>
        </div>

        <div
          onClick={() => {
            setView("help");
            setActiveConversationId(null);
            setMessages([]);
          }}
          className={`flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer transition ${
            view === "help" ? "bg-gray-700 text-white" : "hover:bg-gray-700"
          }`}
        >
          <HelpCircle size={18} />
          <span className="text-sm">Help & Support</span>
        </div>
      </nav>

      <div className="flex-1 overflow-y-auto thin-scrollbar">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-3">
          Recent Chats
        </p>

        {isSidebarLoading ? (
          <SidebarSkeleton />
        ) : conversations.length === 0 ? (
          <p className="text-xs text-gray-600 px-2">No conversations yet.</p>
        ) : (
          <div className="space-y-1">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => handleSelectConversation(conv.id)}
                onMouseEnter={() => setHoveredConvId(conv.id)}
                onMouseLeave={() => setHoveredConvId(null)}
                className={`w-full flex justify-between items-center p-3 rounded-lg transition ${
                  conv.id === activeConversationId
                    ? "bg-gray-700 text-white"
                    : "hover:bg-gray-700"
                }`}
              >
                <div className="min-w-0 text-left">
                  <p className="text-sm font-medium truncate">{conv.title}</p>
                  <p className="text-[10px] text-gray-500">
                    {formatTime(conv.updated_at)}
                  </p>
                </div>

                {hoveredConvId === conv.id && (
                  <button
                    onClick={(e) => handleDeleteConversation(e, conv.id)}
                    className="p-1 rounded hover:bg-red-600/30 text-gray-500 hover:text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white w-full py-3 rounded-lg font-medium mt-4"
      >
        <LogOut size={18} /> Logout
      </button>
    </>
  )}
</aside>
      {/* ── MAIN CHAT AREA ────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0">

       {showUnauthorized && (
      <div className="bg-red-500/10 border-b border-red-500/30 text-red-400 px-6 py-3 text-sm text-center">
        You have no access to the admin page. Please{" "}
      <span
        onClick={() => {
        cookies.remove("authToken", { path: "/" }); // ✅ IMPORTANT
        navigate("/login");
      }}
        className="font-semibold text-blue-400 cursor-pointer hover:text-blue-300"
    >
      Login
    </span>{" "}
      as Admin.
    </div>
)}

        {/* Header */}
        <header className="h-16 bg-gray-800 flex items-center px-8 border-b border-gray-700 justify-between shrink-0">
          <h2 className="text-xl font-semibold text-white">Student Helpdesk Chatbot</h2>
          <span className="text-sm text-gray-400">
            {view === "faq"
              ? "FAQ Section"
              : view === "help"
              ? "Help & Support"
              : activeConversationId
              ? conversations.find((c) => c.id === activeConversationId)?.title || "Chat"
              : "Welcome"}
          </span>
        </header>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
         {view === "faq" ? (
            <FAQScreen onSuggest={(s) => { setInputValue(s); handleSend(s); }} />
         ) : view === "help" ? (
            <HelpScreen />
            ) : messages.length === 0 ? (
            <WelcomeScreen />
          ) : (
            <>
              {messages.map((msg, i) =>
                msg.role === "user" ? (
                  <UserBubble key={i} text={msg.text} time={formatTime(msg.created_at)} />
                ) : (
                  <BotBubble key={i} text={msg.text} time={formatTime(msg.created_at)} />
                )
              )}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input area */}
        {view === "chat" && (
        <div className="p-4 border-t border-gray-700 shrink-0">
          <div className="max-w-4xl mx-auto relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder={isLoading ? "Waiting for response..." : "Ask your queries..."}
              className="w-full bg-gray-700 border border-gray-600 py-4 px-6 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400 pr-16 disabled:opacity-60"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !inputValue.trim()}
              className="absolute right-2 p-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
