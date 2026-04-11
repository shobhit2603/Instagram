import followModel from "../models/follow.model.js";

export const getUsers = async (req, res) => {
  const loggedInUserId = req.user.id;

  const users = await followModel.aggregate(
    [
      {
        $match: {
          $or: [{ followee: loggedInUserId }, { follower: loggedInUserId }],
          status: "accepted",
        },
      },
      {
        $addFields: {
          user: {
            $cond: {
              if: {
                $eq: ["$follower", loggedInUserId],
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
        $addFields: {
          userObjId: { $toObjectId: "$_id" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userObjId",
          foreignField: "_id",
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
};
