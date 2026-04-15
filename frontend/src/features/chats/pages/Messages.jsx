import ChatSidebar from "../components/ChatSidebar";

const Messages = () => {
  return (
    <div className="flex h-screen w-full relative bg-neutral-950 overflow-hidden">
      {/* Main chat window container. Leaves space on the right for the sidebar on md+ screens */}
      <main className="flex-1 mr-0 md:mr-80 lg:mr-95 h-full flex flex-col items-center justify-center">
        <p className="text-neutral-500 text-lg font-medium">
          Select a user to start chatting
        </p>
      </main>
      
      <ChatSidebar />
    </div>
  );
};

export default Messages;
