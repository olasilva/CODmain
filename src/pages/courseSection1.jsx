import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PurchaseAdmission() {
  const [selectedTrack, setSelectedTrack] = useState('music'); // 'music', 'regular', or 'mixed'
  const [selectedCourse, setSelectedCourse] = useState('Piano');

  const tracks = [
    {
      id: 'music',
      title: 'Music Only Track',
      subtitle: 'Choose one instrument or vocal course',
      courses: [
        'Piano', 'Guitars', 'Ukulele', 'Violin', 
        'Viola', 'Cello', 'Flute', 'Saxophone', 
        'Trumpet', 'Drums', 'Vocals'
      ]
    },
    {
      id: 'regular',
      title: 'Regular Track',
      subtitle: 'Early childhood & primary education programmes',
      courses: [
        'Pre School', 'Discovery', 'Nursery 1', 'Nursery 2', 
        'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5'
      ]
    },
    {
      id: 'mixed',
      title: 'Mixed Track',
      subtitle: 'Combined music & academic programme',
      courses: ['Vocals & Piano']
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F9FF]">
      <Navbar />

      <main className="flex-1 flex flex-col md:flex-row w-full font-sans">
        
        {/* Left Sidebar Banner */}
        <div className="w-full md:w-[450px] min-h-[350px] md:min-h-full bg-gradient-to-b from-[#1A73E8] to-[#0F4082] flex flex-col items-center justify-center p-8 text-white text-center shadow-lg">
          <div className="flex flex-col items-center max-w-[370px] gap-7">
            <div className="w-[124px] h-[125px] rounded-xl overflow-hidden shadow-md">
              <img 
                src="https://placehold.co/124x125" 
                alt="Clan of David Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-wide uppercase leading-snug">
              Welcome to Clan of David Art and Music Academy
            </h1>
          </div>
        </div>

        {/* Right Form Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-[880px] flex flex-col gap-6">
            
            {/* Header & Back Button */}
            <div className="flex flex-col items-center text-center gap-2">
              <button 
                type="button" 
                onClick={() => window.history.back()}
                className="inline-flex items-center gap-2 text-[#1A73E8] text-sm hover:underline font-medium self-start md:self-auto"
              >
                <span className="w-4 h-4 border-2 border-[#1A73E8] rounded-sm rotate-45 border-r-0 border-t-0 inline-block -mr-1" />
                Back
              </button>
              
              <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A2E]">
                Purchase Admission Form
              </h2>
              <p className="text-black/50 text-sm">
                Select a track and course to purchase your admission form
              </p>
            </div>

            {/* Track Options List */}
            <div className="flex flex-col gap-4">
              {tracks.map((track) => {
                const isSelected = selectedTrack === track.id;

                return (
                  <div 
                    key={track.id}
                    className={`w-full rounded-2xl transition-all duration-200 overflow-hidden ${
                      isSelected 
                        ? 'bg-gradient-to-br from-[#EEF4FF] to-[#FFF0F8] ring-2 ring-[#1A73E8] shadow-[0px_4px_20px_rgba(26,115,232,0.15)]' 
                        : 'bg-white ring-2 ring-black/10 shadow-sm'
                    }`}
                  >
                    {/* Track Header Card */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTrack(track.id);
                        setSelectedCourse(track.courses[0]);
                      }}
                      className={`w-full px-5 py-4 text-left flex items-center gap-3 ${
                        isSelected 
                          ? 'bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] text-white' 
                          : 'bg-gradient-to-r from-[#1A73E8]/10 to-[#FF2E96]/10 text-[#1A73E8]'
                      }`}
                    >
                      {/* Radio Circle */}
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                        isSelected ? 'border-white' : 'border-[#1A73E8]'
                      }`}>
                        {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                      </div>

                      {/* Title & Subtitle */}
                      <div>
                        <h3 className={`text-base font-bold ${isSelected ? 'text-white' : 'text-[#1A73E8]'}`}>
                          {track.title}
                        </h3>
                        <p className={`text-xs ${isSelected ? 'text-white/85' : 'text-black/50'}`}>
                          {track.subtitle}
                        </p>
                      </div>
                    </button>

                    {/* Course Tags Container */}
                    <div className="p-5 flex flex-wrap gap-2">
                      {track.courses.map((course) => {
                        const isCourseActive = isSelected && selectedCourse === course;

                        return (
                          <button
                            key={course}
                            type="button"
                            onClick={() => {
                              setSelectedTrack(track.id);
                              setSelectedCourse(course);
                            }}
                            className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                              isCourseActive
                                ? 'bg-[#1A73E8] text-white font-medium shadow-sm'
                                : isSelected
                                ? 'bg-[#1A73E8]/10 text-[#1A73E8] hover:bg-[#1A73E8]/20'
                                : 'bg-black/5 text-black/60 hover:bg-black/10'
                            }`}
                          >
                            {course}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Submit Button */}
            <div className="flex justify-center pt-4">
              <button
                type="button"
                disabled={!selectedTrack || !selectedCourse}
                className={`w-full max-w-[420px] h-[56px] text-white font-bold text-lg rounded-full shadow-[4px_4px_6px_rgba(0,0,0,0.20)] transition-all duration-200 ${
                  selectedTrack && selectedCourse
                    ? 'bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] hover:opacity-90 opacity-100 cursor-pointer'
                    : 'bg-gradient-to-r from-[#A0BCE8] to-[#F0A0C8] opacity-50 cursor-not-allowed'
                }`}
              >
                Proceed to Complete Application
              </button>
            </div>

          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}