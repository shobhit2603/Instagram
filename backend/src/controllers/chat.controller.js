import followModel from "../models/follow.model.js";
import User from "../models/user.model.js";

export const getUsers = async (req, res) => {
  const loggedInUserId = req.user.id;
  const user = await User.findById(loggedInUserId);

  if (!user) {
    return res.status(404).json({ message: "User not found", success: false })
  }

  // Get all users the current user follows or who follow the current user
  const follows = await followModel.find({
    $or: [{ followee: user.username }, { follower: user.username }],
    status: "accepted",
  });

  const connectedUsernames = new Set();
  follows.forEach(f => {
    if (f.follower !== user.username) connectedUsernames.add(f.follower);
    if (f.followee !== user.username) connectedUsernames.add(f.followee);
  });

  const users = await User.find({
    username: { $in: Array.from(connectedUsernames) }
  }).select("username profileImage fullName");

  return res.status(200).json({
    message: "Users fetched successfully",
    success: true,
    users,
  });
};
