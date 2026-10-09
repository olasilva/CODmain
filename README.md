# Clan of David — Art & Music Academy

React + Vite + Tailwind build. Homepage matches the supplied PDF mockup;
programme detail pages (`Music Track`, `Regular Track`, `Mixed Track`) are
built directly from the Figma source file
(`figma.com/design/ZM5onO91tMYasL4P7L0YfS`).

## Project structure

```
clan-of-david/
├── index.html
├── package.json / vite.config.js / tailwind.config.js / postcss.config.js
└── src/
    ├── main.jsx / App.jsx (routing) / index.css
    ├── assets/                    # real academy photos + logo
    ├── components/
    │   ├── Navbar.jsx / Hero.jsx / WhyUs.jsx / AboutSection.jsx
    │   ├── StatsBar.jsx / Programmes.jsx / ApplyAdmission.jsx
    │   ├── BlogNews.jsx / Footer.jsx
    │   ├── ProgrammeBreadcrumb.jsx  # shared "← Our Programmes / X" bar
    │   ├── ProgrammeCTA.jsx         # shared bottom CTA banner
    │   └── ImagePlaceholder.jsx
    └── pages/
        ├── Home.jsx           → "/"
        ├── MusicTrack.jsx     → "/programmes/music-track"
        ├── RegularTrack.jsx   → "/programmes/regular-track"
        └── MixedTrack.jsx     → "/programmes/mixed-track"
```

## Getting started

```bash
npm install
npm run dev       # local dev server
npm run build      # production build → dist/
```

## Backend integration

The frontend uses `src/lib/api.js` for authentication, admission applications,
payments, contact messages, and newsletter subscriptions. Without configuration
it persists demo data in browser storage so every flow works locally. Set
`VITE_API_URL` in the deployment environment to use a real backend instead.

The backend should provide JSON endpoints for `POST /auth/register`,
`POST /auth/login`, `POST /applications`, `POST /payments`, `POST /contact`, and
`POST /newsletter`. Login should return `{ id, fullName, email, role }`; payment
should return `{ transactionId, paidAt }`. The current local payment adapter is
only a development stub and must be replaced by server-side gateway/webhook
verification before accepting real money.

For manual bank transfers, the frontend also expects `POST /payments/bank-transfer`
to save a pending record containing `applicationId`, `amount`, `plan`, `course`,
`trackName`, `method`, `studentName`, `payerEmail`, `payerName`, and `payerPhone`.
`GET /admin/payments` must include those records in `{ payments: [...] }`, with
each transfer identified by `method: "bank_transfer"` and `status: "pending"`.
Admin approval uses `POST /admin/payments/:id/approve`; the backend must verify and
accept `{ amountReceived, duration, durationUnit, durationDays, loginUrl }`,
persist the approval and fee coverage, update the related admission to
`approved`, and send the confirmation email before returning success. The
student `/student/fees` endpoint must return the approved fee with amount,
duration/durationDays, paidAt, and expiresAt so the portal can show the received
amount and live countdown. Student login and portal APIs must enforce admission
status server-side.

The admin review screens expect `GET /admin/admissions` to return
`{ admissions: [...] }` and `PUT /admin/admissions/:id/status` with
`{ status: "approved" | "rejected", loginUrl?: string }`. Admission approval
should be allowed only after the related fee is verified; the backend should
update the admission, email the registered student that admission is approved,
include the supplied login link, and return `{ emailSent: true }` only when
delivery succeeds. `GET /admin/payments` should include
payment method, amount, payer/student details, and status so pending transfers
can be reviewed separately from other payment methods.

Student ID-card support expects `POST /student/id-card-requests` and
`GET /admin/students/:studentId/id-card-requests`. Admin ID edits use
`PUT /admin/students/:studentId/student-id` with `{ studentId }`; the backend
must persist the value and create a student notification when it changes.
Approving a request uses `POST
/admin/students/:studentId/id-card-requests/:requestId/approve` with
`{ studentType: "regular" | "music" }`. The server must generate a unique
regular ID in `COD-2026/2027-0001` format or music ID in `COD-2026-001` format,
save it to the student profile, and return `{ student: { student_id } }`.
The admin UI then redirects to the certificate app with `studentId` and
`studentName` query parameters.

## Deploying to Vercel

Import this repository into Vercel. It will detect the Vite setup automatically,
run `npm run build`, and serve the generated `dist/` directory. The included
`vercel.json` keeps client-side routes such as `/payment` working on refresh.

## Design tokens

Two token sets currently coexist in `tailwind.config.js`:

- `cod-*` (blue, blue-dark, pink, navy, lavender…) — approximated from the
  original PDF mockup, used on the homepage.
- `cod-brand-*` (navy `#0F4082`, blue `#1A73E8`, pink `#FF2E96`, green
  `#34A853`) — the **exact** colors pulled from the Figma file, used on
  Mixed Track. Font on Figma screens is **Ebrima** (`font-figma` in
  Tailwind), a Microsoft system font not on Google Fonts — falls back to
  Segoe UI / system sans.

As remaining Figma-sourced pages are built, prefer `cod-brand-*` tokens and
`font-figma` for accuracy. Reconciling the homepage/Music/Regular Track
pages onto the same exact tokens is a follow-up if wanted.

## Known limitation: Figma icon assets

Figma's asset CDN (`figma.com/api/mcp/asset/...`) is not reachable from this
build environment's network allowlist, so exact icon PNGs exported from
Figma (e.g. the Mixed Track header icon, Vocals/Piano icons) could not be
downloaded. Closely-matching hand-built SVG icons were used instead. If you
have Figma desktop/web access, you can export the originals and swap them
in — the components are structured so this is a one-line change per icon.

## Images

All photos are real (no stock/online images). See in-component imports in
`src/assets/` — swap any by importing a new file and pointing the existing
`<img src={...}>` at it.
