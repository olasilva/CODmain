// src/pages/admin/components/ResultSheet.jsx
export default function ResultSheet({ data }) {
  if (!data) return null;

  const subjects = data.subjects || [];
  const psychomotor = data.psychomotor || {};

  const rows = [
    ['Attendance', psychomotor.attendance],
    ['Handwriting', psychomotor.handwriting],
    ['Appearance', psychomotor.appearance],
    ['Sport', psychomotor.sport],
    ['Drawing', psychomotor.drawing],
    ['Music and art', psychomotor.music_art],
    ['Punctuality', psychomotor.punctuality],
    ['Neatness', psychomotor.neatness],
    ['Politeness', psychomotor.politeness],
    ['Sociability', psychomotor.sociability],
    ['Health habit', psychomotor.health_habit],
    ['Emotional stability', psychomotor.emotional],
    ['Attentiveness', psychomotor.attentiveness],
    ['Group work', psychomotor.group_work],
  ];

  const fmtDate = (d) => {
    if (!d) return '—';
    try {
      return new Date(d).toLocaleDateString('en-NG', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return d;
    }
  };

  return (
    <div
      className="relative bg-white mx-auto"
      style={{
        width: '100%',
        maxWidth: '1100px',
        padding: '24px',
        fontFamily: 'Arial, sans-serif',
        color: '#000',
        border: '2px solid #1a1a1a',
      }}
    >
      {/* Watermark */}
      <div
        className="pointer-events-none select-none absolute inset-0 flex items-center justify-center overflow-hidden"
        style={{
          fontSize: '110px',
          fontWeight: 'bold',
          color: 'rgba(26, 115, 232, 0.06)',
          transform: 'rotate(-30deg)',
          whiteSpace: 'nowrap',
        }}
      >
        CLAN OF DAVID
      </div>

      {/* Header */}
      <div className="relative flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 text-center" style={{ marginLeft: '80px' }}>
          <h1 style={{ color: '#1A73E8', fontSize: '20px', fontWeight: 800, letterSpacing: '0.5px' }}>
            CLAN OF DAVID ART AND MUSIC ACADEMY
          </h1>
          <p style={{ fontStyle: 'italic', fontSize: '11px', marginTop: '2px' }}>
            Family of Music Makers
          </p>
          <p style={{ fontSize: '10px', marginTop: '4px' }}>
            No 1, (H) 21 Road, Off Chukwu Okafor St. Environmental FHA Lugbe, Abuja.
          </p>
          <p style={{ fontSize: '11px', fontWeight: 'bold', marginTop: '6px' }}>
            {data.term || 'Third Term'} Progress Report {data.session || ''} Academic Session
          </p>
        </div>
        <div className="flex gap-2 items-start">
          <div
            style={{
              width: '70px',
              height: '85px',
              border: '1px solid #333',
              background: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              textAlign: 'center',
            }}
          >
            {data.student?.photo_url ? (
              <img
                src={data.student.photo_url}
                alt="Student"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              'PHOTO'
            )}
          </div>
          <div
            style={{
              width: '55px',
              height: '55px',
              border: '1px solid #1A73E8',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1A73E8',
              fontWeight: 'bold',
              fontSize: '10px',
            }}
          >
            CREST
          </div>
        </div>
      </div>

      {/* Student info */}
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '10px',
          marginBottom: '10px',
          border: '1.5px solid #000',
        }}
      >
        <tbody>
          <tr>
            <td style={infoTd}>Student name:</td>
            <td style={{ ...infoTd, fontWeight: 'bold' }} colSpan={2}>
              {data.student?.full_name || '—'}
            </td>
            <td style={{ ...infoTd, fontWeight: 'bold' }}>Resumption Date:</td>
            <td style={infoTd}>{fmtDate(data.resumption_date)}</td>
          </tr>
          <tr>
            <td style={infoTd}>Admission No:</td>
            <td style={infoTd} colSpan={2}>
              {data.student?.student_id || '—'}
            </td>
            <td style={{ ...infoTd, fontWeight: 'bold' }}>Expected Total Score:</td>
            <td style={infoTd}>{data.overall_total ?? '—'}</td>
          </tr>
          <tr>
            <td style={infoTd}>Total No in Class:</td>
            <td style={infoTd}>{data.total_in_class ?? '—'}</td>
            <td style={infoTd}></td>
            <td style={{ ...infoTd, fontWeight: 'bold' }}>Total Obtainable:</td>
            <td style={infoTd}>{data.total_obtainable ?? '—'}</td>
          </tr>
          <tr>
            <td style={infoTd}>Grade:</td>
            <td style={infoTd} colSpan={2}>
              {data.student?.academic_year || '—'}
            </td>
            <td style={{ ...infoTd, fontWeight: 'bold' }}>Pupil's Overall Percentage:</td>
            <td style={infoTd}>
              {data.overall_percentage != null ? `${data.overall_percentage}%` : '—'}
            </td>
          </tr>
          <tr>
            <td style={infoTd}></td>
            <td style={infoTd} colSpan={2}></td>
            <td style={{ ...infoTd, fontWeight: 'bold' }}>Overall Grade:</td>
            <td style={{ ...infoTd, fontWeight: 'bold', color: '#1A73E8' }}>
              {data.overall_grade || '—'}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Subjects + sidebar */}
      <div className="flex gap-3">
        {/* Subjects table */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '10px',
              border: '1.5px solid #000',
            }}
          >
            <thead>
              <tr style={{ background: '#1A73E8', color: '#fff' }}>
                <th style={thStyle}>SUBJECTS</th>
                <th style={thStyle}>1ST CA<br /><span style={{ fontSize: '8px' }}>20%</span></th>
                <th style={thStyle}>2ND CA<br /><span style={{ fontSize: '8px' }}>20%</span></th>
                <th style={thStyle}>EXAM<br /><span style={{ fontSize: '8px' }}>60%</span></th>
                <th style={thStyle}>3RD TERM TOTAL</th>
                <th style={thStyle}>POSITION</th>
                <th style={thStyle}>IN CLASS</th>
                <th style={thStyle}>GRADE</th>
                <th style={thStyle}>REMARK</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((s, i) => (
                <tr key={i}>
                  <td style={tdStyle}>{s.subject}</td>
                  <td style={tdStyle}>{s.ca1 ?? '—'}</td>
                  <td style={tdStyle}>{s.ca2 ?? '—'}</td>
                  <td style={tdStyle}>{s.exam ?? '—'}</td>
                  <td style={tdStyle}>{s.total ?? '—'}</td>
                  <td style={tdStyle}>{s.position ?? '—'}</td>
                  <td style={tdStyle}>{s.in_class ?? '—'}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <strong
                      style={{
                        color:
                          s.grade === 'A'
                            ? '#1A73E8'
                            : s.grade?.startsWith('B')
                            ? '#333'
                            : '#666',
                      }}
                    >
                      {s.grade ?? '—'}
                    </strong>
                  </td>
                  <td style={{ ...tdStyle, fontStyle: 'italic', fontSize: '9px' }}>
                    {s.remark ?? '—'}
                  </td>
                </tr>
              ))}
              {[...Array(Math.max(0, 8 - subjects.length))].map((_, i) => (
                <tr key={`empty-${i}`}>
                  {[...Array(9)].map((__, j) => (
                    <td key={j} style={tdStyle}>
                      &nbsp;
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sidebar */}
        <div style={{ width: '230px', flexShrink: 0 }}>
          {/* Attendance */}
          <div style={{ border: '1.5px solid #000', marginBottom: '6px' }}>
            <div
              style={{
                background: '#1A73E8',
                color: '#fff',
                padding: '3px 6px',
                fontSize: '10px',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              Attendance Detail
            </div>
            <div style={{ padding: '4px 6px', fontSize: '9px' }}>
              <SideRow label="No of times school opened" value={data.attendance_total} />
              <SideRow label="No of times present" value={data.attendance_present} />
              <SideRow label="No of times absent" value={data.attendance_absent} />
            </div>
          </div>

          {/* Psychomotor */}
          <div style={{ border: '1.5px solid #000', marginBottom: '6px' }}>
            <div
              style={{
                background: '#1A73E8',
                color: '#fff',
                padding: '3px 6px',
                fontSize: '10px',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              Assessment Rubric
            </div>
            <table style={{ width: '100%', fontSize: '8px', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th
                    style={{
                      borderBottom: '1px solid #ccc',
                      textAlign: 'left',
                      padding: '2px 4px',
                    }}
                  >
                    DOMAINS
                  </th>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <th
                      key={n}
                      style={{
                        borderBottom: '1px solid #ccc',
                        width: '14px',
                        textAlign: 'center',
                      }}
                    >
                      {n}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(([label, val]) => (
                  <tr key={label}>
                    <td style={{ padding: '1px 4px' }}>{label}</td>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <td key={n} style={{ textAlign: 'center', fontSize: '9px' }}>
                        {val === n ? '✓' : ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Keys */}
          <div
            style={{
              border: '1px solid #000',
              fontSize: '7px',
              padding: '3px 5px',
              marginBottom: '5px',
              lineHeight: 1.3,
            }}
          >
            <p style={{ fontWeight: 'bold', marginBottom: '1px' }}>ASSESSMENT KEYS</p>
            <p>5=Highly proficient 3=Proficient</p>
            <p>2=Needs to improve 1=Unsatisfactory</p>
          </div>

          {/* Grading scale */}
          <div
            style={{
              border: '1px solid #000',
              fontSize: '7px',
              padding: '3px 5px',
              lineHeight: 1.3,
            }}
          >
            <p style={{ fontWeight: 'bold', marginBottom: '1px' }}>ACADEMIC GRADING SCALE</p>
            <p>80–100% A DISTINCTION</p>
            <p>70–79% B1 EXCELLENT</p>
            <p>60–69% B2 VERY GOOD</p>
            <p>50–59% C GOOD</p>
            <p>40–49% D FAIR</p>
            <p>0–39% F FAIL</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '10px',
          marginTop: '10px',
          border: '1.5px solid #000',
        }}
      >
        <tbody>
          <tr>
            <td style={{ ...infoTd, width: '15%' }}>Class Teacher:</td>
            <td style={{ ...infoTd, fontWeight: 'bold' }}>
              {data.class_teacher || '—'}
            </td>
          </tr>
          <tr>
            <td style={infoTd}>Teacher's Remark:</td>
            <td style={{ ...infoTd, fontStyle: 'italic' }}>
              {data.teacher_remark || '—'}
            </td>
          </tr>
          <tr>
            <td style={infoTd}>Head teacher's Remark:</td>
            <td style={{ ...infoTd, fontStyle: 'italic' }}>
              {data.head_teacher_remark || '—'}
            </td>
          </tr>
          <tr>
            <td style={infoTd}>Headteacher:</td>
            <td style={{ ...infoTd }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{data.head_teacher || '—'}</strong>
                <span>
                  <strong>Date:</strong> {fmtDate(data.term_ending)}
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  border: '1px solid #000',
  padding: '3px 2px',
  fontSize: '8px',
  textAlign: 'center',
  fontWeight: 'bold',
};

const tdStyle = {
  border: '1px solid #000',
  padding: '2px 4px',
  fontSize: '9px',
  textAlign: 'center',
};

const infoTd = {
  border: '1px solid #000',
  padding: '3px 6px',
};

function SideRow({ label, value }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0.5px 0',
      }}
    >
      <span>{label}</span>
      <span style={{ fontWeight: 'bold' }}>{value ?? '—'}</span>
    </div>
  );
}