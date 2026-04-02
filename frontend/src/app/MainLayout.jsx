import { Outlet } from "react-router-dom";
import Dock from "../components/Dock";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-purple-500/30 pb-20 md:pb-0 md:pl-20 xl:pl-64 relative overflow-hidden">
      {/* Ambient background glows for 'crazy' aesthetic */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-500/10 blur-[120px] pointer-events-none z-0" />
      
      <div className="relative z-10 w-full h-full flex justify-center">
        <Outlet />
      </div>
      
      <Dock />
    </div>
  );
};

export default MainLayout;
