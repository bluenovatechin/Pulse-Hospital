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
| `npm run build` | Builds the production site into `dist/` (served from `/`, e.g. for Vercel) |
| `npm run preview` | Serves the `dist/` build locally to check it |
| `npm run lint` | Checks the code with Oxlint |
| `npm run deploy` | Builds for GitHub Pages and publishes it (see below) |

---

## How Booking Works

1. The patient chooses a doctor, a date from next Monday to Sunday, and a free 30-minute morning or evening slot.
2. They fill in their name, mobile number and (optionally) age, city, previous file number and symptoms.
3. On **Book Slot via WhatsApp**, the app:
   - opens WhatsApp with a ready-made booking message addressed to the hospital desk (`+91 63533 44875`),
   - shows a printable appointment slip with a reference ID (`PLS-XXXXXX`),
   - saves the booking in the patient's own browser (`localStorage`) so they can see it again under **My booking**.

Nothing is stored on a server. The hospital receives bookings only as WhatsApp messages, and slot availability is not checked against other patients' bookings — reception confirms each booking on WhatsApp.

The Contact page form works the same way: it opens a WhatsApp message to the hospital.

### Changing hospital details

All content lives in **[`src/data/hospitalContent.js`](src/data/hospitalContent.js)**: doctors, facilities, departments, photos, phone numbers, the WhatsApp number (`whatsappNumber`) and the address. Edit it there and redeploy.

---

## Features

- **WhatsApp OPD booking** — slot-wise advance booking for the coming week, sent directly to the hospital desk.
- **Printable appointment slip** — print or save as PDF.
- **My booking** — patients can look up, view or cancel bookings made on the same device; cancelling also prepares a WhatsApp cancellation message.
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
- Refreshing any page (e.g. `/Pulse-Hospital/doctors`) works because the build also writes a `404.html` copy of the app.
- Never edit the `gh-pages` branch by hand; it is overwritten on every deploy.

---

## Project Structure

```
Pulse Hospital/
├── public/                      Copied as-is into the build
│   ├── rendered.png             Official Pulse Hospital logo
│   ├── favicon.svg              Browser tab icon
│   └── assets/                  Hospital photos used on the site
├── src/
│   ├── data/
│   │   └── hospitalContent.js   Single source of truth: doctors, facilities,
│   │                            departments, photos, phone numbers, address
│   ├── pages/                   One component per page (Home, Facilities, Departments,
│   │                            Doctors, Gallery, About, Contact, Privacy, Terms)
│   ├── components/
│   │   ├── Navbar.jsx, Footer.jsx
│   │   ├── PulseLogo.jsx              Logo component
│   │   ├── DoctorCard.jsx, FacilityCard.jsx
│   │   ├── DetailDrawers.jsx          Slide-in facility / doctor panels
│   │   ├── ui.jsx                     Shared UI: Avatar, PageHero, Icon...
│   │   ├── NextWeekBooking.jsx        WhatsApp slot booking form
│   │   ├── AppointmentSlipModal.jsx   Printable appointment slip
│   │   └── AppointmentLookupModal.jsx "My booking" (browser-stored bookings)
│   ├── hooks/useReveal.js       Scroll-in animations
│   ├── router.js                Clean URL routing, supports the GitHub Pages sub-path
│   ├── App.jsx                  App shell, modals and navigation
│   ├── main.jsx                 React entry point
│   └── index.css                Design system: typography, colours, responsive styles
├── assets/                      Original photo files (not used by the build)
├── index.html                   HTML entry page
├── vite.config.js               Vite configuration (+ 404.html fallback for GitHub Pages)
└── package.json                 Dependencies and scripts
```

---

## Tech Stack

- **Framework:** React 19, Vite 8
- **Icons:** Lucide React
- **Confetti:** canvas-confetti
- **Fonts:** Outfit, Plus Jakarta Sans, Noto Sans Gujarati (Google Fonts)
- **Styling:** Plain CSS with custom properties, mobile-first
- **Storage:** Browser `localStorage` only; bookings reach the hospital through WhatsApp
- **Hosting:** GitHub Pages via `gh-pages`
