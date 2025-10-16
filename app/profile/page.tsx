"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import {
  Edit,
  Save,
  Loader2,
  KeyRound,
  Mail,
  Phone,
  MapPin,
  Camera,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext"; // Corrected the import path


export default function ProfilePage() {
  const { user: authUser, setUser, loading: authLoading } = useAuth(); // Use the user and setUser from AuthContext

  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    profilePhotoUrl: "",
    bio: "",
    phone: "",
    location: "",
  });
  const [formError, setFormError] = useState("");
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);

  // Separate state for password form
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // When the user data from context loads, populate the form
  useEffect(() => {
    if (authUser) {
      setFormData({
        username: authUser.username || "",
        email: authUser.email || "",
        profilePhotoUrl: authUser.profilePhotoUrl || "",
        bio: authUser.bio || "",
        phone: authUser.phone || "",
        location: authUser.location || "",
      });
    }
  }, [authUser]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !authUser) {
      window.location.href = "/signin";
    }
  }, [authUser, authLoading]);

  // Timeout for success messages
  useEffect(() => {
    if (successMessage || passwordSuccess) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setPasswordSuccess("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, passwordSuccess]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handles converting the selected image file to a Base64 string for preview
  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePhotoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handlePasswordInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");
    setIsSubmittingProfile(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update profile");
      }
      
      // *** CORRECTED LOGIC ***
      // 1. Update the AuthContext with the new user data.
      // This will make the changes visible instantly across the entire app (like the Navbar).
      setUser(data.user);

      setSuccessMessage("Profile updated successfully!");
      setIsEditing(false);

    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  const handlePasswordUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return;
    }

    setIsSubmittingPassword(true);

    try {
      const res = await fetch("/api/profile/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordData),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Something went wrong");
      }
      
      setPasswordSuccess(data.message || "Password updated successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });

    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  if (authLoading || !authUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <main className="bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200/80 relative">
          {successMessage && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-100 text-green-800 text-sm font-medium px-4 py-2 rounded-full">
              {successMessage}
            </div>
          )}

          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              {formData.profilePhotoUrl ? (
                 // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={formData.profilePhotoUrl}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-slate-200"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-slate-200 flex items-center justify-center border-4 border-slate-200">
                  <span className="text-5xl font-bold text-slate-500">
                    {authUser.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              {isEditing && (
                <>
                  <label
                    htmlFor="photo-upload"
                    className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Camera size={32} className="text-white" />
                    <input
                      id="photo-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handlePhotoChange}
                    />
                  </label>
                  {formData.profilePhotoUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, profilePhotoUrl: "" })}
                      className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs px-3 py-1 rounded-full shadow hover:bg-red-700"
                    >
                      Remove
                    </button>
                  )}
                </>
              )}
            </div>

            <div className="text-center md:text-left w-full">
              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="text-3xl font-bold text-slate-900 w-full bg-slate-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us a little about yourself..."
                    maxLength={250}
                    className="text-slate-500 w-full bg-slate-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email"
                      className="w-full bg-slate-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                      type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number"
                      className="w-full bg-slate-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                      type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="Location (e.g., Pune)"
                      className="w-full bg-slate-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  {formError && (<p className="text-sm text-red-500">{formError}</p>)}
                  <div className="flex gap-4">
                    <button type="submit" disabled={isSubmittingProfile}
                      className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700 disabled:bg-slate-400 flex items-center gap-2"
                    >
                      <Save size={16} /> {isSubmittingProfile ? "Saving..." : "Save Profile"}
                    </button>
                    <button type="button" onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg text-sm font-semibold hover:bg-slate-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <h1 className="text-4xl font-extrabold text-slate-900">{formData.username}</h1>
                  <p className="text-slate-600 mt-2 max-w-lg">{formData.bio || "No bio provided."}</p>
                  <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-slate-500">
                    <span className="flex items-center gap-2"><Mail size={16} /> {formData.email}</span>
                    {formData.phone && (<span className="flex items-center gap-2"><Phone size={16} /> {formData.phone}</span>)}
                    {formData.location && (<span className="flex items-center gap-2"><MapPin size={16} /> {formData.location}</span>)}
                  </div>
                  <span className={`mt-4 inline-block px-3 py-1 rounded-full text-xs font-semibold ${authUser.role === "owner" ? "bg-amber-100 text-amber-800" : "bg-sky-100 text-sky-800"}`}>
                    {authUser.role}
                  </span>
                </div>
              )}
            </div>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition flex items-center gap-2 text-sm text-slate-600 font-semibold"
            >
              <Edit size={18} /> Edit Profile
            </button>
          )}

          <div className="mt-10 pt-8 border-t border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Security Settings</h3>
            <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-sm">
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type={showPassword.current ? "text" : "password"} name="currentPassword" placeholder="Current Password"
                  value={passwordData.currentPassword} onChange={handlePasswordInputChange} required
                  className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button type="button" onClick={() => setShowPassword((p) => ({ ...p, current: !p.current }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                  {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type={showPassword.new ? "text" : "password"} name="newPassword" placeholder="New Password"
                  value={passwordData.newPassword} onChange={handlePasswordInputChange} required
                  className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button type="button" onClick={() => setShowPassword((p) => ({ ...p, new: !p.new }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                  {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type={showPassword.confirm ? "text" : "password"} name="confirmPassword" placeholder="Confirm New Password"
                  value={passwordData.confirmPassword} onChange={handlePasswordInputChange} required
                  className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button type="button" onClick={() => setShowPassword((p) => ({ ...p, confirm: !p.confirm }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                  {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordError && (<p className="text-sm text-red-500">{passwordError}</p>)}
              {passwordSuccess && (<p className="text-sm text-green-600">{passwordSuccess}</p>)}
              <button type="submit" disabled={isSubmittingPassword}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 disabled:bg-slate-400"
              >
                {isSubmittingPassword ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

