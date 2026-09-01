// src/pages/application.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Application() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    programme: '',
    experience: '',
    comments: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your application submission logic here
    console.log('Application submitted:', formData);
    // Navigate to create account
    navigate('/admission/create-account');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F9FF]">
      <Navbar />

      <main className="flex-1 py-8 md:py-12 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#0F4082] mb-2">
              Purchase Admission Form
            </h1>
            <p className="text-gray-600">
              Fill in the details below to purchase your admission form
            </p>
          </div>

          {/* Application Form */}
          <div className="bg-white rounded-3xl border border-black/30 p-6 md:p-10 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 outline-none transition"
                    placeholder="Enter first name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 outline-none transition"
                    placeholder="Enter last name"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 outline-none transition"
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 outline-none transition"
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 outline-none transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Programme Interested In *
                  </label>
                  <select
                    name="programme"
                    value={formData.programme}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 outline-none transition bg-white"
                    required
                  >
                    <option value="">Select a programme</option>
                    <option value="music">Music Track</option>
                    <option value="regular">Regular Track</option>
                    <option value="mixed">Mixed Track</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Previous Experience (Optional)
                </label>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 outline-none transition resize-y min-h-[80px]"
                  placeholder="Tell us about any previous musical or academic experience..."
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Additional Comments (Optional)
                </label>
                <textarea
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 outline-none transition resize-y min-h-[80px]"
                  placeholder="Any special requirements or additional notes..."
                  rows="3"
                />
              </div>

              <div className="flex items-start gap-3 pt-4 border-t border-gray-200">
                <input
                  type="checkbox"
                  className="w-5 h-5 mt-0.5 rounded border-gray-300 text-[#1A73E8] focus:ring-[#1A73E8]/20"
                  required
                />
                <label className="text-sm text-gray-600">
                  I confirm that all information provided is accurate and I agree to the{' '}
                  <Link to="/terms" className="text-[#1A73E8] hover:underline font-medium">
                    Terms and Conditions
                  </Link>
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  className="flex-1 h-[56px] bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] hover:opacity-95 transition-opacity duration-200 text-white font-bold text-lg rounded-full shadow-[4px_4px_12px_rgba(0,0,0,0.20)]"
                >
                  Create Account
                </button>
                <Link
                  to="/enroll"
                  className="flex-1 h-[56px] bg-gray-200 hover:bg-gray-300 transition-colors duration-200 text-gray-700 font-bold text-lg rounded-full flex items-center justify-center"
                >
                  Cancel
                </Link>
              </div>

              <p className="text-xs text-gray-400 text-center">
                * Required fields. You'll create your account in the next step.
              </p>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}