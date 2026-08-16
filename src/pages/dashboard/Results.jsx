import { useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import StatusBadge from "../../components/dashboard/StatusBadge";
import ReportCardPreview from "../../components/dashboard/ReportCardPreview";
import { student, resultsByTerm } from "../../data/student";

const terms = Object.keys(resultsByTerm);

export default function Results() {
  const [activeTerm, setActiveTerm] = useState(terms[0]);
  const [openSubject, setOpenSubject] = useState(null);
  const [showReport, setShowReport] = useState(false);

  const data = resultsByTerm[activeTerm];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6 animate-fadeUp">
          <div>
            <h1 className="text-slate-900 text-3xl font-bold mb-1">Academic Results</h1>
            <p className="text-slate-500 text-sm">
              {student.name} • {student.className} • Session {student.session} • ID: {student.studentId}
            </p>
          </div>
          <button
            type="button"
            disabled={!data}
            onClick={() => setShowReport(true)}
            className={`focus-ring rounded-full font-semibold text-sm px-5 py-2.5 transition-all duration-200 ${
              data
                ? "border border-slate-200 text-slate-700 hover:border-slate-300"
                : "border border-slate-200 text-slate-300 cursor-not-allowed"
            }`}
          >
            ⬇ Download Report
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-8 animate-fadeUp">
          {terms.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActiveTerm(t)}
              className={`focus-ring rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${
                activeTerm === t
                  ? "bg-cod-blue text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
              }`}
            >
              {t}
            </button>
          ))}
          <span className="text-slate-400 text-sm ml-2">Academic Session: {student.session}</span>
        </div>

        {!data ? (
          <div className="rounded-2xl bg-white border border-slate-200 px-8 py-16 text-center animate-fadeUp">
            <p className="text-slate-500">
              Results for <span className="font-semibold text-slate-700">{activeTerm}</span> haven't been
              recorded yet — add them in <code className="text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">src/data/student.js</code>.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <SummaryTile highlight value={`${data.average}%`} label="Term Average" />
              <SummaryTile value={data.grade} label="Overall Grade" />
              <SummaryTile value={data.position} label={`Position of ${data.positionOf}`} />
              <SummaryTile value={data.subjectsOffered} label="Subjects Offered" />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-slate-800 font-bold text-lg">Subject Results — {activeTerm}</h2>
                  <span className="text-slate-400 text-xs">Click "Details" to view score breakdown</span>
                </div>

                <div className="space-y-4">
                  {data.subjects.map((s, i) => {
                    const isOpen = openSubject === s.code;
                    return (
                      <div
                        key={s.code}
                        style={{ animationDelay: `${i * 40}ms` }}
                        className="opacity-0 animate-fadeUp rounded-2xl bg-white border border-slate-200 p-5"
                      >
                        <div className="flex items-center gap-4">
                          <span className={`h-10 w-10 rounded-full ${s.color} text-white font-bold flex items-center justify-center shrink-0`}>
                            {s.grade}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-slate-800 font-bold">{s.name}</p>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-slate-800 font-bold">{s.total}/100</span>
                                <StatusBadge>{s.remark}</StatusBadge>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-slate-400 text-xs shrink-0">{s.code}</span>
                              <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${s.color} transition-all duration-700`}
                                  style={{ width: `${s.total}%` }}
                                />
                              </div>
                              <span className="text-slate-400 text-xs shrink-0">{s.total}%</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setOpenSubject(isOpen ? null : s.code)}
                            className="focus-ring shrink-0 rounded-full border border-slate-200 text-slate-600 text-xs font-semibold px-3.5 py-1.5 hover:border-slate-300 transition-colors"
                          >
                            Details {isOpen ? "▲" : "▼"}
                          </button>
                        </div>

                        {isOpen && (
                          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-4 text-sm animate-fadeIn">
                            <ScoreCell label="1st C.A. (20)" value={s.ca1} />
                            <ScoreCell label="2nd C.A. (20)" value={s.ca2} />
                            <ScoreCell label="Exam (60)" value={s.exam} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl bg-white border border-slate-200 p-6 animate-fadeUp">
                  <p className="text-slate-800 font-bold mb-3">Term Performance</p>
                  <p className="text-cod-blue text-4xl font-bold mb-1">
                    {data.average}%
                    <span className="text-slate-400 text-sm font-normal ml-2">Term Average</span>
                  </p>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden mb-2">
                    <div className="h-full rounded-full bg-cod-blue transition-all duration-700" style={{ width: `${data.average}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{data.grade} — Distinction</span>
                    <span>Position: {data.position} of {data.positionOf}</span>
                  </div>
                </div>

                <div className="rounded-2xl bg-white border border-slate-200 p-6 animate-fadeUp" style={{ animationDelay: "60ms" }}>
                  <p className="text-slate-800 font-bold mb-4">Grade Distribution</p>
                  <div className="space-y-3">
                    {Object.entries(data.gradeDistribution).map(([label, count]) => {
                      const max = Math.max(...Object.values(data.gradeDistribution), 1);
                      return (
                        <div key={label} className="flex items-center gap-3 text-sm">
                          <span className="text-slate-500 w-32 shrink-0">{label}</span>
                          <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-cod-blue transition-all duration-700"
                              style={{ width: `${(count / max) * 100}%` }}
                            />
                          </div>
                          <span className="text-slate-700 font-semibold w-4 text-right shrink-0">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-2xl bg-white border border-slate-200 p-6 animate-fadeUp" style={{ animationDelay: "120ms" }}>
                  <p className="text-slate-800 font-bold mb-4">Highlights</p>
                  <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 mb-3">
                    <p className="text-emerald-700 text-xs font-bold uppercase tracking-wide mb-1">Best Subject</p>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-800 font-semibold text-sm">{data.bestSubject.name}</span>
                      <span className="text-emerald-700 font-bold text-sm">{data.bestSubject.score}%</span>
                    </div>
                  </div>
                  <div className="rounded-xl bg-orange-50 border border-orange-100 px-4 py-3">
                    <p className="text-orange-700 text-xs font-bold uppercase tracking-wide mb-1">Needs Attention</p>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-800 font-semibold text-sm">{data.needsAttention.name}</span>
                      <span className="text-orange-700 font-bold text-sm">{data.needsAttention.score}%</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-blue-50 border border-blue-100 p-6 animate-fadeUp" style={{ animationDelay: "180ms" }}>
                  <p className="text-cod-blue font-bold mb-2">Class Teacher's Remark</p>
                  <p className="text-slate-700 text-sm leading-relaxed mb-2">{data.teacherRemark.text}</p>
                  <p className="text-slate-400 text-xs">— {data.teacherRemark.teacher.split(",")[0]}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {showReport && data && (
        <ReportCardPreview term={activeTerm} data={data} onClose={() => setShowReport(false)} />
      )}
    </DashboardLayout>
  );
}

function SummaryTile({ value, label, highlight }) {
  return (
    <div className={`rounded-2xl px-6 py-6 border ${highlight ? "bg-cod-blue border-cod-blue text-white" : "bg-white border-slate-200 text-slate-800"}`}>
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className={`text-sm ${highlight ? "text-blue-100" : "text-slate-500"}`}>{label}</p>
    </div>
  );
}

function ScoreCell({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2.5 text-center">
      <p className="text-slate-800 font-bold">{value}</p>
      <p className="text-slate-400 text-xs mt-0.5">{label}</p>
    </div>
  );
}
