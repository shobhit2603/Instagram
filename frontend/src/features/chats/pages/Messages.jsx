import { useEffect, useRef, useCallback } from "react";
import { useChat } from "../hooks/useChat";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import { MessageCircle } from "lucide-react";

const Messages = () => {
  const { handleGetChatUsers, handleAppendMessage, handleSetCurrentChatId } =
    useChat();
  const loggedInUser = useSelector((state) => state.auth.user);
  const currentChatId = useSelector((state) => state.chats.currentChatId);
  const socketRef = useRef(null);

  // Socket connection
  useEffect(() => {
    if (!loggedInUser) return;

    const socket = io("/", {
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.once("connect", () => {
      console.log("Connected to socket:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    // When the sender gets acknowledgment that message was saved
    socket.on("message_sent", (data) => {
      handleAppendMessage({
        chatId: data.receiver,
        message: {
          _id: data._id,
          content: data.content,
          sender: data.sender,
          receiver: data.receiver,
          createdAt: data.createdAt,
        },
      });
    });

    // When receiving a message from another user
    socket.on("receive_message", (data) => {
      handleAppendMessage({
        chatId: data.sender,
        message: {
          _id: data._id,
          content: data.content,
          sender: data.sender,
          receiver: data.receiver,
          createdAt: data.createdAt,
        },
      });
    });

    handleGetChatUsers();

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedInUser]);

  // Mobile: go back to sidebar
  const handleBack = useCallback(() => {
    handleSetCurrentChatId(null);
  }, [handleSetCurrentChatId]);

  return (
    <div className="flex h-screen w-full relative bg-neutral-950 overflow-hidden">
      {/* Main chat area — leaves room for the sidebar on desktop */}
      <main
        className={`flex-1 mr-0 md:mr-80 lg:mr-95 h-full flex flex-col ${
          currentChatId ? "hidden md:flex" : "flex"
        }`}
      >
        {currentChatId ? (
          <ChatWindow socketRef={socketRef} onBack={handleBack} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 select-none">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="w-20 h-20 rounded-full bg-neutral-900/80 border border-neutral-800 flex items-center justify-center"
            >
              <MessageCircle className="w-9 h-9 text-neutral-600" />
            </motion.div>
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-center"
            >
              <p className="text-neutral-400 text-lg font-medium">
                Your messages
              </p>
              <p className="text-neutral-600 text-sm mt-1">
                Select a conversation to start chatting
              </p>
            </motion.div>
          </div>
        )}
      </main>

      {/* Mobile: show chat window full-screen when a user is selected */}
      {currentChatId && (
        <div className="md:hidden fixed inset-0 z-50 bg-neutral-950 flex flex-col">
          <ChatWindow socketRef={socketRef} onBack={handleBack} />
        </div>
      )}

      <ChatSidebar />
    </div>
  );
};

export default Messages;
