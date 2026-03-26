import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { config } from "../config/config.js";

export async function register(req, res) {
  try {
    const { username, email, fullName, password } = req.body;

    // Check existing user
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }

    // Hash password
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    // Create new user
    const user = new User({
      username,
      email,
      fullName,
      password: hashedPassword,
    });
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
      },
      config.JWT_SECRET,
      { expiresIn: "1h" },
    );

    // Set Token in Cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Send Response
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Check password
    const isMatch =
      crypto.createHash("sha256").update(password).digest("hex") ===
      user.password;

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
      },
      config.JWT_SECRET,
      { expiresIn: "1h" },
    );

    // Set Token in Cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Send Response
    res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function logout(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "User logged out successfully",
  });
}

export async function getMe(req, res) {
  const user = await User.findById(req.user.id);

  return res.status(200).json({
    message: "User Profile fetched successfully",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
    },
  });
}

export async function googleAuth(req, res) {
  try {
    const { id, displayName, emails, photos } = req.user;
    const email = emails && emails.length > 0 ? emails[0].value : null;

    if (!email) {
      return res
        .status(400)
        .json({ error: "Google account does not have an email" });
    }

    // Check if user exists
    let user = await User.findOne({
      $or: [{ email }, { googleId: id }],
    });

    if (!user) {
      // Create new user
      const baseUsername = displayName
        ? displayName.replace(/\s/g, "").toLowerCase()
        : "user";
      const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();

      user = new User({
        username: `${baseUsername}${randomSuffix}`,
        email,
        fullName: displayName || "Google User",
        profileImage: photos && photos.length > 0 ? photos[0].value : "",
        googleId: id,
      });
      await user.save();
      console.log("User created successfully", user);
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
      },
      config.JWT_SECRET,
      { expiresIn: "1h" },
    );

    // Set Token in Cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Send Response (redirect to frontend on success)
    /* res.redirect(process.env.FRONTEND_URL || "/"); */
    res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
