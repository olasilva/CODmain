# Clan of David Art and Music Academy — Web App

React + Vite + Tailwind. Built to match the provided mockups exactly, plus a
standard home page in the same visual language.

## Getting started

```bash
npm install
npm run dev
```

## Adding your real logo

Replace this single file — nothing else needs to change:

```
src/assets/logo.png
```

Every page (Welcome screen, Navbar, Footer, Home hero) pulls the logo from
`src/components/Logo.jsx`, which imports that one file. Drop your actual
crest in at that path (keep the filename `logo.png`, or rename it and update
the import line in `Logo.jsx`) and it updates everywhere at once.

## Pages / routes

| Route                    | Page                                              |
|---------------------------|---------------------------------------------------|
| `/`                        | Home — standard marketing homepage                |
| `/welcome`                 | Welcome / select screen (matches original mockup) |
| `/about`                    | About — mission, stats. **Placeholder copy, edit it.** |
| `/programmes`              | Programme listing (Music Track, Regular Track)    |
| `/programmes/:slug`        | Programme detail (matches original mockup)        |
| `/news`                     | News — filterable blog grid (matches mockup)      |
| `/news/:slug`               | Single article view                                |
| `/contact`                   | Contact — details + a form (**not wired to a backend yet**) |
| `/login`                     | Sign in (matches mockup) — **not wired to real auth yet** |
| `/signup`                    | Two-step create account (matches mockup for step 1; step 2 is a placeholder, see below) |
| `/admission`                  | Purchase Admission Form — track/course picker (matches mockup) |
| `/admission/apply`             | Complete Application form (matches mockup) — requires state from `/admission`, redirects back there if visited directly |
| `/admission/submitted`          | Confirmation screen (matches mockup) — requires state from `/admission/apply` |
| `/forgot-password`               | Placeholder — wire up your real reset flow |
| `/dashboard`                       | Student dashboard home (matches mockup) |
| `/dashboard/courses`                | My Courses (matches mockup) |
| `/dashboard/classes`                | Classes — schedule + recordings (matches mockup) |
| `/dashboard/assignments`             | Assignments (matches mockup) |
| `/dashboard/results`                  | Academic Results + "Download Report" (matches mockup) |
| `/dashboard/messages`                  | Placeholder — not in the provided mockups |
| `/dashboard/notifications`              | Placeholder — not in the provided mockups |
| `/dashboard/settings`                    | Placeholder — not in the provided mockups |

## Student dashboard

Everything shown across the dashboard — the logged-in student's name/class,
today's schedule, courses, classes, assignments, and results — comes from
**one file**:

```
src/data/student.js
```

This is currently static sample data matching the mockups exactly (same
student, same scores). Once you have a backend, replace the exports in
that file with real fetched data — no dashboard page needs to change, they
all just read from these exports.

- `resultsByTerm` — Term 1 is fully populated; Term 2 and Term 3 are `null`
  placeholders. The Results page shows a "not recorded yet" message for any
  term with `null` data, so add real data there once it exists.
- **Report Card / "Download Report"** — clicking it on the Results page
  opens `src/components/dashboard/ReportCardPreview.jsx` as a modal, styled
  to match the report card mockup. "Print / Save PDF" uses the browser's
  native print dialog (`window.print()`), which offers "Save as PDF" in
  most browsers — there's no server-side PDF generation here. "Share" uses
  the Web Share API where available and falls back to an alert otherwise.
- The dashboard's `Logout` link currently just routes back to `/welcome` —
  point it at your real sign-out call once auth is wired up.
- **`/login`'s "Sign In" button navigates straight to `/dashboard`** as a
  demo convenience so the whole flow is click-through-able — this is
  explicitly marked with a `TODO` in `src/pages/Login.jsx` and should be
  gated behind a real successful sign-in once auth exists.

## The admission flow

`/admission` → `/admission/apply` → `/admission/submitted` is a single wizard.
Selections are passed between steps via React Router's navigation `state`
(not stored anywhere), so:

- Track/course data lives in `src/data/admission.js` — edit names or course
  lists there and the picker, the "Selected Programme" banner, and the
  confirmation screen all stay in sync.
- Visiting `/admission/apply` or `/admission/submitted` directly (e.g. a
  bookmark or page refresh) redirects back to `/admission`, since there's no
  selection to show. Once you wire this up to a real backend, you may want
  to persist the selection (e.g. in Supabase or the URL) instead.
- **Neither `CompleteApplication.jsx` nor the submit handler actually saves
  anything yet** — there's a `TODO` comment at the point where you should
  call your backend / Supabase.

## Login &amp; Sign Up

- `src/pages/Login.jsx` — form fields are wired to local state only.
  `handleSubmit` and `handleGoogle` both just `console.log` — replace with
  your real auth calls (Supabase `signInWithPassword` / `signInWithOAuth`
  are natural fits given the rest of your stack).
- `src/pages/SignUp.jsx` — Step 1 matches the mockup exactly. **Step 2 was
  not in the provided design**, so I built a minimal placeholder (review +
  terms checkbox) so the two-step flow works end-to-end — replace it with
  whatever step 2 should actually be.

## Editing course lists

All course data (Music Track, Regular Track) lives in one place:

```
src/data/programmes.js
```

Add a new track by adding an object to that file — it will automatically
get a route at `/programmes/<slug>` and appear on the Home and Programmes
pages, no other code changes needed.

Note: `src/data/admission.js` is a **separate** file for the admission
picker's track/course list (Music Only / Regular / Mixed) — the two aren't
linked, since the admission tracks use different course names (grade levels
for Regular Track vs. subjects). Edit both if a course changes in both
places.

## Editing news / blog posts

All posts live in one place:

```
src/data/news.js
```

Add a new post by adding an object to the `posts` array — it appears
automatically in the `/news` grid, under its category filter, and gets its
own page at `/news/<slug>`.

- `image`: leave `null` to get the gradient placeholder card (as shown for
  "Annual Sports Day" in the original mockup), or import a real photo and
  reference it — see the comment above the Piano post for the pattern.
- `category`: must match one of the strings in the `categories` array at the
  top of the same file, or add a new category there first.
- Full article body: the detail page currently just repeats the excerpt.
  Add a `body` field to a post object and render it in
  `src/pages/NewsPost.jsx` once you have real long-form content.

## Places that still need your real content

- `src/pages/About.jsx` — mission statement, stats, story: all placeholder text.
- `src/pages/Contact.jsx` — address/email/phone placeholders, and the form's
  `handleSubmit` just flips a "submitted" flag locally. Point it at your
  actual backend, email service, or Google Sheet.
- `src/components/Footer.jsx` — the `Socials` column links to generic
  `x.com` / `instagram.com` etc. — swap in your real profile URLs.
- `src/data/news.js` — swap `image: null` placeholders for real photos as
  you get them.
- `src/pages/Login.jsx` / `src/pages/SignUp.jsx` — not wired to real auth.
- `src/pages/admission/CompleteApplication.jsx` — submit handler doesn't
  persist the application anywhere yet.
- `src/pages/SignUp.jsx` — Step 2 is a placeholder (see above).
- `src/data/student.js` — this is sample data for one student, matching the
  mockups. Swap for real data once you have a backend.
- `src/pages/dashboard/DashboardPlaceholder.jsx` — used for Messages,
  Notifications, and Settings, none of which were in the provided mockups.
- `src/components/dashboard/DashboardLayout.jsx` — the `Logout` link just
  routes to `/welcome`; wire it to your real sign-out.

## Structure

```
src/
  assets/logo.png        <- your logo goes here
  components/
    Logo.jsx
    BrandPanel.jsx           <- shared left blue panel (Welcome + admission flow)
    Navbar.jsx
    Footer.jsx
    Icons.jsx
  data/
    programmes.js           <- course/track content (marketing site)
    news.js                  <- blog/news posts + categories
    admission.js              <- track/course content (admission picker)
  pages/
    Welcome.jsx              (mockup: welcome/select screen)
    Home.jsx                  (standard homepage)
    About.jsx                  <- edit placeholder copy
    Programmes.jsx
    ProgrammeDetail.jsx       (mockup: Music Track / Regular Track)
    News.jsx                   (mockup: filterable news grid)
    NewsPost.jsx
    Contact.jsx                 <- wire up the form
    Login.jsx                    (mockup) <- wire up real auth
    SignUp.jsx                   (mockup step 1 + placeholder step 2) <- wire up real auth
    admission/
      CourseSelection.jsx        (mockup: Purchase Admission Form)
      CompleteApplication.jsx    (mockup) <- wire up submit handler
      ApplicationSubmitted.jsx   (mockup)
    dashboard/
      Dashboard.jsx               (mockup: dashboard home)
      MyCourses.jsx                (mockup)
      Classes.jsx                   (mockup)
      Assignments.jsx                (mockup)
      Results.jsx                     (mockup) <- opens ReportCardPreview
      DashboardPlaceholder.jsx         <- used for Messages/Notifications/Settings
    Placeholder.jsx
  components/dashboard/
    DashboardLayout.jsx    <- sidebar + topbar shared by all /dashboard pages
    StatusBadge.jsx
    ReportCardPreview.jsx   (mockup: Report Card Preview modal)
  App.jsx                    <- routes
  main.jsx
```
