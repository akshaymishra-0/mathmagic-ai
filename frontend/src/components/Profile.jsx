import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, User, Mail, Lock, Edit2, Check, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { user, fetchUserProfile } = useAuth();
  const [editingField, setEditingField] = useState(null);
  const [editValues, setEditValues] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  useEffect(() => {
    if (user) {
      setEditValues({
        name: user.name || '',
        email: user.email || '',
        password: ''
      });
    }
  }, [user]);

  const handleEdit = (field) => {
    setEditingField(field);
    setEditValues(prev => ({
      ...prev,
      [field]: user[field] || ''
    }));
  };

  const handleSave = async (field) => {
    setLoading(true);

    try {
      if (field === 'name' || field === 'email') {
        const response = await axios.put('/api/auth/profile', {
          [field]: editValues[field]
        });

        if (response.data.success) {
          // Refresh user data
          await fetchUserProfile();
          toast.success(`${field === 'name' ? 'Name' : 'Email'} updated successfully!`);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.error || `Failed to update ${field}`);
    } finally {
      setLoading(false);
    }

    setEditingField(null);
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValues({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleChangePassword = () => {
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put('/api/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (response.data.success) {
        toast.success('Password changed successfully!');
        setShowPasswordModal(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <main className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base text-white font-semibold hover:text-accent-purple transition-colors duration-300"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to Home
        </button>
      </div>

      {/* Profile Header */}
      <div className="text-center mb-12">
        <div className="inline-block p-4 bg-gradient-to-br from-accent-purple/20 to-accent-blue/20 rounded-full mb-6">
          <User className="w-16 h-16 text-accent-purple" />
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-accent-purple to-accent-blue bg-clip-text text-transparent mb-2">
          {user?.name || 'User'}
        </h1>
        <p className="text-gray-400">Manage your account information</p>
      </div>

      {/* Profile Information */}
      <div className="bg-gradient-to-br from-dark-card/50 to-dark-card/30 backdrop-blur-sm rounded-2xl border border-dark-border/50 p-8">
        <div className="space-y-8">
          {/* Full Name */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="p-3 bg-accent-purple/10 rounded-lg">
                <User className="w-6 h-6 text-accent-purple" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white">Full Name</h3>
                <p className="text-gray-400">Your display name</p>
              </div>
            </div>
            <div className="flex-1 max-w-md md:ml-8">
              {editingField === 'name' ? (
                <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2 sm:space-y-0">
                  <input
                    type="text"
                    value={editValues.name}
                    onChange={(e) => setEditValues(prev => ({ ...prev, name: e.target.value }))}
                    className="flex-1 px-4 py-2 bg-dark-hover border border-dark-border rounded-lg text-white focus:border-accent-purple focus:outline-none"
                    placeholder="Enter your full name"
                  />
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handleSave('name')}
                      className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-gradient-to-r from-accent-purple to-accent-blue text-white rounded-lg hover:from-accent-purple/90 hover:to-accent-blue/90 transition-all shadow-lg hover:shadow-xl"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{user.name}</span>
                  <button
                    onClick={() => handleEdit('name')}
                    className="p-2 text-gray-400 hover:text-accent-purple transition-colors"
                    title="Edit name"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="p-3 bg-accent-blue/10 rounded-lg">
                <Mail className="w-6 h-6 text-accent-blue" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white">Email Address</h3>
                <p className="text-gray-400">Your login email</p>
              </div>
            </div>
            <div className="flex-1 max-w-md md:ml-8">
              {editingField === 'email' ? (
                <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2 sm:space-y-0">
                  <input
                    type="email"
                    value={editValues.email}
                    onChange={(e) => setEditValues(prev => ({ ...prev, email: e.target.value }))}
                    className="flex-1 px-4 py-2 bg-dark-hover border border-dark-border rounded-lg text-white focus:border-accent-blue focus:outline-none"
                    placeholder="Enter your email"
                  />
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handleSave('email')}
                      className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-gradient-to-r from-accent-purple to-accent-blue text-white rounded-lg hover:from-accent-purple/90 hover:to-accent-blue/90 transition-all shadow-lg hover:shadow-xl"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{user.email}</span>
                  <button
                    onClick={() => handleEdit('email')}
                    className="p-2 text-gray-400 hover:text-accent-blue transition-colors"
                    title="Edit email"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="p-3 bg-accent-green/10 rounded-lg">
                <Lock className="w-6 h-6 text-accent-green" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white">Password</h3>
                <p className="text-gray-400">Your account password</p>
              </div>
            </div>
            <div className="flex-1 max-w-md md:ml-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-mono">••••••••••••</span>
                </div>
                <button
                  onClick={handleChangePassword}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-gradient-to-r from-accent-purple to-accent-blue text-white rounded-lg hover:from-accent-purple/90 hover:to-accent-blue/90 transition-all shadow-lg hover:shadow-xl"
                >
                  Change
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-dark-card border border-dark-border rounded-2xl p-8 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-white">Change Password</h2>
              <button
                onClick={handleClosePasswordModal}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full px-4 py-2 bg-dark-hover border border-dark-border rounded-lg text-white focus:border-accent-purple focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full px-4 py-2 bg-dark-hover border border-dark-border rounded-lg text-white focus:border-accent-purple focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-4 py-2 bg-dark-hover border border-dark-border rounded-lg text-white focus:border-accent-purple focus:outline-none"
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:space-x-3 sm:space-y-0 pt-4">
                <button
                  type="button"
                  onClick={handleClosePasswordModal}
                  className="flex-1 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base bg-gradient-to-r from-accent-purple to-accent-blue text-white rounded-lg hover:from-accent-purple/90 hover:to-accent-blue/90 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Changing...' : 'Change Password'}
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