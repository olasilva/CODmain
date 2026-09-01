import React, { useState } from 'react';

export default function PurchaseAdmission() {
  const [selectedTrack, setSelectedTrack] = useState('regular');
  const [selectedCourse, setSelectedCourse] = useState('Nursery 1');

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

  const currentTrackTitle = tracks.find(t => t.id === selectedTrack)?.title || '';

  return (
    <div className="w-full min-h-screen bg-white flex flex-col justify-start items-start font-[#Ebrima]">
      <div className="w-full flex-1 flex flex-col md:flex-row min-h-screen overflow-hidden">
        
        {/* Left Sidebar Banner */}
        <div className="w-full md:w-[450px] bg-gradient-to-b from-[#1A73E8] to-[#0F4082] flex flex-col justify-center items-center p-10 text-white">
          <div className="flex flex-col justify-start items-center gap-7 text-center">
            <div className="w-[124px] h-[125px] rounded-xl overflow-hidden flex-shrink-0">
              <img 
                src="https://placehold.co/124x125" 
                alt="Academy Logo" 
                className="w-full h-[125px] object-cover" 
              />
            </div>
            <h1 className="w-full max-w-[370px] text-2xl md:text-[36px] md:leading-[54px] font-normal uppercase tracking-wide">
              Welcome to Clan of David Art and Music Academy
            </h1>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 bg-[#F5F9FF] p-6 md:p-10 flex flex-col justify-center items-center">
          
          {/* Header Section */}
          <div className="w-full max-w-[880px] pb-6 flex flex-col justify-start items-start">
            <button 
              type="button" 
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 text-[#1A73E8] text-sm font-normal hover:opacity-80 transition-opacity"
            >
              <span className="w-4 h-4 relative flex items-center justify-center">
                <span className="w-2.5 h-2.5 border-l-2 border-b-2 border-[#1A73E8] rotate-45 transform" />
              </span>
              Back
            </button>

            <div className="w-full pt-5 text-center">
              <h2 className="text-[#1A1A2E] text-2xl md:text-[26px] font-bold leading-[39px]">
                Purchase Admission Form
              </h2>
            </div>

            <div className="w-full pt-1 text-center">
              <p className="text-black/50 text-sm leading-[21px]">
                Select a track and course to purchase your admission form
              </p>
            </div>
          </div>

          {/* Tracks Selection List */}
          <div className="w-full max-w-[880px] flex flex-col gap-4">
            {tracks.map((track) => {
              const isTrackSelected = selectedTrack === track.id;

              return (
                <div 
                  key={track.id}
                  className={`w-full rounded-2xl flex flex-col justify-start items-start transition-all duration-200 overflow-hidden ${
                    isTrackSelected 
                      ? 'bg-gradient-to-br from-[#EEF4FF] to-[#FFF0F8] ring-2 ring-[#1A73E8] shadow-[0px_4px_20px_rgba(26,115,232,0.15)]' 
                      : 'bg-white ring-2 ring-black/10 shadow-[0px_2px_8px_rgba(0,0,0,0.06)]'
                  }`}
                >
                  {/* Track Header Header */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTrack(track.id);
                      setSelectedCourse(track.courses[0]);
                    }}
                    className={`w-full px-5 py-4 flex items-center gap-3 text-left transition-colors ${
                      isTrackSelected 
                        ? 'bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] text-white' 
                        : 'bg-gradient-to-r from-[#1A73E8]/10 to-[#FF2E96]/10 text-[#1A73E8]'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                      isTrackSelected ? 'border-white' : 'border-[#1A73E8]'
                    }`}>
                      {isTrackSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                    </div>

                    <div className="flex flex-col justify-start items-start">
                      <span className={`text-[15px] font-bold leading-[18.75px] ${
                        isTrackSelected ? 'text-white' : 'text-[#1A73E8]'
                      }`}>
                        {track.title}
                      </span>
                      <span className={`text-xs font-['Inter'] leading-[15px] pt-0.5 ${
                        isTrackSelected ? 'text-white/85' : 'text-black/50'
                      }`}>
                        {track.subtitle}
                      </span>
                    </div>
                  </button>

                  {/* Course Options Pills */}
                  <div className="w-full p-5 flex flex-wrap gap-2">
                    {track.courses.map((course) => {
                      const isCourseSelected = isTrackSelected && selectedCourse === course;

                      return (
                        <button
                          key={course}
                          type="button"
                          onClick={() => {
                            setSelectedTrack(track.id);
                            setSelectedCourse(course);
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-normal transition-all ${
                            isCourseSelected
                              ? 'bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] text-white shadow-sm'
                              : isTrackSelected
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

          {/* Action Footer */}
          <div className="w-full max-w-[880px] pt-7 flex flex-col items-center gap-3">
            <div className="text-sm text-center">
              <span className="text-black/55 font-normal">Selected: </span>
              <span className="text-[#1A73E8] font-bold">{selectedCourse}</span>
              <span className="text-black/55 font-normal"> — {currentTrackTitle}</span>
            </div>

            <button
              type="button"
              disabled={!selectedTrack || !selectedCourse}
              className="w-full max-w-[420px] h-[56px] bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] text-white font-bold text-lg rounded-full shadow-[4px_4px_6px_rgba(0,0,0,0.20)] hover:opacity-95 transition-opacity disabled:opacity-50"
            >
              Proceed to Complete Application
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}