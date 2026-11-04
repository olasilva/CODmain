import React, { useEffect, useState } from 'react';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import {
  createAcademicSession,
  getAdminSessions,
  setCurrentTerm,
} from '../../lib/api';
import { ACADEMIC_SESSION } from '../../lib/config';

const tabs = ['School Info', 'Academic Year', 'Users & Roles', 'Notifications'];
const initialForm = {
  name: ACADEMIC_SESSION,
  startDate: '',
  endDate: '',
  term1Start: '',
  term1End: '',
  term2Start: '',
  term2End: '',
  term3Start: '',
  term3End: '',
};

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('School Info');
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [sessionError, setSessionError] = useState('');
  const [message, setMessage] = useState('');
  const [form, setForm] = useState(initialForm);

  async function loadSessions() {
    setLoadingSessions(true);
    setSessionError('');
    try {
      const result = await getAdminSessions();
      setSessions(result?.sessions || []);
    } catch (error) {
      setSessionError(error.message || 'Failed to load academic sessions');
    } finally {
      setLoadingSessions(false);
    }
  }

  useEffect(() => {
    if (activeTab === 'Academic Year') loadSessions();
  }, [activeTab]);

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  async function handleCreateSession(event) {
    event.preventDefault();
    setMessage('');
    setSessionError('');
    try {
      await createAcademicSession({
        name: form.name.trim(),
        startDate: form.startDate,
        endDate: form.endDate,
        terms: [1, 2, 3].map((termNumber) => ({
          termNumber,
          startDate: form[`term${termNumber}Start`],
          endDate: form[`term${termNumber}End`],
        })),
      });
      setMessage('Academic session created successfully.');
      setForm(initialForm);
      await loadSessions();
    } catch (error) {
      setSessionError(error.message || 'Failed to save academic structure');
    }
  }

  async function handleSetCurrentTerm(sessionId, termNumber) {
    setMessage('');
    setSessionError('');
    try {
      await setCurrentTerm(sessionId, termNumber);
      setMessage('Current academic term updated.');
      await loadSessions();
    } catch (error) {
      setSessionError(error.message || 'Failed to update current term');
    }
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex">
      <AdminSidebar activeItem="Settings" />
      <div className="flex-1 ml-[300px]">
        <AdminHeader />
        <div className="max-w-[1140px] mx-auto px-8 py-6">
          <h1 className="text-[36px] font-bold text-black font-ebrima leading-[54px] mb-6">
            Settings
          </h1>
          <div className="flex gap-1 bg-white rounded-2xl border border-black/10 p-1.5 mb-8 w-fit">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition ${
                  activeTab === tab
                    ? 'bg-[#1A73E8] text-white'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-black/10 p-8 max-w-2xl">
            {activeTab === 'Academic Year' ? (
              <AcademicSettings
                form={form}
                updateField={updateField}
                onSubmit={handleCreateSession}
                sessions={sessions}
                loading={loadingSessions}
                error={sessionError}
                message={message}
                onSetCurrentTerm={handleSetCurrentTerm}
              />
            ) : activeTab === 'School Info' ? (
              <SchoolInfo />
            ) : (
              <div className="text-center py-12 text-gray-500">
                Content coming soon...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SchoolInfo() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-black/65 font-ebrima">
        School Information
      </h2>
      <div className="space-y-4 mt-6">
        {[
          ['School Name', 'Clan of David Art & Music Academy'],
          ['Address', 'Abuja, Nigeria'],
          ['Contact Email', 'admin@clanofdavidmusic.com.ng'],
          ['Phone Number', '07068098651'],
        ].map(([label, value]) => (
          <label key={label} className="block text-sm text-black/55 font-ebrima">
            {label}
            <input
              type="text"
              defaultValue={value}
              className="mt-1 w-full px-4 py-3 border border-black/20 rounded-xl focus:outline-none focus:border-[#1A73E8] text-sm"
            />
          </label>
        ))}
        <button type="button" className="px-8 py-3 bg-[#1A73E8] rounded-xl text-white font-bold hover:bg-blue-700 transition">
          Save Changes
        </button>
      </div>
    </div>
  );
}

function AcademicSettings({ form, updateField, onSubmit, sessions, loading, error, message, onSetCurrentTerm }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-black/65 font-ebrima">
        Academic Structure
      </h2>
      <p className="mt-2 text-sm text-black/55">
        Create sessions, define term dates, and choose the current term.
      </p>
      {error && <p className="mt-4 p-3 rounded-xl bg-red-50 text-red-700 text-sm">{error}</p>}
      {message && <p className="mt-4 p-3 rounded-xl bg-green-50 text-green-700 text-sm">{message}</p>}
      <form onSubmit={onSubmit} className="space-y-4 mt-6">
        <DateOrText label="Session name" value={form.name} onChange={updateField('name')} type="text" required />
        <div className="grid sm:grid-cols-2 gap-4">
          <DateOrText label="Session starts" value={form.startDate} onChange={updateField('startDate')} required />
          <DateOrText label="Session ends" value={form.endDate} onChange={updateField('endDate')} required />
        </div>
        {[1, 2, 3].map((termNumber) => (
          <fieldset key={termNumber} className="rounded-xl border border-black/10 p-4">
            <legend className="px-1 text-sm font-bold text-black/65">Term {termNumber}</legend>
            <div className="grid sm:grid-cols-2 gap-4">
              <DateOrText label="Starts" value={form[`term${termNumber}Start`]} onChange={updateField(`term${termNumber}Start`)} required />
              <DateOrText label="Ends" value={form[`term${termNumber}End`]} onChange={updateField(`term${termNumber}End`)} required />
            </div>
          </fieldset>
        ))}
        <button type="submit" className="px-8 py-3 bg-[#1A73E8] rounded-xl text-white font-bold hover:bg-blue-700 transition">
          Create Academic Session
        </button>
      </form>
      <div className="mt-8 space-y-3">
        <h3 className="font-bold text-black/65">Configured sessions</h3>
        {loading && <p className="text-sm text-black/50">Loading sessions…</p>}
        {!loading && sessions.length === 0 && <p className="text-sm text-black/50">No academic sessions configured yet.</p>}
        {sessions.map((session) => (
          <div key={session.id} className="rounded-xl border border-black/10 p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-bold text-black/75">{session.name}</p>
              <p className="text-xs text-black/50">{session.is_current ? 'Current session' : 'Not current'}</p>
            </div>
            <select
              defaultValue={session.terms?.find((term) => term.is_current)?.term_number || 1}
              onChange={(event) => onSetCurrentTerm(session.id, Number(event.target.value))}
              className="px-3 py-2 border border-black/15 rounded-lg text-sm"
              aria-label={`Current term for ${session.name}`}
            >
              {(session.terms || [1, 2, 3].map((termNumber) => ({ term_number: termNumber }))).map((term) => (
                <option key={term.term_number} value={term.term_number}>Term {term.term_number}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

function DateOrText({ label, value, onChange, type = 'date', required }) {
  return (
    <label className="block text-sm text-black/55 font-ebrima">
      {label}
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="mt-1 w-full px-4 py-3 border border-black/20 rounded-xl focus:outline-none focus:border-[#1A73E8] text-sm"
      />
    </label>
  );
}
