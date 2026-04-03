import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Play,
} from "lucide-react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "motion/react";

const PostCard = ({ post }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const videoRefs = useRef({});
  const [mutedVideos, setMutedVideos] = useState({});
  const [playingVideos, setPlayingVideos] = useState({});
  const observerRef = useRef(null);
  const mediaContainerRef = useRef(null);

  const mediaCount = post.media?.length || 0;
  const authorName = post.author?.username || post.author || "User";
  const profileImg =
    post.author?.profileImage ||
    "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg";

  // ── Format time ──
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const secs = Math.floor(diff / 1000);
    const mins = Math.floor(secs / 60);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    if (secs < 60) return "just now";
    if (mins < 60) return `${mins}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return `${weeks}w`;
  };

  // ── Media Navigation ──
  const goTo = useCallback(
    (idx) => {
      if (idx < 0 || idx >= mediaCount) return;

      // Pause old video
      const oldMedia = post.media?.[currentIndex];
      if (oldMedia?.type === "video" && videoRefs.current[currentIndex]) {
        videoRefs.current[currentIndex].pause();
        setPlayingVideos((prev) => ({ ...prev, [currentIndex]: false }));
      }

      setCurrentIndex(idx);

      // Autoplay new video if it's a video
      const newMedia = post.media?.[idx];
      if (newMedia?.type === "video") {
        setTimeout(() => {
          const vid = videoRefs.current[idx];
          if (vid) {
            vid.currentTime = 0;
            vid.play().catch(() => {});
            setPlayingVideos((prev) => ({ ...prev, [idx]: true }));
          }
        }, 100);
      }
    },
    [currentIndex, mediaCount, post.media],
  );

  const goLeft = (e) => {
    e.stopPropagation();
    goTo(currentIndex - 1);
  };
  const goRight = (e) => {
    e.stopPropagation();
    goTo(currentIndex + 1);
  };

  // ── Video controls ──
  const toggleMute = (idx, e) => {
    e.stopPropagation();
    const vid = videoRefs.current[idx];
    if (vid) {
      vid.muted = !vid.muted;
      setMutedVideos((prev) => ({ ...prev, [idx]: vid.muted }));
    }
  };

  const togglePlayPause = (idx) => {
    const vid = videoRefs.current[idx];
    if (!vid) return;
    if (vid.paused) {
      vid.play().catch(() => {});
      setPlayingVideos((prev) => ({ ...prev, [idx]: true }));
    } else {
      vid.pause();
      setPlayingVideos((prev) => ({ ...prev, [idx]: false }));
    }
  };

  // ── Intersection Observer: autoplay/pause videos as they enter/leave viewport ──
  useEffect(() => {
    const container = mediaContainerRef.current;
    if (!container) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        const currentMedia = post.media?.[currentIndex];
        const vid = videoRefs.current[currentIndex];
        if (currentMedia?.type !== "video" || !vid) return;

        if (entry.isIntersecting) {
          vid.play().catch(() => {});
          setPlayingVideos((prev) => ({ ...prev, [currentIndex]: true }));
        } else {
          vid.pause();
          setPlayingVideos((prev) => ({ ...prev, [currentIndex]: false }));
        }
      },
      { threshold: 0.5 },
    );

    observerRef.current.observe(container);

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [currentIndex, post.media]);

  // ── Double-tap to like ──
  const lastTap = useRef(0);
  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      setIsLiked(true);
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 900);
    }
    lastTap.current = now;
  };

  return (
    <article className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl overflow-hidden mb-6 shadow-xs group/card transition-all hover:bg-neutral-900/60 hover:border-neutral-700/80">
      {/* ═══ Header ═══ */}
      <div className="flex items-center justify-between p-4">
        <Link
          to={`/profile/${post.author?._id || post.author}`}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-full bg-linear-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[2px] shadow-[0_0_12px_rgba(168,85,247,0.3)] transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-neutral-950 rounded-full overflow-hidden border border-neutral-950">
              <img
                src={profileImg}
                alt={`${authorName}'s avatar`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-white/95 text-sm tracking-wide">
              {authorName}
            </h3>
            {post.location && (
              <p className="text-xs text-neutral-500 mt-0.5">
                {post.location}
              </p>
            )}
          </div>
        </Link>
        <button className="text-neutral-500 hover:text-white transition-colors p-2 rounded-full hover:bg-neutral-800 cursor-pointer">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* ═══ Media Viewer ═══ */}
      <div
        ref={mediaContainerRef}
        className="relative bg-black aspect-4/5 sm:aspect-square overflow-hidden border-y border-neutral-800/50 sm:border-none select-none"
        onClick={handleDoubleTap}
      >
        {/* Media slides */}
        <div
          className="w-full h-full flex transition-transform duration-400 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {post.media?.map((m, idx) => (
            <div
              key={idx}
              className="min-w-full h-full flex items-center justify-center relative"
            >
              {m.type === "video" ? (
                <>
                  <video
                    ref={(el) => {
                      videoRefs.current[idx] = el;
                    }}
                    src={m.url}
                    loop
                    muted={mutedVideos[idx] !== false}
                    playsInline
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlayPause(idx);
                    }}
                    onPlay={() =>
                      setPlayingVideos((prev) => ({ ...prev, [idx]: true }))
                    }
                    onPause={() =>
                      setPlayingVideos((prev) => ({ ...prev, [idx]: false }))
                    }
                  />
                  {/* Play overlay when paused */}
                  <AnimatePresence>
                    {!playingVideos[idx] && idx === currentIndex && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      >
                        <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                          <Play
                            className="w-7 h-7 text-white ml-1"
                            fill="white"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {/* Mute/Unmute button */}
                  {idx === currentIndex && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileTap={{ scale: 0.85 }}
                      onClick={(e) => toggleMute(idx, e)}
                      className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-neutral-900/70 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white transition-colors z-10 cursor-pointer"
                    >
                      {mutedVideos[idx] === false ? (
                        <Volume2 className="w-3.5 h-3.5" />
                      ) : (
                        <VolumeX className="w-3.5 h-3.5" />
                      )}
                    </motion.button>
                  )}
                </>
              ) : (
                <img
                  src={m.url}
                  alt={`post content ${idx + 1}`}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              )}
            </div>
          ))}
        </div>

        {/* ── Double-tap heart animation ── */}
        <AnimatePresence>
          {showHeart && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.4, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
            >
              <Heart
                className="w-24 h-24 text-white drop-shadow-xl"
                fill="white"
                strokeWidth={0}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Left / Right navigation buttons ── */}
        {mediaCount > 1 && (
          <>
            <AnimatePresence>
              {currentIndex > 0 && (
                <motion.button
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={goLeft}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-neutral-900/70 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white hover:bg-neutral-800/80 transition-colors z-10 cursor-pointer shadow-md"
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.button>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {currentIndex < mediaCount - 1 && (
                <motion.button
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={goRight}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-neutral-900/70 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white hover:bg-neutral-800/80 transition-colors z-10 cursor-pointer shadow-md"
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* ── Dot indicators ── */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
              {post.media.map((_, idx) => (
                <motion.button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    goTo(idx);
                  }}
                  animate={{
                    scale: idx === currentIndex ? 1 : 0.75,
                    opacity: idx === currentIndex ? 1 : 0.4,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={`rounded-full transition-colors cursor-pointer ${
                    idx === currentIndex
                      ? "w-2 h-2 bg-white shadow-[0_0_6px_rgba(255,255,255,0.6)]"
                      : "w-1.5 h-1.5 bg-white/70"
                  }`}
                />
              ))}
            </div>

            {/* ── Counter badge ── */}
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-medium tracking-wider z-10 text-white/90">
              {currentIndex + 1}/{mediaCount}
            </div>
          </>
        )}
      </div>

      {/* ═══ Actions ═══ */}
      <div className="p-4 pb-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <motion.button
              whileTap={{ scale: 0.75 }}
              onClick={() => setIsLiked(!isLiked)}
              className="cursor-pointer group"
            >
              <Heart
                className={`w-6 h-6 transition-colors duration-300 ${
                  isLiked
                    ? "text-pink-500 fill-pink-500"
                    : "text-neutral-400 group-hover:text-pink-500"
                }`}
              />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.75 }}
              className="text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-6 h-6" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.75 }}
              className="text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
            >
              <Send className="w-6 h-6" />
            </motion.button>
          </div>
          <motion.button
            whileTap={{ scale: 0.75 }}
            onClick={() => setIsSaved(!isSaved)}
            className="cursor-pointer"
          >
            <Bookmark
              className={`w-6 h-6 transition-colors duration-300 ${
                isSaved
                  ? "text-white fill-white"
                  : "text-neutral-400 hover:text-white"
              }`}
            />
          </motion.button>
        </div>

        {/* Stats */}
        <div className="mb-2.5">
          <p className="text-[13px] font-semibold text-white/95 tracking-wide">
            {post.likesCount + (isLiked ? 1 : 0)}{" "}
            {post.likesCount + (isLiked ? 1 : 0) === 1 ? "like" : "likes"}
          </p>
        </div>

        {/* Caption */}
        {post.caption && (
          <CaptionText authorName={authorName} caption={post.caption} />
        )}

        {/* Comments Count */}
        {post.commentsCount > 0 && (
          <button className="text-neutral-500 text-[13px] mb-2 hover:text-neutral-300 transition-colors cursor-pointer font-medium">
            View all {post.commentsCount} comments
          </button>
        )}

        {/* Timestamp */}
        <p className="text-neutral-600 text-[10px] uppercase font-bold tracking-wider">
          {formatTime(post.createdAt)}
        </p>
      </div>
    </article>
  );
};

/* ── Expandable caption sub-component ── */
const CaptionText = ({ authorName, caption }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = caption.length > 100;

  return (
    <div className="text-[13px] leading-relaxed mb-3">
      <span className="font-semibold text-white/95 mr-2 tracking-wide">
        {authorName}
      </span>
      <span className="text-neutral-300">
        {isLong && !expanded ? caption.slice(0, 100) + "..." : caption}
      </span>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-neutral-500 hover:text-neutral-300 transition-colors ml-1 cursor-pointer font-medium"
        >
          {expanded ? "less" : "more"}
        </button>
      )}
    </div>
  );
};

export default PostCard;
