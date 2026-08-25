import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ArrowLeft, X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { user, fetchUserProfile } = useAuth();
  const [editingField, setEditingField] = useState(null);
  const [editValues, setEditValues] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      setEditValues({ name: user.name || "", email: user.email || "" });
    }
  }, [user]);

  if (!user) return null;

  const handleSave = async (field) => {
    setLoading(true);
    try {
      const response = await axios.put("/api/auth/profile", {
        [field]: editValues[field],
      });

      if (response.data.success) {
        await fetchUserProfile();
        toast.success(`${field === "name" ? "Name" : "Email"} updated!`);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || `Failed to update ${field}`);
    } finally {
      setLoading(false);
      setEditingField(null);
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValues({ name: user?.name || "", email: user?.email || "" });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await axios.put("/api/auth/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Password changed successfully!");
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate("/")}
        className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="mr-1.5 w-4 h-4" />
        Back to Home
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">{user.name}</h1>
        <p className="text-gray-400">Manage your account</p>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-6">
        {/* Name field */}
        <div>
          <label className="text-sm font-medium text-gray-400 block mb-2">Full Name</label>
          {editingField === "name" ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={editValues.name}
                onChange={(e) => setEditValues((p) => ({ ...p, name: e.target.value }))}
                className="flex-1 px-4 py-2 bg-dark-hover border border-dark-border rounded-lg text-white focus:border-accent-purple focus:outline-none"
                placeholder="Enter your name"
              />
              <button
                onClick={() => handleSave("name")}
                disabled={loading}
                className="px-4 py-2 bg-gradient-to-r from-accent-purple to-accent-blue text-white rounded-lg hover:opacity-90 text-sm"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-dark-hover text-gray-300 rounded-lg hover:bg-dark-border text-sm"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-white">{user.name}</span>
              <button
                onClick={() => setEditingField("name")}
                className="text-sm text-accent-purple hover:text-accent-blue transition-colors"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        <hr className="border-dark-border" />

        {/* Email field */}
        <div>
          <label className="text-sm font-medium text-gray-400 block mb-2">Email</label>
          {editingField === "email" ? (
            <div className="flex gap-2">
              <input
                type="email"
                value={editValues.email}
                onChange={(e) => setEditValues((p) => ({ ...p, email: e.target.value }))}
                className="flex-1 px-4 py-2 bg-dark-hover border border-dark-border rounded-lg text-white focus:border-accent-purple focus:outline-none"
                placeholder="Enter your email"
              />
              <button
                onClick={() => handleSave("email")}
                disabled={loading}
                className="px-4 py-2 bg-gradient-to-r from-accent-purple to-accent-blue text-white rounded-lg hover:opacity-90 text-sm"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-dark-hover text-gray-300 rounded-lg hover:bg-dark-border text-sm"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-white">{user.email}</span>
              <button
                onClick={() => setEditingField("email")}
                className="text-sm text-accent-purple hover:text-accent-blue transition-colors"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        <hr className="border-dark-border" />

        {/* Password field */}
        <div>
          <label className="text-sm font-medium text-gray-400 block mb-2">Password</label>
          <div className="flex items-center justify-between">
            <span className="text-white font-mono tracking-widest">••••••••••</span>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="text-sm text-accent-purple hover:text-accent-blue transition-colors"
            >
              Change
            </button>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">Change Password</h2>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                }}
                className="p-1.5 hover:bg-dark-hover rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {[
                { label: "Current Password", key: "currentPassword" },
                { label: "New Password", key: "newPassword" },
                { label: "Confirm New Password", key: "confirmPassword" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    {label}
                  </label>
                  <input
                    type="password"
                    value={passwordData[key]}
                    onChange={(e) =>
                      setPasswordData((p) => ({ ...p, [key]: e.target.value }))
                    }
                    className="w-full px-4 py-2 bg-dark-hover border border-dark-border rounded-lg text-white focus:border-accent-purple focus:outline-none"
                    required
                  />
                </div>
              ))}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                  }}
                  className="flex-1 py-2.5 bg-dark-hover text-gray-300 rounded-lg hover:bg-dark-border transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-accent-purple to-accent-blue text-white rounded-lg hover:opacity-90 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Changing..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Profile;
