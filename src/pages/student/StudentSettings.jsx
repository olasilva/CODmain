// src/pages/student/StudentSettings.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from './components/StudentSidebar';
import StudentHeader from './components/Studentheader';
import { getSettings, updateSettings, updateProfile, getCurrentUser } from '../../lib/api';
import { getSession, isLoggedIn } from '../../lib/api';

const settingsTabs = [
  { id: 'profile', icon: '👤', label: 'Profile Settings' },
  { id: 'security', icon: '🔒', label: 'Security' },
  { id: 'notifications', icon: '🔔', label: 'Notification Preferences' },
  { id: 'privacy', icon: '🛡️', label: 'Privacy' },
];

export default function StudentSettings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    avatar_url: '',
  });

  const [settings, setSettings] = useState({
    email_notifications: true,
    sms_notifications: false,
    language: 'en',
    timezone: 'Africa/Lagos',
    theme: 'light',
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: true,
    activityStatus: true,
    readReceipts: true
  });

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }
    fetchSettings();
  }, [navigate]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const [userData, settingsData] = await Promise.all([
        getCurrentUser(),
        getSettings()
      ]);
      
      if (userData?.user) {
        setProfile(prev => ({
          ...prev,
          fullName: userData.user.fullName || '',
          email: userData.user.email || '',
          phone: userData.user.phone || '',
          address: userData.user.address || '',
          avatar_url: userData.user.avatar_url || '',
        }));
      }
      
      if (settingsData) {
        setSettings(settingsData);
        if (settingsData.privacy_settings) {
          setPrivacySettings(settingsData.privacy_settings);
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSettingsToggle = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const togglePrivacySetting = (setting) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      await updateProfile({
        full_name: profile.fullName,
        phone: profile.phone,
        address: profile.address
      });
      
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      await updateSettings({
        ...settings,
        privacy_settings: privacySettings
      });
      
      setSuccess('Settings updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div>
            <h2 className="text-2xl font-bold text-black font-ebrima">Profile Settings</h2>
            
            {success && (
              <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                {success}
              </div>
            )}
            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {/* Profile Picture */}
            <div className="flex items-center gap-6 py-6 border-b border-black/10 flex-wrap">
              <div className="w-24 h-24 rounded-full flex items-center justify-center text-white text-4xl font-inter bg-blue-600 overflow-hidden">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  profile.fullName?.charAt(0)?.toUpperCase() || 'U'
                )}
              </div>
              <div className="flex gap-3 flex-wrap">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-bold hover:bg-blue-700 transition">
                  Change Photo
                </button>
                <button className="px-4 py-2 border border-black/20 rounded-full text-sm font-bold hover:bg-gray-50 transition">
                  Remove
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              <div>
                <label className="font-bold text-black text-sm block mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-3 border border-black/20 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="font-bold text-black text-sm block mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  disabled
                  className="w-full px-4 py-3 border border-black/20 rounded-xl bg-gray-50 text-gray-500"
                />
              </div>
            </div>

            <div className="pt-6">
              <label className="font-bold text-black text-sm block mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleProfileChange}
                className="w-full px-4 py-3 border border-black/20 rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="pt-6">
              <label className="font-bold text-black text-sm block mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={profile.address}
                onChange={handleProfileChange}
                className="w-full px-4 py-3 border border-black/20 rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>

            <button 
              onClick={handleSaveProfile}
              disabled={saving}
              className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        );

      case 'security':
        return (
          <div>
            <h2 className="text-2xl font-bold text-black font-ebrima">Security Settings</h2>

            <div className="pt-6 border-b border-black/10 pb-6">
              <h3 className="text-lg font-bold text-black font-ebrima">Change Password</h3>
              <div className="space-y-4 pt-4 max-w-md">
                <div>
                  <label className="font-bold text-black text-sm block mb-2">Current Password</label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    className="w-full px-4 py-3 border border-black/20 rounded-xl focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-black text-sm block mb-2">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 border border-black/20 rounded-xl focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-black text-sm block mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 border border-black/20 rounded-xl focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-bold hover:bg-blue-700 transition">
                  Update Password
                </button>
              </div>
            </div>

            <div className="pt-6">
              <h3 className="text-lg font-bold text-black font-ebrima">Connected Accounts</h3>
              <div className="pt-4 max-w-md">
                <div className="p-4 border border-black/10 rounded-xl flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border border-black/10 rounded-lg flex items-center justify-center font-bold text-xl">
                      G
                    </div>
                    <div>
                      <p className="font-bold text-black">Google Account</p>
                      <p className="text-sm text-black/60">{profile.email}</p>
                    </div>
                  </div>
                  <button className="text-red-500 font-semibold text-sm">Disconnect</button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div>
            <h2 className="text-2xl font-bold text-black font-ebrima">Notification Preferences</h2>
            
            {success && (
              <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                {success}
              </div>
            )}
            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            
            <div className="space-y-4 pt-6 max-w-2xl">
              {[
                { id: 'email_notifications', label: 'Email Notifications', desc: 'Receive updates via email' },
                { id: 'sms_notifications', label: 'SMS Notifications', desc: 'Receive updates via SMS' },
              ].map((item) => (
                <div key={item.id} className="p-4 border border-black/10 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="font-bold text-black">{item.label}</p>
                    <p className="text-sm text-black/60">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => handleSettingsToggle(item.id)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      settings[item.id] ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${
                      settings[item.id] ? 'right-1' : 'left-1'
                    } border border-white`} />
                  </button>
                </div>
              ))}
            </div>
            
            <button 
              onClick={handleSaveSettings}
              disabled={saving}
              className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        );

      case 'privacy':
        return (
          <div>
            <h2 className="text-2xl font-bold text-black font-ebrima">Privacy Settings</h2>
            
            {success && (
              <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                {success}
              </div>
            )}
            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            
            <div className="space-y-4 pt-6 max-w-2xl">
              {[
                { id: 'profileVisibility', label: 'Profile Visibility', desc: 'Who can see your profile information' },
                { id: 'activityStatus', label: 'Activity Status', desc: 'Show when you\'re online' },
                { id: 'readReceipts', label: 'Read Receipts', desc: 'Let others know when you\'ve read their messages' },
              ].map((item) => (
                <div key={item.id} className="p-4 border border-black/10 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="font-bold text-black">{item.label}</p>
                    <p className="text-sm text-black/60">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => togglePrivacySetting(item.id)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      privacySettings[item.id] ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${
                      privacySettings[item.id] ? 'right-1' : 'left-1'
                    } border border-white`} />
                  </button>
                </div>
              ))}
            </div>

            {/* Danger Zone */}
            <div className="pt-6 max-w-2xl">
              <div className="p-6 bg-red-50 rounded-xl border border-red-200">
                <h3 className="text-lg font-bold text-red-700 font-ebrima">Danger Zone</h3>
                <p className="text-sm text-red-600 font-ebrima pt-2 pb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button className="px-6 py-2 border border-red-500 text-red-500 rounded-full text-sm font-bold hover:bg-red-50 transition">
                  Deactivate Account
                </button>
              </div>
            </div>

            <button 
              onClick={handleSaveSettings}
              disabled={saving}
              className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Privacy Settings'}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      <StudentSidebar activeItem="Settings" />
      <div className="flex-1 ml-[300px]">
        <StudentHeader />
        <div className="max-w-[1140px] mx-auto px-8 py-6">
          <div className="bg-white rounded-3xl p-8">
            <h1 className="text-[36px] font-bold text-black font-ebrima leading-[54px]">
              Settings
            </h1>
            <p className="text-base text-black/60 font-ebrima pt-2">
              Manage your account settings and preferences
            </p>

            <div className="flex flex-col lg:flex-row gap-6 pt-8">
              {/* Sidebar Tabs */}
              <div className="w-full lg:w-[250px] lg:min-w-[250px] space-y-2">
                {settingsTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-black border border-black/10 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xl">{tab.icon}</span>
                    <span className="text-sm font-ebrima">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Content Area */}
              <div className="flex-1 bg-white rounded-3xl border border-black/5 p-6 md:p-8">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}