// src/data/schoolFees.js
// First Term, 2026/2027 school fee schedules — Clan of David Art and Music Academy.
// Source: official fee schedule flyers. Totals are computed from the items.

export const FEE_SESSION = 'First Term, 2026/2027 Academic Session';

export const SCHOOL_ACCOUNT = {
  bank: 'Zenith Bank',
  number: '1219258176',
  name: 'Clan of David Music School',
};

// Item order matches the flyers (S/N 1–9)
const ITEMS = [
  ['tuition', 'Tuition Fee'],
  ['uniform', 'School Uniform and Wears'],
  ['books', 'Books and Study Materials'],
  ['bus', 'School Bus/Transportation'],
  ['afterCare', 'After School Care'],
  ['weekend', 'Weekend Music/Dance/Art Classes'],
  ['pta', 'PTA'],
  ['exam', 'Examination Fees'],
  ['excursion', 'Excursion/Tour'],
];

const make = (key, label, v, uniformNote) => {
  const items = ITEMS.map(([k, name]) => ({
    key: k,
    label: k === 'uniform' && uniformNote ? `${name} (${uniformNote})` : name,
    amount: v[k] || 0,
  }));
  return {
    key,
    label,
    items,
    total: items.reduce((sum, i) => sum + i.amount, 0),
  };
};

const FRI = 'Friday Wears and Cardigan';

export const SCHOOL_FEES = [
  // Pre School is a flat 90k summer lump sum — no itemised breakdown.
  {
    key: 'pre-school',
    label: 'Pre School',
    items: [{ key: 'summer', label: 'Summer Fee', amount: 90000 }],
    total: 90000,
  },
  make('pre-nursery', 'Pre Nursery', { tuition: 55000, uniform: 49000, books: 15000, pta: 2000, exam: 1500 }, FRI),
  make('discovery', 'Discovery', { tuition: 55000, uniform: 49000, books: 5000, pta: 2000, exam: 1500 }, FRI),
  make('nursery-one', 'Nursery One', { tuition: 60000, uniform: 51000, books: 25000, pta: 2000, exam: 1500 }, FRI),
  make('nursery-two', 'Nursery Two', { tuition: 60000, uniform: 51000, books: 30000, pta: 2000, exam: 1500 }, FRI),
  make('basic-two', 'Basic Two', { tuition: 65000, uniform: 55000, books: 35000, pta: 1500 }),
  make('basic-three', 'Basic Three', { tuition: 72000, uniform: 55000, books: 42000, pta: 2000, exam: 1500 }),
  make('basic-four', 'Basic Four', { tuition: 80000, uniform: 60000, books: 49000, pta: 2000, exam: 1500 }, FRI),
  make('basic-five', 'Basic Five', { tuition: 85000, uniform: 60000, books: 52000, pta: 2000, exam: 1500 }, FRI),
];

const NUM_WORDS = { 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six' };

// "Basic 4", "basic four", "Primary 4", "Nursery 1", "Pre-Nursery" → slug
const normalise = (value = '') => {
  let s = String(value).toLowerCase().trim();
  s = s.replace(/primary/g, 'basic').replace(/pre[\s-]*nursery/g, 'pre-nursery');
  s = s.replace(/\b([1-6])\b/g, (_, d) => NUM_WORDS[d]);
  s = s.replace(/\s+/g, '-');
  return s;
};

export function getSchoolFeeSchedule(...candidates) {
  for (const c of candidates) {
    if (!c) continue;
    const slug = normalise(c);
    const hit = SCHOOL_FEES.find((f) => slug === f.key || slug.includes(f.key));
    if (hit) return hit;
  }
  return null;
}