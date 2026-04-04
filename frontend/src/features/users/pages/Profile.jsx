import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useUser } from "../hooks/useUser";
import {
  Loader2,
  Camera,
  Settings,
  X,
  Check,
  Lock,
  Globe,
  ImageIcon,
} from "lucide-react";

const Profile = () => {
  const { handleGetProfile, handleUpdateProfile } = useUser();
  const { profile, userPosts, loading } = useSelector((state) => state.user);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: "",
    bio: "",
    isPrivate: true,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    handleGetProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openEditModal = () => {
    setEditForm({
      username: profile?.username || "",
      bio: profile?.bio || "",
      isPrivate: profile?.isPrivate ?? true,
    });
    setPreviewImage(null);
    setSelectedFile(null);
    setIsEditing(true);
  };

  const closeEditModal = () => {
    setIsEditing(false);
    setPreviewImage(null);
    setSelectedFile(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("username", editForm.username);
      formData.append("bio", editForm.bio);
      formData.append("isPrivate", editForm.isPrivate);
      if (selectedFile) {
        formData.append("profileImage", selectedFile);
      }
      await handleUpdateProfile(formData);
      closeEditModal();
    } catch {
      // Error is handled in the hook
    } finally {
      setSaving(false);
    }
  };

  if (loading && !profile) {
    return (
      <div className="flex justify-center items-center py-32 w-full">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20 px-4 w-full">
        <p className="text-neutral-400">Could not load profile.</p>
      </div>
    );
  }

  return (
    <div className="pt-6 sm:pt-10 px-4 max-w-2xl mx-auto w-full pb-8">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10 mb-8">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden ring-2 ring-neutral-800 ring-offset-2 ring-offset-neutral-950">
            <img
              src={profile.profileImage}
              alt={profile.username}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left min-w-0">
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-3">
            <h1 className="text-xl font-semibold tracking-tight truncate">
              {profile.username}
            </h1>
            <div className="flex items-center gap-2">
              {profile.isPrivate ? (
                <span className="flex items-center gap-1 text-xs text-neutral-400 bg-neutral-800/60 px-2.5 py-1 rounded-full">
                  <Lock className="w-3 h-3" /> Private
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-neutral-400 bg-neutral-800/60 px-2.5 py-1 rounded-full">
                  <Globe className="w-3 h-3" /> Public
                </span>
              )}
            </div>
          </div>

          <p className="text-sm text-neutral-300 font-medium mb-1">
            {profile.fullName}
          </p>

          {profile.bio && (
            <p className="text-sm text-neutral-400 leading-relaxed max-w-md whitespace-pre-wrap">
              {profile.bio}
            </p>
          )}

          <button
            onClick={openEditModal}
            className="mt-4 inline-flex items-center gap-2 px-5 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-sm font-semibold transition-all cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-neutral-800 mb-6" />

      {/* Posts Count */}
      <div className="flex items-center gap-2 mb-5">
        <ImageIcon className="w-4 h-4 text-neutral-500" />
        <span className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">
          Posts
        </span>
        <span className="text-sm text-neutral-500">
          {userPosts?.length || 0}
        </span>
      </div>

      {/* Posts Grid */}
      {userPosts && userPosts.length > 0 ? (
        <div className="grid grid-cols-3 gap-1 sm:gap-2">
          {userPosts.map((post) => (
            <div
              key={post._id}
              className="relative aspect-square bg-neutral-900 rounded-lg sm:rounded-xl overflow-hidden group cursor-pointer"
            >
              {post.media && post.media.length > 0 ? (
                post.media[0].type === "video" ? (
                  <video
                    src={post.media[0].url}
                    className="w-full h-full object-cover"
                    muted
                  />
                ) : (
                  <img
                    src={post.media[0].url}
                    alt={post.caption || "Post"}
                    className="w-full h-full object-cover"
                  />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-neutral-700" />
                </div>
              )}
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {post.caption && (
                  <p className="text-white text-xs px-2 text-center line-clamp-2">
                    {post.caption}
                  </p>
                )}
              </div>
              {/* Multi-media indicator */}
              {post.media && post.media.length > 1 && (
                <div className="absolute top-2 right-2">
                  <div className="w-5 h-5 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <span className="text-[10px] text-white font-bold">
                      {post.media.length}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-neutral-900/40 rounded-3xl border border-neutral-800/80">
          <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mx-auto mb-4">
            <Camera className="w-7 h-7 text-neutral-500" />
          </div>
          <h3 className="text-lg font-semibold text-white/90 mb-1.5">
            No Posts Yet
          </h3>
          <p className="text-neutral-500 text-sm">
            Your posts will appear here.
          </p>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6 relative">
            {/* Close Button */}
            <button
              onClick={closeEditModal}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-semibold mb-6">Edit Profile</h2>

            {/* Profile Image */}
            <div className="flex justify-center mb-6">
              <div
                className="relative cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-neutral-700">
                  <img
                    src={previewImage || profile.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            {/* Username */}
            <div className="mb-4">
              <label className="block text-sm text-neutral-400 mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={editForm.username}
                onChange={(e) =>
                  setEditForm({ ...editForm, username: e.target.value })
                }
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition"
                placeholder="Username"
              />
            </div>

            {/* Bio */}
            <div className="mb-4">
              <label className="block text-sm text-neutral-400 mb-1.5">
                Bio
              </label>
              <textarea
                value={editForm.bio}
                onChange={(e) =>
                  setEditForm({ ...editForm, bio: e.target.value })
                }
                rows={3}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition resize-none"
                placeholder="Write something about yourself..."
              />
            </div>

            {/* Private Toggle */}
            <div className="flex items-center justify-between mb-6 bg-neutral-800/50 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2">
                {editForm.isPrivate ? (
                  <Lock className="w-4 h-4 text-neutral-400" />
                ) : (
                  <Globe className="w-4 h-4 text-neutral-400" />
                )}
                <span className="text-sm text-neutral-300">
                  Private Account
                </span>
              </div>
              <button
                onClick={() =>
                  setEditForm({ ...editForm, isPrivate: !editForm.isPrivate })
                }
                className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                  editForm.isPrivate ? "bg-purple-500" : "bg-neutral-600"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    editForm.isPrivate ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl py-2.5 text-sm font-semibold transition-all cursor-pointer"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;