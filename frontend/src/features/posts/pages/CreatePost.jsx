import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "motion/react";
import {
  ImagePlus,
  X,
  Film,
  Image as ImageIcon,
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  GripVertical,
  Plus,
} from "lucide-react";
import { usePost } from "../hooks/usePost";

const MAX_FILES = 7;
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { handleCreatePost } = usePost();

  const [files, setFiles] = useState([]);
  const [caption, setCaption] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState(null); // 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState("");
  const [activePreview, setActivePreview] = useState(0);

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // ── File validation & processing ──
  const processFiles = useCallback(
    (incoming) => {
      const newFiles = [];
      for (const file of incoming) {
        if (files.length + newFiles.length >= MAX_FILES) break;
        if (!ACCEPTED_TYPES.includes(file.type)) continue;
        if (file.size > MAX_FILE_SIZE) continue;

        const preview = URL.createObjectURL(file);
        const type = file.type.startsWith("video") ? "video" : "image";
        newFiles.push({ file, preview, type, id: crypto.randomUUID() });
      }
      if (newFiles.length > 0) {
        setFiles((prev) => [...prev, ...newFiles]);
        setActivePreview(files.length); // jump to first new file
      }
    },
    [files],
  );

  // ── Drag & Drop ──
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files?.length) processFiles([...e.dataTransfer.files]);
    },
    [processFiles],
  );

  const handleFileInput = (e) => {
    if (e.target.files?.length) processFiles([...e.target.files]);
    e.target.value = "";
  };

  const removeFile = (id) => {
    setFiles((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      if (activePreview >= updated.length)
        setActivePreview(Math.max(0, updated.length - 1));
      return updated;
    });
  };

  // ── Auto-resize textarea ──
  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = ta.scrollHeight + "px";
    }
  };

  // ── Submit ──
  const handleSubmit = async () => {
    if (files.length === 0) return;
    setUploading(true);
    setUploadProgress(0);
    setStatus(null);
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("caption", caption);
      files.forEach((f) => formData.append("media", f.file));

      await handleCreatePost(formData, (progressEvent) => {
        const pct = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
        setUploadProgress(pct);
      });

      setStatus("success");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err.response?.data?.error || err.message || "Something went wrong",
      );
      setUploading(false);
    }
  };

  const canSubmit = files.length > 0 && !uploading;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 md:py-10">
      {/* ─── Header ─── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Create Post
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Share something with the world
            </p>
          </div>
        </div>

        {/* User badge */}
        {user && (
          <div className="flex items-center gap-2.5 bg-neutral-900/60 border border-neutral-800 rounded-full px-3 py-1.5">
            <div className="w-6 h-6 rounded-full overflow-hidden bg-neutral-800 ring-1 ring-neutral-700">
              <img
                src={
                  user.profileImage ||
                  "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
                }
                alt={user.username}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs font-medium text-neutral-300">
              {user.username}
            </span>
          </div>
        )}
      </motion.div>

      {/* ─── Main Card ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-neutral-900/50 border border-neutral-800/80 rounded-3xl overflow-hidden backdrop-blur-sm"
      >
        {/* ═══ MEDIA SECTION ═══ */}
        <div className="p-5 pb-0">
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold text-neutral-300 tracking-wide">
              Media
            </span>
            <span className="text-xs text-neutral-600 ml-auto">
              {files.length}/{MAX_FILES}
            </span>
          </div>

          <AnimatePresence mode="wait">
            {files.length === 0 ? (
              /* ── Upload Zone (empty state) ── */
              <motion.div
                key="dropzone"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative cursor-pointer group rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden
                  ${
                    dragActive
                      ? "border-purple-500 bg-purple-500/10 scale-[1.01]"
                      : "border-neutral-700/60 hover:border-neutral-600 bg-neutral-900/40 hover:bg-neutral-800/30"
                  }`}
              >
                <div className="flex flex-col items-center justify-center py-16 md:py-20 px-6">
                  {/* Animated icon */}
                  <motion.div
                    animate={{
                      y: dragActive ? -8 : 0,
                      scale: dragActive ? 1.15 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-colors duration-300
                      ${
                        dragActive
                          ? "bg-purple-500/20 text-purple-400"
                          : "bg-neutral-800/80 text-neutral-500 group-hover:bg-neutral-700/80 group-hover:text-neutral-400"
                      }`}
                  >
                    <ImagePlus className="w-8 h-8" strokeWidth={1.5} />
                  </motion.div>

                  <p className="text-neutral-300 font-semibold text-sm mb-1">
                    {dragActive
                      ? "Drop your files here"
                      : "Drag & drop or click to upload"}
                  </p>
                  <p className="text-neutral-600 text-xs text-center max-w-xs">
                    Images (JPG, PNG, WebP, GIF) and Videos (MP4, WebM) up to
                    15MB
                  </p>

                  {/* File type badges */}
                  <div className="flex items-center gap-2 mt-5">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800/60 rounded-full text-xs text-neutral-400 border border-neutral-700/50">
                      <ImageIcon className="w-3.5 h-3.5" /> Images
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800/60 rounded-full text-xs text-neutral-400 border border-neutral-700/50">
                      <Film className="w-3.5 h-3.5" /> Videos
                    </span>
                  </div>
                </div>

                {/* Animated border glow on drag */}
                {dragActive && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                      boxShadow: "inset 0 0 40px rgba(168, 85, 247, 0.15)",
                    }}
                  />
                )}
              </motion.div>
            ) : (
              /* ── Media Preview ── */
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Main preview */}
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-square md:aspect-4/3">
                  <AnimatePresence mode="wait">
                    {files[activePreview] && (
                      <motion.div
                        key={files[activePreview].id}
                        initial={{ opacity: 0, scale: 1.03 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.25 }}
                        className="w-full h-full"
                      >
                        {files[activePreview].type === "video" ? (
                          <video
                            src={files[activePreview].preview}
                            controls
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <img
                            src={files[activePreview].preview}
                            alt="Preview"
                            className="w-full h-full object-contain"
                          />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* File counter badge */}
                  {files.length > 1 && (
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-medium text-white/90">
                      {activePreview + 1}/{files.length}
                    </div>
                  )}

                  {/* Type badge */}
                  {files[activePreview] && (
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-medium text-white/80">
                      {files[activePreview].type === "video" ? (
                        <>
                          <Film className="w-3 h-3" /> Video
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-3 h-3" /> Image
                        </>
                      )}
                    </div>
                  )}

                  {/* Remove current file */}
                  {files[activePreview] && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeFile(files[activePreview].id)}
                      className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-red-500/80 backdrop-blur-md flex items-center justify-center text-white hover:bg-red-500 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  )}
                </div>

                {/* Thumbnails strip */}
                <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {files.map((f, i) => (
                    <motion.button
                      key={f.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => setActivePreview(i)}
                      className={`relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer group
                        ${
                          i === activePreview
                            ? "border-purple-500 shadow-lg shadow-purple-500/20"
                            : "border-neutral-700/50 hover:border-neutral-600"
                        }`}
                    >
                      {f.type === "video" ? (
                        <video
                          src={f.preview}
                          className="w-full h-full object-cover"
                          muted
                        />
                      ) : (
                        <img
                          src={f.preview}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      )}
                      {f.type === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Film className="w-3.5 h-3.5 text-white/80" />
                        </div>
                      )}
                      {/* Remove button on hover */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <X className="w-4 h-4 text-white" />
                      </div>
                    </motion.button>
                  ))}

                  {/* Add more button */}
                  {files.length < MAX_FILES && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="shrink-0 w-16 h-16 rounded-xl border-2 border-dashed border-neutral-700/50 hover:border-purple-500/50 flex items-center justify-center text-neutral-500 hover:text-purple-400 transition-all cursor-pointer bg-neutral-900/40 hover:bg-purple-500/5"
                    >
                      <Plus className="w-5 h-5" />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ═══ DIVIDER ═══ */}
        <div className="mx-5 my-5 h-px bg-linear-to-r from-transparent via-neutral-700/50 to-transparent" />

        {/* ═══ CAPTION SECTION ═══ */}
        <div className="px-5 pb-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span className="text-sm font-semibold text-neutral-300 tracking-wide">
              Caption
            </span>
            <span className="text-xs text-neutral-600 ml-auto">
              {caption.length}/2200
            </span>
          </div>

          <div className="relative">
            <textarea
              ref={textareaRef}
              value={caption}
              onChange={handleCaptionChange}
              maxLength={2200}
              rows={3}
              placeholder="Write a caption... What's on your mind?"
              className="w-full bg-neutral-900/50 border border-neutral-800/60 rounded-2xl px-4 py-3.5 text-sm text-neutral-200 placeholder-neutral-600 resize-none focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all duration-300 leading-relaxed"
              style={{ minHeight: "88px" }}
            />
            {/* Floating char count indicator */}
            {caption.length > 2000 && (
              <motion.span
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className={`absolute bottom-3 right-3 text-xs font-medium ${
                  caption.length > 2150 ? "text-red-400" : "text-amber-400"
                }`}
              >
                {2200 - caption.length} left
              </motion.span>
            )}
          </div>
        </div>

        {/* ═══ SUBMIT SECTION ═══ */}
        <div className="px-5 pb-5">
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-3 py-4 px-5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-300">
                  Post created successfully! Redirecting...
                </span>
              </motion.div>
            ) : status === "error" ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4"
              >
                <div className="flex items-center gap-3 py-3 px-4 bg-red-500/10 border border-red-500/30 rounded-2xl mb-4">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                  <span className="text-sm text-red-300">{errorMsg}</span>
                </div>
                <SubmitButton
                  canSubmit={canSubmit}
                  uploading={uploading}
                  onClick={handleSubmit}
                  uploadProgress={uploadProgress}
                />
              </motion.div>
            ) : (
              <motion.div
                key="submit"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {uploading ? (
                  <UploadingState progress={uploadProgress} />
                ) : (
                  <SubmitButton
                    canSubmit={canSubmit}
                    uploading={uploading}
                    onClick={handleSubmit}
                    uploadProgress={uploadProgress}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ── Hidden file input ── */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={ACCEPTED_TYPES.join(",")}
        onChange={handleFileInput}
        className="hidden"
      />

      {/* ── Tips ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 text-center"
      >
        <p className="text-xs text-neutral-600">
          Tip: You can upload up to {MAX_FILES} images or videos per post • Max
          15MB each
        </p>
      </motion.div>
    </div>
  );
};

/* ── Sub-components ── */

const SubmitButton = ({ canSubmit, onClick }) => (
  <motion.button
    whileHover={canSubmit ? { scale: 1.01 } : {}}
    whileTap={canSubmit ? { scale: 0.98 } : {}}
    onClick={onClick}
    disabled={!canSubmit}
    className={`w-full relative overflow-hidden group flex items-center justify-center gap-3 py-4 rounded-2xl font-semibold text-sm transition-all duration-300 cursor-pointer
      ${
        canSubmit
          ? "bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
          : "bg-neutral-800/60 text-neutral-600 cursor-not-allowed"
      }`}
  >
    {/* Shimmer effect */}
    {canSubmit && (
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
    )}
    <span className="relative z-10">Share Post</span>
    <ArrowRight className="w-4.5 h-4.5 relative z-10 group-hover:translate-x-1 transition-transform" />
  </motion.button>
);

const UploadingState = ({ progress }) => (
  <div className="space-y-3">
    {/* Progress bar */}
    <div className="relative w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="absolute inset-y-0 left-0 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
      />
      {/* Shimmer on progress bar */}
      <motion.div
        animate={{ x: ["-100%", "200%"] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        className="absolute inset-y-0 w-1/3 bg-linear-to-r from-transparent via-white/20 to-transparent"
      />
    </div>

    <div className="flex items-center justify-center gap-2">
      <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
      <span className="text-sm text-neutral-400 font-medium">
        {progress < 100 ? `Uploading... ${progress}%` : "Processing..."}
      </span>
    </div>
  </div>
);

export default CreatePost;
