# Pulse Hospital & I.C.U — Official Web App

Modern, mobile-first website and WhatsApp appointment booking system for **Pulse Hospital & I.C.U**, 4th Floor, A-block, City Centre, Shamlaji Road, Modasa, Arvalli – 383315, Gujarat.

Patients can explore the hospital's facilities, departments and doctors, pick an advance 30-minute OPD slot for the coming week, get an instant printable booking slip, and send the appointment request straight to the hospital's WhatsApp reception desk.

It is a **static React web app with no backend, database or server**, so it can be hosted for free on **GitHub Pages**, **Vercel**, or any static host.

**Live site:** https://bluenovatechin.github.io/Pulse-Hospital/

---

## Quick Start

Requires **Node.js 20.19+** (needed by Vite 8).

```bash
# 1. Install dependencies
npm install

# 2. Start the local development server
npm run dev
```

Open **http://localhost:5173**

### Commands

| Command | Purpose |
|---|---|
| `npm run dev` / `npm start` | Starts the Vite dev server at `http://localhost:5173` |
| `npm run build` | Builds the site into `dist/` and pre-renders every page to HTML (served from `/`, e.g. for Vercel) |
| `npm run preview` | Serves the `dist/` build locally to check it |
| `npm run lint` | Checks the code with Oxlint |
| `npm run deploy` | Builds for GitHub Pages and publishes it (see below) |

---

## How Booking Works

1. The patient chooses a doctor, a date from next Monday to Sunday, and a free 30-minute morning or evening slot.
2. They fill in their name, mobile number and (optionally) age, city, previous file number and symptoms.
3. On **Book Slot via WhatsApp**, the app:
   - opens WhatsApp with a ready-made booking message addressed to the hospital desk (`+91 63533 44875`),
   - opens the booking slip page `/my-appointments/PLS-XXXXXX` (printable, shareable on WhatsApp),
   - saves the booking in the patient's own browser (`localStorage`) so they can see it again under **My appointments**.

Booking starts at `/book-appointment`; every doctor's page links to `/book-appointment/<doctor>`, which opens the form with that doctor chosen.

Nothing is stored on a server. The hospital receives bookings only as WhatsApp messages, and slot availability is not checked against other patients' bookings — reception confirms each booking on WhatsApp.

The Contact page form works the same way: it opens a WhatsApp message to the hospital.

### Changing hospital details

All content lives in **[`src/data/hospitalContent.js`](src/data/hospitalContent.js)**: doctors, facilities, departments, the brochure's treatment list, photos, phone numbers, the WhatsApp number (`whatsappNumber`) and the address. Edit it there and redeploy.

> **Before launch:** `appointmentNumber` / `whatsappNumber` are currently a **test number** (+91 63533 44875). Bookings, the emergency call buttons and WhatsApp messages all go to it. Replace it with the hospital's real reception number (the brochure lists 95120 45641 / 95120 45642, which are shown as `appointmentLines`).

### Adding or changing photos

Photos live in `public/photos/` as WebP files in three widths: `gallery-N.webp` (1100 px), `gallery-N-800.webp` and `gallery-N-640.webp` (phones pick the smaller ones automatically). To add a photo, export those three sizes (e.g. with [Squoosh](https://squoosh.app)), then reference it in `PHOTOS` in `hospitalContent.js`.

## Pages

Every page has its own URL, navbar and footer (there are no pop-ups):

| URL | Page |
|---|---|
| `/` | Home |
| `/doctors`, `/doctors/dr-dipesh-patel` … | All doctors; one full profile page per doctor |
| `/departments`, `/departments/chest` … | All departments; one page per department |
| `/facilities`, `/facilities/icu` … | All facilities; one page per facility |
| `/book-appointment`, `/book-appointment/dr-paras-patel` | Booking form (optionally with a doctor chosen) |
| `/my-appointments`, `/my-appointments/PLS-123456` | Bookings made on this device; one printable slip |
| `/gallery`, `/about`, `/contact`, `/privacy`, `/terms` | The remaining pages |

Adding a doctor, department or facility to `hospitalContent.js` automatically creates its page, adds it to the sitemap and links it from the rest of the site. A doctor's URL comes from their `slug` field.

### SEO

- **Pre-rendered HTML.** `npm run build` / `npm run deploy` render every page to a complete HTML file (`dist/doctors/dr-paras-patel.html`, …) with its content, title, description, canonical link and share tags, so Google reads the page without running JavaScript. The browser then takes over the same HTML. This is done by [`src/entry-server.jsx`](src/entry-server.jsx) and [`scripts/prerender.mjs`](scripts/prerender.mjs).
- **Structured data** (schema.org): the hospital on every page, a `Physician` entry for each doctor, breadcrumbs on detail pages and the FAQ on the home page.
- **Real links** (`<a href>`) everywhere, and the footer links every doctor and department, so search engines can discover all pages.
- `sitemap.xml` and `robots.txt` are generated on each build. Appointment pages are marked `noindex` (they are private to the patient).

Titles, descriptions and structured data live in [`src/data/seo.js`](src/data/seo.js). If the site moves to a custom domain, update `SITE_URL` there.

**Getting found for doctor names and "hospital in Modasa":** the site now gives Google everything it needs, but ranking also depends on things outside the code. Most important: submit the sitemap in [Google Search Console](https://search.google.com/search-console), set up the hospital's **Google Business Profile** (with this website link), use a custom domain, and get the site linked from the doctors' own clinic pages, social profiles and local directories (Practo, Justdial, Google Maps).

---

## Features

- **WhatsApp OPD booking** — slot-wise advance booking for the coming week, sent directly to the hospital desk.
- **Printable appointment slip** — print or save as PDF.
- **My appointments** — patients can look up, view or cancel bookings made on the same device; cancelling also prepares a WhatsApp cancellation message.
- **A page for everything** — each doctor, department and facility has its own page with its own URL.
- **Gujarati & English** — one-tap language switch.
- **Emergency first** — call buttons always visible on desktop and in the mobile bottom bar.
- **Photo tour** — ICU, operation theatres, CT scan, rooms and more.

---

## Hosting on GitHub Pages

The site is published with the [`gh-pages`](https://www.npmjs.com/package/gh-pages) package. `npm run deploy` builds the site for the `/Pulse-Hospital/` sub-path and pushes the `dist/` folder to a **`gh-pages`** branch, which GitHub Pages serves.

### First-time setup

1. Push your code to GitHub:
   ```bash
   git add -A
   git commit -m "Move app to repo root and add GitHub Pages deploy"
   git push origin main
   ```
2. Publish the site:
   ```bash
   npm run deploy
   ```
3. On GitHub, open the repository → **Settings** → **Pages**:
   - **Source:** *Deploy from a branch*
   - **Branch:** `gh-pages`, folder `/ (root)` → **Save**
4. After a minute or two the site is live at **https://bluenovatechin.github.io/Pulse-Hospital/**
5. (Recommended) Add the site to [Google Search Console](https://search.google.com/search-console) and submit `https://bluenovatechin.github.io/Pulse-Hospital/sitemap.xml`, so Google finds every page quickly. Also create or claim the hospital's **Google Business Profile**; it drives most local "hospital near me" searches.

### Updating the live site

After making changes:

```bash
git add -A
git commit -m "Describe your change"
git push origin main
npm run deploy
```

`git push` saves your source code; `npm run deploy` updates the live website. Always run both.

### Notes

- The sub-path `/Pulse-Hospital/` must match the repository name. If the repository is renamed, update `--base=/Pulse-Hospital/` in the `predeploy` script in [`package.json`](package.json).
- Every page URL (e.g. `/Pulse-Hospital/doctors/dr-paras-patel`) has its own HTML file, so links and refreshes return a normal page. Any other URL (including appointment slips, which exist only in the patient's browser) is served `404.html`, which starts the app and shows the right page.
- Never edit the `gh-pages` branch by hand; it is overwritten on every deploy.

---

## Project Structure

```
Pulse Hospital/
├── public/                      Copied as-is into the build
│   ├── photos/                  Hospital photos (WebP, 3 sizes each)
│   ├── logo.webp, logo.png      Pulse Hospital cross logo
│   ├── favicon.png, apple-touch-icon.png, icon-192/512.png
│   ├── og-image.jpg             Preview image for WhatsApp / social links
│   └── manifest.webmanifest     "Add to home screen" details
├── src/
│   ├── data/
│   │   ├── hospitalContent.js   Single source of truth: doctors, facilities,
│   │   │                        departments, photos, phone numbers, address
│   │   └── seo.js               Page titles/descriptions, structured data, page list
│   ├── pages/
│   │   ├── HomePage.jsx, AboutPage.jsx, ContactPage.jsx, GalleryPage.jsx
│   │   ├── DoctorsPage.jsx, DoctorPage.jsx            All doctors / one doctor
│   │   ├── DepartmentsPage.jsx, DepartmentPage.jsx    All departments / one department
│   │   ├── FacilitiesPage.jsx, FacilityPage.jsx       All facilities / one facility
│   │   ├── BookingPage.jsx                            Booking form page
│   │   ├── AppointmentsPage.jsx                       My appointments + booking slip
│   │   └── PrivacyPolicyPage.jsx, TermsPage.jsx, NotFoundPage.jsx
│   ├── components/
│   │   ├── Navbar.jsx, Footer.jsx
│   │   ├── PulseLogo.jsx              Logo component
│   │   ├── DoctorCard.jsx, DoctorMini.jsx, FacilityCard.jsx
│   │   ├── ui.jsx                     Shared UI: PageHero, Avatar, Photo, Icon...
│   │   ├── NextWeekBooking.jsx        WhatsApp slot booking form
│   │   ├── AppointmentSlip.jsx        Printable booking slip
│   │   └── AppointmentLookup.jsx      Search / cancel bookings saved in the browser
│   ├── hooks/useReveal.js       Scroll-in animations
│   ├── router.js                Clean URLs, <Link>, GitHub Pages sub-path support
│   ├── App.jsx                  App shell: picks the page for the URL
│   ├── main.jsx                 Browser entry (takes over the pre-rendered HTML)
│   ├── entry-server.jsx         Build-time entry that renders pages to HTML
│   └── index.css                Design system: typography, colours, responsive styles
├── scripts/prerender.mjs        Writes one HTML file per page + 404.html, sitemap, robots
├── index.html                   HTML template
├── vite.config.js               Vite config (fills the home page <head>)
└── package.json                 Dependencies and scripts
```

---

## Tech Stack

- **Framework:** React 19, Vite 8
- **Icons:** Lucide React
- **Confetti:** canvas-confetti
- **Fonts:** Outfit, Plus Jakarta Sans, Noto Sans Gujarati, Anek Gujarati (Google Fonts, loaded without blocking)
- **Styling:** Plain CSS with custom properties, mobile-first
- **Storage:** Browser `localStorage` only; bookings reach the hospital through WhatsApp
- **Hosting:** GitHub Pages via `gh-pages`
