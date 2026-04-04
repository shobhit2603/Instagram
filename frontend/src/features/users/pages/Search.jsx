import { useState, useRef, useEffect, useCallback } from "react";
import {
  Search as SearchIcon,
  Loader2,
  UserPlus,
  Users,
  X,
} from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion"; // Changed to standard framer-motion import
import { useUser } from "../hooks/useUser";

// Animation Variants for a premium feel
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
};

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);
  const { handleSearchUser } = useUser();

  const debouncedSearch = useCallback(
    (searchQuery) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (!searchQuery.trim()) {
        setResults([]);
        setHasSearched(false);
        setLoading(false);
        return;
      }

      setLoading(true);
      debounceRef.current = setTimeout(async () => {
        try {
          const users = await handleSearchUser(searchQuery);
          setResults(users || []);
          setHasSearched(true);
        } catch (error) {
          console.error("Search failed:", error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      }, 400);
    },
    [handleSearchUser],
  );

  useEffect(() => {
    debouncedSearch(query);
    return () => debounceRef.current && clearTimeout(debounceRef.current);
  }, [query, debouncedSearch]);

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setHasSearched(false);
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen w-full pt-4 sm:pt-8 pb-28 md:pb-8 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="mb-6"
        >
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1">
            Search
          </h1>
          <p className="text-sm text-neutral-500">
            Find people by name or username
          </p>
        </motion.div>

        {/* Search Box */}
        <motion.div
          layout
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative group mb-6"
        >
          <motion.div
            animate={{
              scale: focused ? 1.02 : 1,
              boxShadow: focused
                ? "0px 0px 20px rgba(168,85,247,0.15)"
                : "0px 0px 0px rgba(168,85,247,0)",
              borderColor: focused
                ? "rgba(168,85,247,0.5)"
                : "rgba(38,38,38,1)",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative flex items-center bg-neutral-900/80 backdrop-blur-xl border rounded-2xl overflow-hidden"
          >
            <div className="pl-4 pr-1">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                  >
                    <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="search"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                  >
                    <SearchIcon
                      className={`w-5 h-5 transition-colors duration-300 ${
                        focused ? "text-purple-400" : "text-neutral-500"
                      }`}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Search users..."
              autoComplete="off"
              className="flex-1 bg-transparent py-3.5 px-3 text-[15px] text-white placeholder-neutral-500 focus:outline-none"
            />

            <AnimatePresence>
              {query && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onClick={clearSearch}
                  className="mr-3 p-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Dynamic Results Area */}
        <motion.div layout className="space-y-2">
          <AnimatePresence mode="wait">
            {/* Loading Skeleton */}
            {loading && query && (
              <motion.div
                key="skeleton"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                exit="hidden"
                className="space-y-2"
              >
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    className="flex items-center gap-4 px-4 py-3.5 bg-neutral-900/60 border border-neutral-800/50 rounded-2xl"
                  >
                    <div className="w-12 h-12 rounded-full bg-neutral-800 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-28 bg-neutral-800 rounded-full animate-pulse" />
                      <div className="h-2 w-20 bg-neutral-800/60 rounded-full animate-pulse" />
                    </div>
                    <div className="h-9 w-20 bg-neutral-800 rounded-xl animate-pulse" />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Results List */}
            {!loading && results.length > 0 && (
              <motion.div
                key="results"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                exit="hidden"
                className="space-y-2"
              >
                <motion.p
                  layout
                  className="text-xs font-medium text-neutral-500 uppercase tracking-widest px-1 mb-3"
                >
                  {results.length} result{results.length !== 1 ? "s" : ""} found
                </motion.p>

                {results.map((user) => (
                  <motion.div key={user._id} variants={itemVariants} layout>
                    <div className="flex items-center gap-4 px-4 py-3.5 bg-neutral-900/60 border border-neutral-800/50 rounded-2xl hover:bg-neutral-800/60 transition-colors group">
                      <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                        <img
                          src={
                            user.profileImage ||
                            "https://i.pinimg.com/736x/83/bc/8b/83bc8b88cf6bc4b4e04d153a418cde62.jpg"
                          }
                          alt={user.username}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] font-semibold text-white truncate">
                          {user.username}
                        </p>
                        <p className="text-sm text-neutral-400 truncate mt-0.5">
                          {user.fullName}
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-xl"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span className="hidden sm:inline">Follow</span>
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* No Results State */}
            {!loading && hasSearched && results.length === 0 && query && (
              <motion.div
                key="no-results"
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="text-center py-16 bg-neutral-900/40 rounded-3xl border border-neutral-800/80"
              >
                <motion.div
                  initial={{ rotate: -10 }}
                  animate={{ rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="w-16 h-16 rounded-full bg-neutral-800/80 flex items-center justify-center mx-auto mb-4"
                >
                  <SearchIcon className="w-7 h-7 text-neutral-600" />
                </motion.div>
                <h3 className="text-lg font-semibold text-white/80 mb-1.5">
                  No users found
                </h3>
                <p className="text-neutral-500 text-sm">
                  We couldn&apos;t find anyone matching &quot;
                  <span className="text-neutral-300">{query}</span>&quot;.
                </p>
              </motion.div>
            )}

            {/* Initial State */}
            {!loading && !hasSearched && !query && (
              <motion.div
                key="initial"
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="text-center py-16 bg-neutral-900/40 rounded-3xl border border-neutral-800/80"
              >
                <div className="w-16 h-16 rounded-full bg-neutral-800/80 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-7 h-7 text-neutral-600" />
                </div>
                <h3 className="text-lg font-semibold text-white/80 mb-1.5">
                  Discover People
                </h3>
                <p className="text-neutral-500 text-sm">
                  Search by name or username to find people.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Search;
