import Logo from "../Logo";
import { student, gradingKey } from "../../data/student";

/**
 * Print-style report card, shown as a modal from the Results page's
 * "Download Report" button. "Print / Save PDF" uses the browser's native
 * print dialog (which offers "Save as PDF") rather than generating a PDF
 * client-side — swap in a real PDF export if you need one server-side.
 */
export default function ReportCardPreview({ term, data, onClose }) {
  function handlePrint() {
    window.print();
  }

  async function handleShare() {
    const shareData = {
      title: `${student.name} — Report Card (${term})`,
      text: `${student.name}'s ${term} report card — ${data.average}% average, Grade ${data.grade}.`,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        /* user cancelled — no-op */
      }
    } else {
      // Fallback for browsers without the Web Share API.
      alert("Sharing isn't supported in this browser — use Print / Save PDF instead.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-start justify-center overflow-y-auto p-4 md:p-8 animate-fadeIn print:visible-block print:bg-white print:p-0">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-scaleIn print:shadow-none print:rounded-none">
        {/* Modal header — hidden when printing */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 print:hidden">
          <div>
            <h2 className="text-slate-900 font-bold text-lg">Report Card Preview</h2>
            <p className="text-slate-500 text-sm">
              {student.name} · {term} · Session {student.session}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleShare}
              className="focus-ring rounded-full border border-slate-200 text-slate-700 font-semibold text-sm px-4 py-2 hover:border-slate-300 transition-colors"
            >
              ⇗ Share
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="focus-ring rounded-full bg-cod-blue text-white font-semibold text-sm px-4 py-2 hover:brightness-105 transition-all"
            >
              🖨 Print / Save PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="focus-ring h-9 w-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable content */}
        <div className="px-6 md:px-8 py-6 max-h-[75vh] overflow-y-auto print:max-h-none print:overflow-visible">
          <div className="flex items-center justify-between pb-4 border-b-2 border-cod-blue mb-6">
            <div className="flex items-center gap-3">
              <Logo className="h-11 w-11" />
              <div>
                <p className="text-cod-blue font-bold text-lg leading-tight">Clan of David International School</p>
                <p className="text-slate-400 text-xs">Skilfully Educated</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-slate-800 font-bold">Academic Report Card</p>
              <p className="text-slate-400 text-xs">
                {term} · Session {student.session}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
            <InfoField label="Student Name" value={student.name} />
            <InfoField label="Class" value={student.className} />
            <InfoField label="Student ID" value={student.studentId} />
            <InfoField label="Academic Session" value={student.session} />
            <InfoField label="Class Teacher" value={data.teacherRemark.teacher.split(",")[0]} />
            <InfoField label="Date Issued" value={data.dateIssued} />
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <SummaryCard highlight value={`${data.average}%`} label="Term Average" />
            <SummaryCard value={data.grade} label="Distinction" />
            <SummaryCard value={data.position} label={`of ${data.positionOf} students`} />
            <SummaryCard value={data.subjectsOffered} label="Subjects Offered" />
          </div>

          <p className="text-slate-800 font-bold mb-3">Subject Performance — {term}</p>
          <div className="rounded-xl overflow-hidden border border-slate-200 mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cod-blue text-white text-left">
                  <th className="px-4 py-3 font-semibold">Subject</th>
                  <th className="px-3 py-3 font-semibold">Code</th>
                  <th className="px-3 py-3 font-semibold">1st C.A. (20)</th>
                  <th className="px-3 py-3 font-semibold">2nd C.A. (20)</th>
                  <th className="px-3 py-3 font-semibold">Exam (60)</th>
                  <th className="px-3 py-3 font-semibold">Total (100)</th>
                  <th className="px-3 py-3 font-semibold">Grade</th>
                  <th className="px-3 py-3 font-semibold">Remark</th>
                </tr>
              </thead>
              <tbody>
                {data.subjects.map((s, i) => (
                  <tr key={s.code} className={i % 2 ? "bg-slate-50" : "bg-white"}>
                    <td className="px-4 py-2.5 font-semibold text-slate-800">{s.name}</td>
                    <td className="px-3 py-2.5 text-slate-500">{s.code}</td>
                    <td className="px-3 py-2.5 text-slate-600">{s.ca1}</td>
                    <td className="px-3 py-2.5 text-slate-600">{s.ca2}</td>
                    <td className="px-3 py-2.5 text-slate-600">{s.exam}</td>
                    <td className="px-3 py-2.5 font-bold text-slate-800">{s.total}</td>
                    <td className="px-3 py-2.5 font-bold text-cod-blue">{s.grade}</td>
                    <td className="px-3 py-2.5 text-cod-blue">{s.remark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-slate-500 mb-6">
            <span className="font-semibold text-slate-700">Grading Key:</span>
            {gradingKey.map((g) => (
              <span key={g.grade}>
                <span className={`font-bold ${g.color}`}>{g.grade} — {g.label}</span> ({g.range})
              </span>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-5 py-4">
              <p className="text-emerald-700 text-xs font-bold uppercase tracking-wide mb-1">Best Subject</p>
              <p className="text-slate-800 font-bold">{data.bestSubject.name}</p>
              <p className="text-emerald-700 text-sm">{data.bestSubject.score}/100 — Distinction</p>
            </div>
            <div className="rounded-xl bg-orange-50 border border-orange-100 px-5 py-4">
              <p className="text-orange-700 text-xs font-bold uppercase tracking-wide mb-1">Needs Attention</p>
              <p className="text-slate-800 font-bold">{data.needsAttention.name}</p>
              <p className="text-orange-700 text-sm">{data.needsAttention.score}/100 — Credit</p>
            </div>
          </div>

          <div className="rounded-xl bg-blue-50 border border-blue-100 px-5 py-4 mb-8">
            <p className="text-cod-blue font-bold text-sm mb-1.5">Class Teacher's Remark</p>
            <p className="text-slate-700 text-sm leading-relaxed mb-2">{data.teacherRemark.text}</p>
            <p className="text-slate-400 text-xs">— {data.teacherRemark.teacher}</p>
          </div>

          <div className="grid grid-cols-3 gap-6 text-center text-xs text-slate-400 mb-2">
            <div className="border-t border-slate-300 pt-2">Class Teacher's Signature</div>
            <div className="border-t border-slate-300 pt-2">Head Teacher's Signature</div>
            <div className="border-t border-slate-300 pt-2">Parent / Guardian's Signature</div>
          </div>
          <p className="text-center text-xs text-slate-300 mt-4">
            Clan of David International School · Confidential Academic Document
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoField({ label, value }) {
  return (
    <div>
      <p className="text-slate-400 text-xs uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-slate-800 font-semibold">{value}</p>
    </div>
  );
}

function SummaryCard({ value, label, highlight }) {
  return (
    <div className={`rounded-xl px-4 py-4 ${highlight ? "bg-cod-blue text-white" : "bg-slate-50 text-slate-800"}`}>
      <p className="text-2xl font-bold mb-0.5">{value}</p>
      <p className={`text-xs ${highlight ? "text-blue-100" : "text-slate-500"}`}>{label}</p>
    </div>
  );
}
