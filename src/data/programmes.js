// Central programme data. Edit course lists here — every page pulls from this file.

export const musicTrack = {
  slug: "music-track",
  name: "Music Track",
  tagline: "Discover the joy of music through expert tuition in a wide range of instruments and vocal performance.",
  icon: "music-note",
  courses: [
    { code: "P", name: "Piano" },
    { code: "G", name: "Guitars" },
    { code: "U", name: "Ukulele" },
    { code: "V", name: "Violin" },
    { code: "V", name: "Viola" },
    { code: "C", name: "Cello" },
    { code: "F", name: "Flute" },
    { code: "S", name: "Saxophone" },
    { code: "T", name: "Trumpet" },
    { code: "D", name: "Drums" },
    { code: "V", name: "Vocals" },
  ],
};

export const regularTrack = {
  slug: "regular-track",
  name: "Regular Track",
  tagline: "A well-rounded academic foundation delivered alongside creative and extracurricular development.",
  icon: "book",
  courses: [
    { code: "M", name: "Mathematics" },
    { code: "E", name: "English Studies" },
    { code: "S", name: "Sciences" },
    { code: "A", name: "Arts" },
    { code: "C", name: "Computer Studies" },
  ],
};

export const tracks = [musicTrack, regularTrack];
