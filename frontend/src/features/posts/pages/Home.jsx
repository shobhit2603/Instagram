import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { usePost } from '../hooks/usePost';
import PostCard from '../components/PostCard';
import { Loader2, Camera } from 'lucide-react';

const Home = () => {
  const { handleGetPosts } = usePost();
  const { posts, loading, error } = useSelector((state) => state.posts);

  useEffect(() => {
    handleGetPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="pt-6 sm:pt-10 px-0 sm:px-4 max-w-lg mx-auto w-full">
      {/* Mobile Header (Hidden on Desktop) */}
      <header className="flex items-center justify-between mb-6 px-4 sm:hidden">
        <h1 className="text-2xl tracking-tighter" style={{ fontFamily: 'var(--font-instagram, sans-serif)' }}>Instagram</h1>
      </header>
      
      {loading ? (
        <div className="flex justify-center items-center py-32">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-20 px-4">
          <p className="text-red-400 mb-4 font-medium tracking-wide">Failed to load posts.</p>
          <button 
            onClick={() => handleGetPosts()} 
            className="px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-sm font-semibold transition-all shadow-md cursor-pointer"
          >
            Try Again
          </button>
        </div>
      ) : posts && posts.length > 0 ? (
        <div className="space-y-2 sm:space-y-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-neutral-900/40 rounded-4xl border border-neutral-800/80 mx-4 sm:mx-0 shadow-lg">
          <div className="w-20 h-20 rounded-full bg-linear-to-tr from-neutral-800 to-neutral-900 flex items-center justify-center mx-auto mb-6 shadow-inner border border-neutral-800">
            <Camera className="w-8 h-8 text-neutral-500" />
          </div>
          <h3 className="text-xl font-semibold text-white/90 mb-2">No Posts Yet</h3>
          <p className="text-neutral-500 text-sm max-w-[200px] mx-auto leading-relaxed">
            Follow people or create a post to see photos and videos here.
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
