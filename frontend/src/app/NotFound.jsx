import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "motion/react";
import { Home, ArrowLeft, Ghost } from "lucide-react";

/* ──── deterministic seed from index (avoids Math.random in render) ──── */
function seeded(index, offset = 0) {
  const n = ((index + 1) * 9301 + offset * 49297) % 233280;
  return n / 233280;
}

/* ──────────────────── floating particle ──────────────────── */
function Particle({ index }) {
  const size = seeded(index, 0) * 6 + 2;
  const x = seeded(index, 1) * 100;
  const duration = seeded(index, 2) * 8 + 6;
  const delay = seeded(index, 3) * 4;
  const drift = (seeded(index, 4) - 0.5) * 120;

  return (
    <motion.div
      className="absolute rounded-full bg-purple-500/20 pointer-events-none"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        bottom: -10,
      }}
      animate={{
        y: [0, -900],
        opacity: [0, 0.8, 0],
        x: [0, drift],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeOut",
      }}
    />
  );
}

/* ──────────────────── glitch text ──────────────────── */
function GlitchText() {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative select-none">
      <motion.h1
        className="text-[10rem] md:text-[14rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-white via-neutral-300 to-neutral-600"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
      >
        404
      </motion.h1>

      {/* Glitch layers */}
      <AnimatePresence>
        {glitch && (
          <>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7, x: [-3, 3, -2, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 text-[10rem] md:text-[14rem] font-black leading-none tracking-tighter text-purple-500/60 pointer-events-none"
              style={{ clipPath: "inset(20% 0 40% 0)" }}
            >
              404
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5, x: [3, -3, 2, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 text-[10rem] md:text-[14rem] font-black leading-none tracking-tighter text-cyan-400/40 pointer-events-none"
              style={{ clipPath: "inset(50% 0 10% 0)" }}
            >
              404
            </motion.h1>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ──────────────────── interactive ghost ──────────────────── */
function InteractiveGhost() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scared, setScared] = useState(false);

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 30;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 30;
    setMousePos({ x, y });
  }, []);

  return (
    <motion.div
      className="relative cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setScared(false)}
      onClick={() => {
        setScared(true);
        setTimeout(() => setScared(false), 1000);
      }}
      animate={{
        x: scared ? [0, -10, 10, -6, 6, 0] : mousePos.x * 0.5,
        y: scared ? [0, -20, 0] : mousePos.y * 0.5,
        rotate: scared ? [0, -15, 15, -8, 8, 0] : mousePos.x * 0.3,
      }}
      transition={
        scared
          ? { duration: 0.5, ease: "easeOut" }
          : { type: "spring", stiffness: 150, damping: 15 }
      }
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        className="w-28 h-28 md:w-36 md:h-36 rounded-3xl bg-linear-to-br from-purple-500/20 to-purple-900/10 border border-purple-500/20 backdrop-blur-sm flex items-center justify-center"
        animate={{
          boxShadow: scared
            ? "0 0 40px rgba(168,85,247,0.4)"
            : "0 0 20px rgba(168,85,247,0.1)",
        }}
      >
        <motion.div
          animate={{
            scale: scared ? [1, 1.3, 0.8, 1.1, 1] : 1,
            rotate: scared ? [0, 20, -20, 10, 0] : 0,
          }}
          transition={{ duration: 0.5 }}
        >
          <Ghost
            className={`w-14 h-14 md:w-18 md:h-18 transition-colors duration-300 ${
              scared ? "text-purple-300" : "text-purple-500/70"
            }`}
            strokeWidth={1.5}
          />
        </motion.div>
      </motion.div>

      {/* Tooltip */}
      <AnimatePresence>
        {scared && (
          <motion.span
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -10, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm text-purple-300 whitespace-nowrap font-medium"
          >
            Boo! 👻
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ──────────────────── 404 page ──────────────────── */
const NotFound = () => {
  const particles = Array.from({ length: 25 }, (_, i) => i);

  return (
    <div className="fixed inset-0 bg-neutral-950 overflow-hidden flex items-center justify-center z-100">
      {/* Ambient gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-purple-900/5 rounded-full blur-3xl" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((i) => (
          <Particle key={i} index={i} />
        ))}
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundSize: "60px 60px",
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
        <InteractiveGhost />

        <GlitchText />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col items-center gap-2 max-w-md"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
            Page not found
          </h2>
          <p className="text-neutral-400 text-base md:text-lg leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            <br />
            <span className="text-neutral-500 text-sm">
              Try clicking the ghost — it&apos;s friendly!
            </span>
          </p>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-4"
        >
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2.5 px-7 py-3.5 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-medium text-[15px] transition-colors shadow-lg shadow-purple-500/20"
            >
              <Home className="w-4.5 h-4.5" />
              Go Home
            </motion.div>
          </Link>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
            className="flex items-center gap-2.5 px-7 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 rounded-2xl font-medium text-[15px] border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
            Go Back
          </motion.button>
        </motion.div>

        {/* Animated path breadcrumb */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-neutral-600 text-xs mt-4 font-mono"
        >
          <span className="text-neutral-700">~</span>
          {window.location.pathname}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="text-purple-500 ml-0.5"
          >
            |
          </motion.span>
        </motion.p>
      </div>
    </div>
  );
};

export default NotFound;
