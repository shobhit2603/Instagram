import { Router } from "express";
import { getUsers, getMessages } from "../controllers/chat.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const router = Router();

// GET - /api/chats/users
router.get("/users", authUser, getUsers);

// GET - /api/chats/messages/:userId
router.get("/messages/:userId", authUser, getMessages);

export default router;