import Follow from "../models/follow.model.js";
import User from "../models/user.model.js";

// /api/users/search?q=shobhit

export const searchUser = async (req, res) => {
  try {
    const { q } = req.query;
    const users = await User.find({ username: { $regex: q, $options: "i" } });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const followUser = async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user.id;

  if (!isUserExist) {
    return res.status(404).json({
      message: "User not found",
      success: false,
    });
  }

  if (userId === currentUserId) {
    return res.status(400).json({
      message: "You cannot follow yourself",
      success: false,
    });
  }

  const alreadyFollowing = await Follow.findOne({
    follower: currentUserId,
    following: userId,
  });

  if (alreadyFollowing) {
    return res.status(400).json({
      message: "You are already following this user",
      success: false,
    });
  }

  const follow = await Follow.create({
    follower: currentUserId,
    following: userId,
  });

  res.status(200).json({
    message: "Follow request sent successfully",
    success: true,
    follow,
  });
};