import { Router } from "express";
import { searchUser, followUser } from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { followUserValidator } from "../validators/user.validator.js";

const router = Router();

// Search User - GET /api/users/search?q=shobhit
router.get("/search", searchUser);

// Follow User - POST /api/users/follow/:userId
router.post("/follow/:userId", protect, followUserValidator, followUser);

export default router;