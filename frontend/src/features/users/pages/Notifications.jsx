import React, { useEffect } from "react";
// eslint-disable-next-line
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Bell, Check, X } from "lucide-react";
import { useUser } from "../hooks/useUser";
import { useSelector } from "react-redux";

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.05 },
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

const Notifications = () => {
    const { followRequests, loading } = useSelector((state) => state.user);
    const { handleGetFollowRequests, handleAcceptFollowRequest, handleRejectFollowRequest } = useUser();

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                await handleGetFollowRequests();
            } catch (error) {
                console.error("Failed to fetch requests", error);
            }
        };
        fetchRequests();
    }, [handleGetFollowRequests]);

    const onAccept = async (requestId) => {
        try {
            await handleAcceptFollowRequest(requestId);
        } catch (error) {
            console.error("Failed to accept request", error);
        }
    };

    const onReject = async (requestId) => {
        try {
            await handleRejectFollowRequest(requestId);
        } catch (error) {
            console.error("Failed to reject request", error);
        }
    };

    return (
        <div className="min-h-screen w-full pt-4 sm:pt-8 pb-28 md:pb-8 px-4">
            <div className="max-w-xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="mb-8"
                >
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1 flex items-center gap-2">
                        <Bell className="w-7 h-7 text-purple-400" />
                        Notifications
                    </h1>
                    <p className="text-sm text-neutral-500">Manage your follow requests</p>
                </motion.div>

                <motion.div layout className="space-y-4">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                key="skeleton"
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                                exit="hidden"
                                className="space-y-3"
                            >
                                {[...Array(3)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        variants={itemVariants}
                                        className="flex items-center gap-4 px-4 py-4 bg-neutral-900/60 border border-neutral-800/50 rounded-2xl"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-neutral-800 animate-pulse" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-3 w-32 bg-neutral-800 rounded-full animate-pulse" />
                                            <div className="h-2 w-24 bg-neutral-800/60 rounded-full animate-pulse" />
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="h-9 w-9 bg-neutral-800 rounded-full animate-pulse" />
                                            <div className="h-9 w-9 bg-neutral-800 rounded-full animate-pulse" />
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : followRequests?.length > 0 ? (
                            <motion.div
                                key="requests"
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                                exit="hidden"
                                className="space-y-3"
                            >
                                <motion.p
                                    layout
                                    className="text-xs font-medium text-neutral-500 uppercase tracking-widest px-1 mb-2"
                                >
                                    Follow Requests ({followRequests.length})
                                </motion.p>

                                <AnimatePresence>
                                    {followRequests.map((request) => (
                                        <motion.div key={request._id} variants={itemVariants} layout exit="exit">
                                            <div className="flex items-center gap-4 px-4 py-4 bg-neutral-900/60 border border-neutral-800/50 rounded-2xl hover:bg-neutral-800/60 transition-colors">
                                                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                                                    <img
                                                        src={
                                                            request.follower?.profileImage ||
                                                            `https://api.dicebear.com/9.x/bottts/svg?seed=${request.follower?.username}`
                                                        }
                                                        alt={request.follower?.username}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[15px] font-semibold text-white truncate">
                                                        {request.follower?.username}
                                                    </p>
                                                    <p className="text-sm text-neutral-400 truncate mt-0.5">
                                                        wants to follow you
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => onAccept(request._id)}
                                                        className="p-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-full transition-colors flex items-center justify-center"
                                                        title="Accept"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => onReject(request._id)}
                                                        className="p-2.5 bg-neutral-800 hover:bg-red-500/20 hover:text-red-500 text-neutral-400 rounded-full transition-colors flex items-center justify-center"
                                                        title="Decline"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="no-requests"
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className="text-center py-16 bg-neutral-900/40 rounded-3xl border border-neutral-800/80"
                            >
                                <div className="w-16 h-16 rounded-full bg-neutral-800/80 flex items-center justify-center mx-auto mb-4">
                                    <Bell className="w-7 h-7 text-neutral-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-white/80 mb-1.5">
                                    No new notifications
                                </h3>
                                <p className="text-neutral-500 text-sm">
                                    When someone sends you a follow request, it will appear here.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default Notifications;