import express from "express"
import { followUser, searchUser, getProfile, updateProfile } from "../controllers/user.controller.js"
import { authUser } from "../middlewares/auth.middleware.js"
import { validateFollowUser } from "../validators/user.validator.js"
import multer from "multer"

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

const router = express.Router()

router.get("/search", searchUser)

router.post("/follow/:userId", validateFollowUser, authUser, followUser)

// Profile routes
router.get("/profile", authUser, getProfile)

router.put("/profile", authUser, upload.single("profileImage"), updateProfile)

export default router;