import followModel from "../models/follow.model.js";
import User from "../models/user.model.js";

export const getUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    const currentUser = await User.findById(loggedInUserId);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    const currentUsername = currentUser.username;

    const users = await followModel.aggregate(
      [
        {
          $match: {
            $or: [{ followee: currentUsername }, { follower: currentUsername }],
            status: "accepted",
          },
        },
        {
          $addFields: {
            user: {
              $cond: {
                if: {
                  $eq: ["$follower", currentUsername],
                },
                then: "$followee",
                else: "$follower",
              },
            },
          },
        },
        {
          $group: {
            _id: "$user",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "username",
            as: "userDetails",
          },
        },
        {
          $unwind: {
            path: "$userDetails",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $project: {
            _id: "$userDetails._id",
            username: "$userDetails.username",
            profilePicture: "$userDetails.profileImage",
          },
        },
      ],
      { maxTimeMS: 60000, allowDiskUse: true },
    );

    return res.status(200).json({
      message: "Users fetched successfully",
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error in getUsers:", error);
    return res.status(500).json({
      message: "Failed to fetch users",
      success: false,
      error: error.message,
    });
  }
};
