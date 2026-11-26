// src/data/programmes.js

// ACADEMY: Primary/Nursery Academic Levels
export const academyTrack = {
  slug: "mixed-track", 
  name: "Academy", 
  tagline: "A nurturing academic curriculum from Discovery through Basic 5, building confident and curious learners.",
  icon: "book", 
  theme: "blue", // For the dark blue gradient in your screenshot
  courses: [
    { 
      code: "D", 
      name: "Discovery", 
      level: "Foundation",
      description: "Creative exploration and learning readiness programme for early learners.",
      subjects: ["Numeracy", "Literacy", "Physical and Social Development (P S D)", "Creative Development", "Knowledge and Understanding of the World (K U W)", "Rhymes"]
    },
    { 
      code: "PN", 
      name: "Pre Nursery", 
      level: "Foundation",
      description: "Foundational early childhood learning that builds confidence, routine, and curiosity.",
      subjects: ["Numeracy", "Literacy", "Basic Science", "Social Value", "Health Habit", "C R S", "Creative Art", "Rhymes"]
    },
    { 
      code: "N1", 
      name: "Nursery 1", 
      level: "Nursery",
      description: "Structured play-based learning introducing letters, numbers, and creativity.",
      subjects: ["Numeracy", "Literacy", "Basic Science", "Social Value", "Health Habit", "C R S", "Creative Art", "Music", "Phonics", "Handwriting", "Rhymes"]
    },
    { 
      code: "N2", 
      name: "Nursery 2", 
      level: "Nursery",
      description: "Advanced nursery curriculum preparing children for primary education.",
      subjects: ["Numeracy", "Literacy", "Basic Science", "Social Value", "Health Habit", "C R S", "Creative Art", "Music", "Phonics", "Handwriting", "Rhymes"]
    },
  ],
};

// VOCATIONAL: Musical Skills & Instruments
export const vocationalTrack = {
  slug: "regular-track", 
  name: "Vocational", 
  tagline: "The best of both worlds — a perfectly balanced curriculum that combines musical excellence with core academic achievement.",
  icon: "music-note", 
  theme: "purple", // For the purple gradient in your screenshot
  courses: [
    { code: "V", name: "Vocals", description: "Develop a strong singing voice with breath control, pitch training, performance technique, and music theory. Suitable for all ability levels." },
    { code: "P", name: "Piano", description: "Master the piano from beginner scales to advanced pieces. Students gain a deep understanding of rhythm, harmony, and musical expression." },
    { code: "G", name: "Guitars", description: "Learn acoustic and electric guitar techniques." },
    { code: "D", name: "Drums", description: "Build rhythm, coordination, and percussion skills." },
    { code: "S", name: "Saxophone", description: "Learn woodwind technique and jazz improvisation." },
  ],
};

export const musicTrack = {
  slug: "music-track",
  name: "Music",
  tagline: "Discover the joy of music through expert tuition in a wide range of instruments and vocal performance.",
  icon: "music-note",
  theme: "purple",
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

export const adultEducationTrack = {
  slug: "adult-education",
  name: "Adult Education",
  tagline: "Flexible music lessons for adults with structured fees, attendance plans, and accessible learning schedules.",
  icon: "user",
  theme: "teal",
  courses: [
    { code: "P", name: "Piano" },
    { code: "G", name: "Guitars" },
    { code: "V", name: "Violin" },
    { code: "D", name: "Drums" },
    { code: "S", name: "Saxophone" },
    { code: "T", name: "Trumpet" },
    { code: "V", name: "Vocals" },
  ],
};

// Order they appear on the Programmes page
export const tracks = [academyTrack, vocationalTrack, musicTrack, adultEducationTrack];