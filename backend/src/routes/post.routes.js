import { Router } from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import {
  createPost,
  deletePost,
  getPosts,
} from "../controllers/post.controller.js";
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // 15 MB
  },
});

const router = Router();

// Create Post - POST /api/posts
router.post("/", authUser, upload.single("image"), createPost);

// Delete Post - DELETE /api/posts/:id
router.delete("/:id", authUser, deletePost);

// Get Posts - GET /api/posts
router.get("/", getPosts);

export default router;