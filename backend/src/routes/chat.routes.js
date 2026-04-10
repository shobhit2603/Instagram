import { Router } from "express";
import { getUsers } from "../controllers/chat.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const router = Router();

// GET - /api/chats/users
router.get("/users", authUser, getUsers);

export default router;