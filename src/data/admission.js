// Admission tracks + courses shown during enrollment.
// Edit names/courses here — the selection UI, the summary text, and the
// "Complete Application" banner all read from this file.

export const admissionTracks = [
  {
    id: "music",
    name: "Music",
    description: "Choose one instrument or vocal course",
    courses: [
      "Piano", "Guitars", "Ukulele", "Violin", "Viola", "Cello",
      "Flute", "Saxophone", "Trumpet", "Drums", "Vocals",
    ],
  },
  {
    id: "mixed",
    name: "Academic",
    description: "Combined academic programme",
    courses: ["Vocals & Piano"],
  },
  {
    id: "regular",
    name: "Mixed Media",
    description: "Early childhood and primary education programmes",
    courses: [
      "Discovery",
      "Pre Nursery",
      "Nursery 1",
      "Nursery 2",
      "Basic 1",
      "Basic 2",
      "Basic 3",
      "Basic 4",
      "Basic 5",
    ],
  },
];
