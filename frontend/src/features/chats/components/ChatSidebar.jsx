import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import { MessageCircle } from "lucide-react";

const ChatSidebar = () => {
  const { handleGetChatUsers, handleSetCurrentChatId } = useChat();
  const { chats, currentChatId } = useSelector((state) => state.chat);

  useEffect(() => {
    handleGetChatUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const users = Object.values(chats || {});

  return (
    <motion.aside
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="hidden md:flex flex-col fixed right-0 top-0 h-screen bg-neutral-950/40 backdrop-blur-3xl border-l border-neutral-800/80 z-40 w-80 lg:w-[380px] pt-8 pb-6 px-6"
    >
      <div className="mb-10 px-1 flex items-center justify-between">
        <h1 className="text-2xl text-white tracking-wide">
          All Users
        </h1>
        <MessageCircle className="w-6 h-6 text-neutral-400" />
      </div>

      <div className="flex flex-col gap-3 w-full flex-1 overflow-y-auto custom-scrollbar pr-2">
        {users.length === 0 ? (
          <p className="text-neutral-500 text-base text-center mt-6">
            No Users found.
          </p>
        ) : (
          users.map((user) => {
            const isActive = currentChatId === user._id;

            return (
              <div
                key={user._id}
                onClick={() => handleSetCurrentChatId(user._id)}
                className={`relative flex items-center gap-4 px-4 py-4 rounded-2xl cursor-pointer transition-all duration-300 outline-none
                  ${
                    isActive
                      ? "bg-purple-500/20 shadow-inner border border-purple-500/30"
                      : "hover:bg-white/5 border border-transparent"
                  }`}
              >
                <div className="w-14 h-14 rounded-full bg-neutral-800 border-2 border-neutral-700 transition-colors shrink-0 overflow-hidden relative">
                  <img
                    src={
                      user.profilePicture ||
                      `https://api.dicebear.com/9.x/bottts/svg?seed=${user.username}`
                    }
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex flex-col leading-tight truncate flex-1 justify-center">
                  <span
                    className={`text-[17px] transition-all duration-300 truncate ${
                      isActive
                        ? "text-white font-medium"
                        : "text-neutral-200 font"
                    }`}
                  >
                    {user.username}
                  </span>
                  <span className="text-[14px] mt-1 text-neutral-400 truncate">
                    Tap to chat
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </motion.aside>
  );
};

export default ChatSidebar;
