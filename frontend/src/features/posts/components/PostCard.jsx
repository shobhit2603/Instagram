import React from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  // Format time simple helper
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor(diff / (1000 * 60));
    if (mins < 60) return `${mins}m`;
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  const authorName = post.author?.username || post.author || "User";

  return (
    <article className="bg-neutral-900/40 border border-neutral-800/80 sm:rounded-3xl overflow-hidden mb-6 shadow-xs group/card transition-all hover:bg-neutral-900/60 hover:border-neutral-700/80">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <Link to={`/profile/${post.author?._id || post.author}`} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-linear-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[2px] shadow-[0_0_12px_rgba(168,85,247,0.3)] transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-neutral-950 rounded-full overflow-hidden border border-neutral-950">
              <img 
                src={post.author?.profileImage || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"} 
                alt={`${authorName}'s avatar`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-white/95 text-sm tracking-wide">
              {authorName}
            </h3>
            {post.location && <p className="text-xs text-neutral-500 mt-0.5">{post.location}</p>}
          </div>
        </Link>
        <button className="text-neutral-500 hover:text-white transition-colors p-2 rounded-full hover:bg-neutral-800">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Media Viewer - CSS Snap Scroll */}
      <div className="relative bg-black aspect-4/5 sm:aspect-square flex items-center overflow-hidden border-y border-neutral-800/50 sm:border-none">
        <div className="w-full h-full flex overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {post.media?.map((m, idx) => (
            <div key={idx} className="min-w-full h-full snap-center flex items-center justify-center relative">
              {m.type === 'video' ? (
                <video src={m.url} controls className="w-full h-full object-cover" />
              ) : (
                <img src={m.url} alt={`post content ${idx}`} className="w-full h-full object-cover" />
              )}
            </div>
          ))}
        </div>
        
        {/* Pagination Indicator (if multiple media) */}
        {post.media?.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-medium tracking-wider z-10">
            1/{post.media.length}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 pb-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button className="text-neutral-400 hover:text-pink-500 transition-colors cursor-pointer group hover:scale-110 active:scale-90 duration-300">
              <Heart className="w-6 h-6" />
            </button>
            <button className="text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer group hover:scale-110 active:scale-90 duration-300">
              <MessageCircle className="w-6 h-6" />
            </button>
            <button className="text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer group hover:scale-110 active:scale-90 duration-300">
              <Send className="w-6 h-6" />
            </button>
          </div>
          <button className="text-neutral-400 hover:text-white transition-colors cursor-pointer group hover:scale-110 active:scale-90 duration-300">
            <Bookmark className="w-6 h-6" />
          </button>
        </div>

        {/* Stats */}
        <div className="mb-2.5">
          <p className="text-[13px] font-semibold text-white/95 tracking-wide">
            {post.likesCount} {post.likesCount === 1 ? 'like' : 'likes'}
          </p>
        </div>

        {/* Caption */}
        <div className="text-[13px] leading-relaxed mb-3">
          <span className="font-semibold text-white/95 mr-2 tracking-wide">
            {authorName}
          </span>
          <span className="text-neutral-300">
            {post.caption}
          </span>
        </div>

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

export default PostCard;
