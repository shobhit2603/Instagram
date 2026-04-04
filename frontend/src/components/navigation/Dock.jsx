import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Search,
  SquarePlus,
  MessageCircle,
  User,
  LogOut,
  LogIn,
} from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "motion/react";
import { useSelector } from "react-redux";
import { useAuth } from "../../features/auth/hooks/useAuth";

const Dock = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { user } = useSelector((state) => state.auth);
  const { handleLogout } = useAuth();

  const navItems = [
    { icon: Home, path: "/", label: "Home" },
    { icon: Search, path: "/search", label: "Search" },
    { icon: SquarePlus, path: "/create", label: "Create" },
    { icon: MessageCircle, path: "/messages", label: "Messages" },
    { icon: User, path: "/profile", label: "Profile" },
  ];

  const onLogout = async () => {
    try {
      await handleLogout();
      // On success, redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Shared framer-motion variants for the active indicator
  const activeDotVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 500, damping: 30 },
    },
    exit: { scale: 0, opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <>
      {/* ===== MOBILE DOCK (Visible only on screens smaller than md) ===== */}
      <motion.nav
        initial={{ y: 100, opacity: 0, x: "-50%" }}
        animate={{ y: 0, opacity: 1, x: "-50%" }}
        transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.1 }}
        className="md:hidden fixed bottom-5 left-1/2 z-50 w-[90%] max-w-[400px]"
      >
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-900/80 backdrop-blur-2xl border border-neutral-800 shadow-[0_8px_32px_rgba(0,0,0,0.8)] rounded-full">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`relative group p-2 transition-colors duration-300 outline-none
                  ${isActive ? "text-white" : "text-neutral-500 hover:text-neutral-300"}`}
                aria-label={item.label}
              >
                <motion.div
                  whileTap={{ scale: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                </motion.div>
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      variants={activeDotVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,1)]"
                    />
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </div>
      </motion.nav>

      {/* ===== DESKTOP SIDEBAR (Visible only on md screens and larger) ===== */}
      <motion.nav
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden md:flex flex-col fixed left-0 top-0 h-screen bg-neutral-950/40 backdrop-blur-3xl border-r border-neutral-800/80 z-50 w-20 xl:w-64 pt-8 pb-6 px-4"
      >
        {/* Branding */}
        <div className="mb-12 px-2 flex items-center justify-center xl:justify-start">
          <Link
            to="/"
            className="text-white hover:opacity-80 transition-opacity flex items-center gap-3"
          >
            <p
              className="hidden xl:block text-2xl tracking-tighter"
              style={{ fontFamily: "var(--font-instagram, sans-serif)" }}
            >
              Event<span className="text-purple-500">Loop</span>
            </p>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col gap-2 w-full flex-1">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                to={item.path}
                className={`relative flex items-center gap-4 px-3 py-3.5 rounded-2xl transition-all duration-300 outline-none
                  ${isActive ? "text-white shadow-inner" : "text-neutral-400 hover:text-white"}`}
              >
                {/* Active Indicator Line utilizing layoutId for smooth transition between tabs */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-indicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-2/3 bg-linear-to-b from-indigo-400 to-pink-400 shadow-[2px_0_12px_rgba(236,72,153,0.8)]"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </AnimatePresence>

                <motion.div
                  whileHover={{ scale: 1.1, rotate: isActive ? 0 : 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon
                    className="w-6 h-6 shrink-0"
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </motion.div>

                <span
                  className={`hidden xl:block font-medium text-[15px] transition-all duration-300 ${isActive ? "font-semibold tracking-wide" : ""}`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Auth Box at bottom */}
        <div className="mt-auto pt-4 border-t border-neutral-800/80 flex flex-col gap-2">
          {user ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogout}
              className="flex items-center gap-4 px-3 py-3 rounded-2xl w-full text-left transition-colors hover:bg-red-500/10 text-neutral-400 hover:text-red-400 cursor-pointer"
            >
              <LogOut className="w-6 h-6 shrink-0" strokeWidth={2} />
              <span className="hidden xl:block font-medium text-[15px]">
                Log Out
              </span>
            </motion.button>
          ) : (
            <Link to="/login">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-4 px-3 py-3 rounded-2xl w-full text-left transition-all hover:bg-white/10 text-neutral-400 hover:text-white"
              >
                <LogIn className="w-6 h-6 shrink-0" strokeWidth={2} />
                <span className="hidden xl:block font-medium text-[15px]">
                  Log In
                </span>
              </motion.div>
            </Link>
          )}

          {/* User Profile Mini (Visible when Logged in) */}
          {user && (
            <Link
              to="/profile"
              className="flex items-center gap-4 px-3 py-3 rounded-2xl transition-all duration-300 hover:bg-neutral-900/80 text-neutral-400 hover:text-white overflow-hidden mt-1"
            >
              <div className="w-8 h-8 rounded-full bg-neutral-800 border-2 border-neutral-700 transition-colors shrink-0 overflow-hidden">
                <img
                  src={
                    user.profileImage ||
                    "https://i.pinimg.com/736x/83/bc/8b/83bc8b88cf6bc4b4e04d153a418cde62.jpg"
                  }
                  alt={user.username}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden xl:flex flex-col leading-tight truncate">
                <span className="font-semibold text-white/95 text-sm truncate">
                  {user.username}
                </span>
                <span className="text-[11px] text-neutral-500 truncate uppercase tracking-widest">
                  {user.fullName}
                </span>
              </div>
            </Link>
          )}
        </div>
      </motion.nav>
    </>
  );
};

export default Dock;
