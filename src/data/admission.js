// Admission tracks + courses shown on the "Purchase Admission Form" step.
// Edit names/courses here — the selection UI, the summary text, and the
// "Complete Application" banner all read from this file.

export const admissionTracks = [
  {
    id: "music",
    name: "Music Only Track",
    description: "Choose one instrument or vocal course",
    courses: [
      "Piano", "Guitars", "Ukulele", "Violin", "Viola", "Cello",
      "Flute", "Saxophone", "Trumpet", "Drums", "Vocals",
    ],
  },
  {
    id: "regular",
    name: "Regular Track",
    description: "Early childhood & primary education programmes",
    courses: [
      "Pre School", "Discovery", "Nursery 1", "Nursery 2",
      "Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5",
    ],
  },
  {
    id: "mixed",
    name: "Mixed Track",
    description: "Combined music & academic programme",
    courses: ["Vocals & Piano"],
  },
];
