import Post from "../models/post.model.js";
import { uploadFile } from "../services/storage.service.js";

export async function createPost(req, res) {
  try {
    const author = req.user.id;
    const { caption } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "Please upload at least one image or video" });
    }

    // Upload files
    const media = await Promise.all(
      files.map(async (file) => {
        const result = await uploadFile(file.buffer, file.originalname);

        return {
          url: result.url,
          type: file.mimetype.split("/")[0],
        };
      })
    );

    // Create new post
    const post = new Post({
      caption,
      author,
      media: media.filter(
        (m) => m.type === "image" || m.type === "video"
      ),
    });
    await post.save();

    // Send response
    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function getPosts(req, res) {
  try {
    // Fetch all posts with author details
    const posts = await Post.find()
      .populate("author", "username profilePicture")
      .sort({ createdAt: -1 });

    // Send response
    res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      posts,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
