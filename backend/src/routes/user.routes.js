import express from "express"
import { followUser, searchUser, getProfile, updateProfile, getFollowRequests, acceptFollowRequest, rejectFollowRequest } from "../controllers/user.controller.js"
import { authUser } from "../middlewares/auth.middleware.js"
import { validateFollowUser } from "../validators/user.validator.js"
import multer from "multer"

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

const router = express.Router()

router.get("/search", authUser, searchUser)

router.post("/follow/:userId", validateFollowUser, authUser, followUser)

router.get("/follow-requests", authUser, getFollowRequests)

router.patch("/follow-requests/:requestId/accept", authUser, acceptFollowRequest)

router.delete("/follow-requests/:requestId/reject", authUser, rejectFollowRequest)

// Profile routes
router.get("/profile", authUser, getProfile)

router.put("/profile", authUser, upload.single("profileImage"), updateProfile)

export default router;