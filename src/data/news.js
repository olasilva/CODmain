// News / blog articles. Add a new post by adding an object here — it will
// show up automatically in the News grid and under its category filter.
//
// `image`: import a real photo and reference it here (see the Piano post
// below for the pattern). Leave it `null` to fall back to a gradient
// placeholder card, exactly like the "Annual Sports Day" post does today.

export const categories = [
  "All",
  "Events",
  "Academics",
  "Music",
  "Achievements",
  "Staff",
  "Community",
  "Admissions",
];

export const posts = [
  {
    slug: "enrolment-open-piano-masterclass-series",
    title: "Enrolment Open for Piano Masterclass Series",
    date: "2026-06-02",
    category: "Music",
    excerpt:
      "We are thrilled to announce that enrolment is now open for our highly sought-after Piano Masterclass Series, offering advanced instruction from nationally recognised musicians.",
    image: null, // replace with an imported photo, e.g. import pianoImg from "../assets/news/piano.jpg"
  },
  {
    slug: "end-of-term-concert-a-night-of-musical-brilliance",
    title: "End-of-Term Concert: A Night of Musical Brilliance",
    date: "2026-06-15",
    category: "Events",
    excerpt:
      "Students from all programmes dazzled audiences with stunning performances at our annual end-of-term concert, showcasing the incredible talent nurtured across the academy this term.",
    image: null, // replace with an imported photo, e.g. import concertImg from "../assets/news/concert.jpg"
  },
  {
    slug: "annual-sports-day-celebrating-health-and-team-spirit",
    title: "Annual Sports Day: Celebrating Health and Team Spirit",
    date: "2026-04-20",
    category: "Events",
    excerpt:
      "Students, staff, and parents gathered for a fun-filled Annual Sports Day, filled with friendly competitions, teamwork activities, and a celebration of physical wellness.",
    image: null,
  },
];

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
