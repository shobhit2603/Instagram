import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        bio: {
            type: String,
            default: "",
        },
        profileImage: {
            type: String,
            default: "",
        },
        password: {
            type: String,
            required: function () {
                return !this.googleId; // Password is required if googleId is not provided
            },
        },
        googleId: {
            type: String,
            // unique: true,
            sparse: true, // Allows multiple documents with null googleId
        },
        isPrivate: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true },
);

const User = mongoose.model('User', userSchema);

export default User;