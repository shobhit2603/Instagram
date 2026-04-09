import Follow from "../models/follow.model.js";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import { uploadFile } from "../services/storage.service.js";
import mongoose from "mongoose";

// /api/users/search?q=shobhit

export const searchUser = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(200).json({
        message: "No query provided",
        success: true,
        users: [],
      });
    }

    const users = await User.aggregate([
      {
        $search: {
          index: "user_search_feature",
          compound: {
            should: [
              {
                autocomplete: {
                  query: q,
                  path: "username",
                  fuzzy: { maxEdits: 1 },
                },
              },
              {
                autocomplete: {
                  query: q,
                  path: "fullName",
                  fuzzy: { maxEdits: 1 },
                },
              },
            ],
          },
        },
      },
      {
        $limit: 20,
      },
      {
        $lookup: {
          from: "follows",
          as: "followDoc",
          let: { searchUserId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$followee", "$$searchUserId"] },
                    { $eq: ["$follower", new mongoose.Types.ObjectId(req.user.id)] },
                  ],
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          followStatus: {
            $cond: {
              if: { $eq: [{ $size: "$followDoc" }, 0] },
              then: "not-following",
              else: {
                $cond: {
                  if: {
                    $eq: [{ $arrayElemAt: ["$followDoc.status", 0] }, "pending"],
                  },
                  then: "requested",
                  else: "following",
                },
              },
            },
          },
        },
      },
      {
        $project: {
          username: 1,
          fullName: 1,
          profileImage: 1,
          score: { $meta: "searchScore" },
          followStatus: 1,
        },
      },
    ]);

    res.status(200).json({
      message: "Users fetched successfully",
      success: true,
      users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Search failed",
      success: false,
      error: error.message,
    });
  }
};

// /api/users/follow/:userId

export const followUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    const isUserExist = await User.findById(userId);

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
      followee: userId,
    });

    if (alreadyFollowing) {
      if (alreadyFollowing.status === "pending") {
        return res.status(400).json({
          message: "Follow request is already pending",
          success: false,
        });
      }
      return res.status(400).json({
        message: "You are already following this user",
        success: false,
      });
    }

    const follow = await Follow.create({
      follower: currentUserId,
      followee: userId,
      status: "pending",
    });

    return res.status(200).json({
      message: "Follow request sent successfully",
      success: true,
      follow,
      followStatus: "requested",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
};

// GET /api/users/follow-requests
export const getFollowRequests = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;

    const requests = await Follow.find({
      followee: loggedInUserId,
      status: "pending",
    }).populate("follower", "username fullName profileImage");

    return res.status(200).json({
      message: "Follow requests fetched successfully",
      success: true,
      requests,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch follow requests",
      success: false,
      error: error.message,
    });
  }
};

// PATCH /api/users/follow-requests/:requestId/accept
export const acceptFollowRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const loggedInUserId = req.user.id;

    const followRequest = await Follow.findOne({
      _id: requestId,
      status: "pending",
      followee: loggedInUserId,
    });

    if (!followRequest) {
      return res.status(404).json({
        message: "Follow request not found",
        success: false,
      });
    }

    followRequest.status = "accepted";
    await followRequest.save();

    return res.status(200).json({
      message: "Follow request accepted successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to accept follow request",
      success: false,
      error: error.message,
    });
  }
};

// DELETE /api/users/follow-requests/:requestId/reject
export const rejectFollowRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const loggedInUserId = req.user.id;

    const followRequest = await Follow.findOneAndDelete({
      _id: requestId,
      status: "pending",
      followee: loggedInUserId,
    });

    if (!followRequest) {
      return res.status(404).json({
        message: "Follow request not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Follow request rejected successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to reject follow request",
      success: false,
      error: error.message,
    });
  }
};

// GET /api/users/profile

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password -googleId");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const posts = await Post.find({ author: userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      profile: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        bio: user.bio,
        profileImage: user.profileImage,
        isPrivate: user.isPrivate,
        createdAt: user.createdAt,
      },
      posts,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PUT /api/users/profile

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, bio, isPrivate } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Check if username is taken by another user
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          message: "Username is already taken",
          success: false,
        });
      }
      user.username = username;
    }

    if (bio !== undefined) {
      user.bio = bio;
    }

    if (isPrivate !== undefined) {
      user.isPrivate = isPrivate;
    }

    // Handle profile image upload
    if (req.file) {
      const result = await uploadFile(req.file.buffer, req.file.originalname);
      user.profileImage = result.url;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        bio: user.bio,
        profileImage: user.profileImage,
        isPrivate: user.isPrivate,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};