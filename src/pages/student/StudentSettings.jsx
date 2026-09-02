// src/pages/student/StudentSettings.jsx
import React, { useState } from 'react';
import StudentSidebar from './components/StudentSidebar';
import StudentHeader from './components/Studentheader';

const settingsTabs = [
  { id: 'profile', icon: '👤', label: 'Profile Settings' },
  { id: 'security', icon: '🔒', label: 'Security' },
  { id: 'notifications', icon: '🔔', label: 'Notification Preferences' },
  { id: 'privacy', icon: '🛡️', label: 'Privacy' },
];

export default function StudentSettings() {
  const [activeTab, setActiveTab] = useState('privacy');
  const [profile, setProfile] = useState({
    firstName: 'Immanuel',
    lastName: 'Igbana',
    email: 'immanuel.igbana@student.clanofdavid.edu',
    phone: '+234 801 234 5678',
    bio: ''
  });

  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: true,
    activityStatus: true,
    readReceipts: true
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const togglePrivacySetting = (setting) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div>
            <h2 className="text-2xl font-bold text-black font-ebrima">Profile Settings</h2>

            {/* Profile Picture */}
            <div className="flex items-center gap-6 py-6 border-b border-black/10">
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-inter">
                I
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-bold hover:bg-blue-700 transition">
                  Change Photo
                </button>
                <button className="px-4 py-2 border border-black/20 rounded-full text-sm font-bold hover:bg-gray-50 transition">
                  Remove
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div>
                <label className="font-bold text-black text-sm block mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-3 border border-black/20 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="font-bold text-black text-sm block mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-3 border border-black/20 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-6">
              <label className="font-bold text-black text-sm block mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                className="w-full px-4 py-3 border border-black/20 rounded-xl focus:outline-none focus:border-blue-500"
              />
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

            <div className="pt-6 pb-6">
              <label className="font-bold text-black text-sm block mb-2">Bio</label>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleProfileChange}
                rows="4"
                className="w-full px-4 py-3 border border-black/20 rounded-xl focus:outline-none focus:border-blue-500 resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>

            <button className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition">
              Save Changes
            </button>
          </div>
        );

      case 'security':
        return (
          <div>
            <h2 className="text-2xl font-bold text-black font-ebrima">Security Settings</h2>

            <div className="pt-6 border-b border-black/10 pb-6">
              <h3 className="text-lg font-bold text-black font-ebrima">Change Password</h3>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="font-bold text-black text-sm block mb-2">Current Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-black/20 rounded-xl focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-black text-sm block mb-2">New Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-black/20 rounded-xl focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-black text-sm block mb-2">Confirm New Password</label>
                  <input
                    type="password"
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
              <div className="pt-4">
                <div className="p-4 border border-black/10 rounded-xl flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border border-black/10 rounded-lg flex items-center justify-center font-bold text-xl">
                      G
                    </div>
                    <div>
                      <p className="font-bold text-black">Google Account</p>
                      <p className="text-sm text-black/60">immanuel.igbana@gmail.com</p>
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
            <div className="space-y-4 pt-6">
              {[
                { id: 'assignments', label: 'Assignment Updates', desc: 'Get notified when new assignments are posted' },
                { id: 'grades', label: 'Grade Notifications', desc: 'Receive alerts when grades are published' },
                { id: 'classes', label: 'Class Reminders', desc: 'Reminders before your classes start' },
                { id: 'messages', label: 'Messages', desc: 'Notifications for new messages from instructors' },
                { id: 'announcements', label: 'Announcements', desc: 'School-wide announcements and updates' },
              ].map((item) => (
                <div key={item.id} className="p-4 border border-black/10 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="font-bold text-black">{item.label}</p>
                    <p className="text-sm text-black/60">{item.desc}</p>
                  </div>
                  <div className="w-11 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                    <div className="w-5 h-5 bg-white rounded-full absolute right-1 top-0.5 border border-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div>
            <h2 className="text-2xl font-bold text-black font-ebrima">Privacy Settings</h2>
            <div className="space-y-4 pt-6">
              {/* Profile Visibility */}
              <div className="p-4 border border-black/10 rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-bold text-black">Profile Visibility</p>
                  <p className="text-sm text-black/60">Who can see your profile information</p>
                </div>
                <button
                  onClick={() => togglePrivacySetting('profileVisibility')}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    privacySettings.profileVisibility ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${
                    privacySettings.profileVisibility ? 'right-1' : 'left-1'
                  } border border-white`} />
                </button>
              </div>

              {/* Activity Status */}
              <div className="p-4 border border-black/10 rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-bold text-black">Activity Status</p>
                  <p className="text-sm text-black/60">Show when you're online</p>
                </div>
                <button
                  onClick={() => togglePrivacySetting('activityStatus')}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    privacySettings.activityStatus ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${
                    privacySettings.activityStatus ? 'right-1' : 'left-1'
                  } border border-white`} />
                </button>
              </div>

              {/* Read Receipts */}
              <div className="p-4 border border-black/10 rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-bold text-black">Read Receipts</p>
                  <p className="text-sm text-black/60">Let others know when you've read their messages</p>
                </div>
                <button
                  onClick={() => togglePrivacySetting('readReceipts')}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    privacySettings.readReceipts ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${
                    privacySettings.readReceipts ? 'right-1' : 'left-1'
                  } border border-white`} />
                </button>
              </div>

              {/* Danger Zone */}
              <div className="pt-4">
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
            </div>
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

            <div className="flex gap-6 pt-8">
              {/* Sidebar Tabs */}
              <div className="w-[250px] min-w-[250px] space-y-2">
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
              <div className="flex-1 bg-white rounded-3xl border border-black/5 p-8">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}