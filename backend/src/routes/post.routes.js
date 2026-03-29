import { Router } from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import {
  createPost,
  deletePost,
  getPosts,
} from "../controllers/post.controller.js";

const router = Router();

// Create Post - POST /api/posts
router.post("/", authUser, upload.single("image"), createPost);

// Delete Post - DELETE /api/posts/:id
router.delete("/:id", authUser, deletePost);

// Get Posts - GET /api/posts
router.get("/", getPosts);

export default router;