import Post from "../models/post.model.js";
import { uploadFile, deleteFile } from "../services/storage.service.js";

export async function createPost(req, res) {
  try {
    const { caption } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "Please upload a file" });
    }

    const result = await uploadFile(file, "/posts");

    const post = new Post({
      caption,
      image: result.url,
      author: req.user.id,
    });

    await post.save();

    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function deletePost(req, res) {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await deleteFile(post.fileId);
    await post.deleteOne();

    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function getPosts(req, res) {
  try {
    const posts = await Post.find()
      .populate("author", "username profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Posts fetched successfully",
      posts,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
