import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "motion/react";
import { Send, ArrowLeft } from "lucide-react";

const ChatWindow = ({ socketRef, onBack }) => {
  const { handleGetMessages } = useChat();
  const currentChatId = useSelector((state) => state.chats.currentChatId);
  const chatUser = useSelector((state) =>
    currentChatId ? state.chats.chats[currentChatId] : null
  );
  const loggedInUser = useSelector((state) => state.auth.user);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load message history when chat user changes
  useEffect(() => {
    if (currentChatId) {
      handleGetMessages(currentChatId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChatId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatUser?.messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (currentChatId) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [currentChatId]);

  function handleSend() {
    const trimmed = message.trim();
    if (!trimmed || !socketRef.current || !currentChatId) return;

    socketRef.current.emit("send_message", {
      message: trimmed,
      receiver: currentChatId,
    });

    setMessage("");
    inputRef.current?.focus();
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  if (!chatUser) return null;

  const messages = chatUser.messages || [];

  // Format timestamp
  function formatTime(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="flex flex-col h-full w-full"
    >
      {/* ── Chat Header ── */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-neutral-800/60 bg-neutral-950/60 backdrop-blur-xl shrink-0">
        {/* Back button (mobile) */}
        <button
          onClick={onBack}
          className="md:hidden p-2 -ml-2 rounded-xl hover:bg-white/5 text-neutral-400 hover:text-white transition-colors"
          aria-label="Back to users"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="w-11 h-11 rounded-full bg-neutral-800 border-2 border-neutral-700 overflow-hidden shrink-0">
          <img
            src={
              chatUser.profilePicture ||
              `https://api.dicebear.com/9.x/bottts/svg?seed=${chatUser.username}`
            }
            alt={chatUser.username}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-white font-medium text-[16px]">
            {chatUser.username}
          </span>
          <span className="text-neutral-500 text-[14px]">Direct message</span>
        </div>
      </div>

      {/* ── Messages Area ── */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-3 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 select-none">
            <div className="w-16 h-16 rounded-full bg-neutral-800/60 border border-neutral-700/50 flex items-center justify-center">
              <img
                src={
                  chatUser.profilePicture ||
                  `https://api.dicebear.com/9.x/bottts/svg?seed=${chatUser.username}`
                }
                alt={chatUser.username}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <p className="text-neutral-500 text-sm">
              Say hi to <span className="text-neutral-300">{chatUser.username}</span>
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg, index) => {
              const isSender =
                msg.sender === loggedInUser?.id ||
                msg.sender === loggedInUser?._id;

              return (
                <motion.div
                  key={msg._id || index}
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                  className={`flex ${isSender ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] md:max-w-[60%] px-4 py-2.5 rounded-2xl ${
                      isSender
                        ? "bg-purple-600/90 text-white rounded-br-md"
                        : "bg-neutral-800/80 text-neutral-100 rounded-bl-md"
                    }`}
                  >
                    <p className="text-[15px] leading-relaxed wrap-break-word whitespace-pre-wrap">
                      {msg.content}
                    </p>
                    <p
                      className={`text-[10px] mt-1.5 ${
                        isSender
                          ? "text-purple-200/60"
                          : "text-neutral-500"
                      } text-right`}
                    >
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Message Input ── */}
      <div className="shrink-0 px-5 pb-5 pt-3">
        <div className="flex items-center gap-3 bg-neutral-900/80 border border-neutral-800/60 rounded-2xl px-4 py-2 backdrop-blur-xl transition-all focus-within:border-purple-500/40 focus-within:bg-neutral-900">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message..."
            className="flex-1 bg-transparent text-white text-[15px] placeholder-neutral-500 outline-none py-2"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            disabled={!message.trim()}
            className={`p-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
              message.trim()
                ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20 hover:bg-purple-500"
                : "bg-neutral-800 text-neutral-500"
            }`}
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatWindow;
