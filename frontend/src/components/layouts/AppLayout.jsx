import Navbar from "../navigation/Navbar";
import Sidebar from "../navigation/Sidebar";
import Footer from "../navigation/Footer";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="app-layout">
      <Navbar />

      <div className="main-layout">
        <Sidebar />

        <main className="content">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AppLayout;
