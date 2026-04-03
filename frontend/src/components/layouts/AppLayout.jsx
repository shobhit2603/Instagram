import { Outlet } from "react-router-dom";
import Dock from "../Dock";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-purple-500/30 pb-20 md:pb-0 md:pl-20 xl:pl-64">
      <div className="w-full h-full flex justify-center">
        <Outlet />
      </div>

      <Dock />
    </div>
  );
};

export default AppLayout;
