import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import BrandPanel from "../../components/BrandPanel";
import { admissionTracks } from "../../data/admission";
import { ArrowLeftIcon } from "../../components/Icons";

export default function CourseSelection() {
  const navigate = useNavigate();
  const [trackId, setTrackId] = useState(null);
  const [course, setCourse] = useState(null);

  const activeTrack = admissionTracks.find((t) => t.id === trackId);
  const canProceed = Boolean(trackId && course);

  function selectTrack(id) {
    setTrackId(id);
    setCourse(null);
    // A track with only one course (e.g. Mixed Track) selects itself.
    const track = admissionTracks.find((t) => t.id === id);
    if (track && track.courses.length === 1) {
      setCourse(track.courses[0]);
    }
  }

  function selectCourse(id, courseName) {
    setTrackId(id);
    setCourse(courseName);
  }

  function handleProceed() {
    if (!canProceed) return;
    navigate("/admission/apply", {
      state: { trackName: activeTrack.name, course },
    });
  }

  return (
    <div className="min-h-screen w-full flex bg-cod-bg overflow-hidden">
      <BrandPanel />

      <div className="flex-1 px-6 lg:px-16 py-10 md:py-14 pt-24 md:pt-14 max-w-4xl mx-auto w-full">
        <Link
          to="/welcome"
          className="focus-ring inline-flex items-center gap-1.5 text-cod-blue font-semibold text-sm mb-8 hover:text-cod-blue-dark transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back
        </Link>

        <div className="text-center mb-8 animate-fadeUp">
          <h1 className="text-slate-800 text-3xl font-bold mb-2">Purchase Admission Form</h1>
          <p className="text-slate-500">Select a track and course to purchase your admission form</p>
        </div>

        <div className="space-y-6">
          {admissionTracks.map((track, i) => {
            const isActive = track.id === trackId;
            return (
              <div
                key={track.id}
                style={{ animationDelay: `${i * 80}ms` }}
                className={`opacity-0 animate-fadeUp rounded-2xl border overflow-hidden transition-all duration-300 ${
                  isActive ? "border-transparent shadow-md" : "border-slate-200"
                }`}
              >
                <button
                  type="button"
                  onClick={() => selectTrack(track.id)}
                  className={`focus-ring w-full flex items-start gap-3 px-6 py-5 text-left transition-colors duration-300 ${
                    isActive ? "bg-cod-btn" : "bg-gradient-to-r from-blue-50/60 to-pink-50/60 hover:from-blue-50 hover:to-pink-50"
                  }`}
                >
                  <span
                    className={`mt-0.5 h-4 w-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                      isActive ? "border-white" : "border-cod-blue"
                    }`}
                  >
                    {isActive && <span className="h-2 w-2 rounded-full bg-white" />}
                  </span>
                  <span>
                    <span className={`block font-bold ${isActive ? "text-white" : "text-cod-blue"}`}>
                      {track.name}
                    </span>
                    <span className={`block text-sm ${isActive ? "text-blue-50" : "text-slate-500"}`}>
                      {track.description}
                    </span>
                  </span>
                </button>

                <div className={`px-6 py-4 flex flex-wrap gap-2.5 ${isActive ? "bg-white" : "bg-white"}`}>
                  {track.courses.map((c) => {
                    const isSelected = trackId === track.id && course === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => selectCourse(track.id, c)}
                        className={`focus-ring rounded-full px-4 py-2 text-sm font-medium transition-all duration-150 ${
                          isSelected
                            ? "bg-cod-btn text-white shadow-sm"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-8">
          {canProceed && (
            <p className="text-sm text-slate-600 mb-4 animate-fadeIn">
              Selected: <span className="font-semibold text-cod-blue">{course}</span> — {activeTrack.name}
            </p>
          )}
          <button
            type="button"
            disabled={!canProceed}
            onClick={handleProceed}
            className={`focus-ring rounded-full font-semibold px-8 py-3.5 shadow-md transition-all duration-200 ${
              canProceed
                ? "bg-cod-btn text-white hover:shadow-lg hover:brightness-105 active:scale-[0.98]"
                : "bg-cod-btn text-white/80 opacity-50 cursor-not-allowed"
            }`}
          >
            Proceed to Complete Application
          </button>
        </div>
      </div>
    </div>
  );
}
