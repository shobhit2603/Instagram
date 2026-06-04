import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { config } from "../config/config.js";

const isProduction = process.env.NODE_ENV === "production" || !config.FRONTEND_URL.includes("localhost");

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

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
    res.cookie("token", token, cookieOptions);

    // Send Response
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, username, password } = req.body;

    const query = [];
    if (email) query.push({ email });
    if (username) query.push({ username });

    if (query.length === 0) {
      return res.status(400).json({ error: "Please provide email or username" });
    }

    // Find user by email or username
    const user = await User.findOne({ $or: query });

    if (!user) {
      return res.status(400).json({ error: "Invalid email or username or password" });
    }

    // Check password
    const isMatch =
      crypto.createHash("sha256").update(password).digest("hex") ===
      user.password;

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or username or password" });
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
    res.cookie("token", token, cookieOptions);

    // Send Response
    res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function logout(req, res) {
  res.clearCookie("token", {
    ...cookieOptions,
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
      profileImage: user.profileImage,
      bio: user.bio,
      isPrivate: user.isPrivate,
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
      const firstName = displayName
        ? displayName.split(" ")[0].toLowerCase()
        : "user";

      const baseUsername = firstName.replace(/[^a-z0-9]/gi, "");

      let username = baseUsername;
      let counter = 1;

      while (await User.findOne({ username })) {
        username = `${baseUsername}${counter}`;
        counter++;
      }
      user = new User({
        username,
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
    res.cookie("token", token, cookieOptions);

    // Redirect to frontend app directly instead of closing popup
    res.redirect(config.FRONTEND_URL);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
