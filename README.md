# Pulse Hospital & I.C.U — Official Web App

Modern, mobile-first website and WhatsApp appointment booking system for **Pulse Hospital & I.C.U**, 4th Floor, A-block, City Centre, Shamlaji Road, Modasa, Arvalli – 383315, Gujarat.

Patients can explore the hospital's facilities, departments and doctors, schedule advance 30-minute OPD slots for the coming week, generate an instant printable booking slip, and automatically forward their appointment request directly to the hospital's WhatsApp reception desk.

Built as a **100% serverless, zero-maintenance static web application**, ready for instant free hosting on **GitHub Pages**, **Vercel**, or any static host.

---

## Quick Start

Requires **Node.js 18+**.

```bash
# 1. Install dependencies (client only)
npm --prefix client install

# 2. Start local development server
npm run dev
```

Visit: **http://localhost:5173**

### Commands

| Command | Purpose |
|---|---|
| `npm run dev` / `npm start` | Starts Vite local dev server (`http://localhost:5173`) |
| `npm run build` | Builds optimized production bundle to `client/dist/` |
| `npm run preview` | Previews the production build locally |

---

## Key Features

- **WhatsApp-Powered OPD Booking**: Choose a doctor, select any date from next Monday to Sunday, pick an available 30-minute morning or evening slot, and confirm. The app formats an official booking message and opens WhatsApp directly to the hospital desk (`+91 63533 44875`).
- **Instant Printable Appointment Slip**: Generates an official hospital receipt with a unique Reference Token (`PLS-XXXXXX`), doctor room, appointment timing, and hospital address. Patients can print or save as PDF.
- **Device-Local Booking History**: Automatically saves bookings to the patient's browser storage (`localStorage`), allowing them to track past bookings or view slips without requiring any backend database or login.
- **Direct Hospital Inquiries**: Contact page form sends structured patient queries directly to the hospital WhatsApp line.
- **Gujarati & English**: Instant toggle in the top bar for both languages.
- **Emergency Priority**: Direct dial buttons (`tel:+916353344875`) prominently visible on desktop and mobile action bars for 24x7 trauma & emergency care.
- **Hospital Photo Tour**: High-resolution gallery of ICU, modular OTs, CT scan, and private wards.

---

## Deployment (GitHub Pages)

This project is pre-configured for automated continuous deployment to **GitHub Pages** via GitHub Actions ([`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)).

### One-Time Setup on GitHub:
1. In your GitHub repository ([`bluenovatechin/Pulse-Hospital`](https://github.com/bluenovatechin/Pulse-Hospital)), go to **Settings** → **Pages**.
2. Under **Build and deployment > Source**, select **GitHub Actions**.
3. Push to `main`: every push automatically builds and deploys your site to:
   **`https://bluenovatechin.github.io/Pulse-Hospital/`**

Direct page refreshes and subpath routing work out-of-the-box thanks to Vite's automatic base resolution and the built-in `404.html` SPA fallback.

---

## Project Structure

```
Pulse Hospital/
├── client/                      React 19 + Vite website
│   ├── public/
│   │   ├── rendered.png         Official Pulse Hospital cross logo
│   │   ├── favicon.svg          Browser tab icon
│   │   └── assets/              Hospital photos and gallery images
│   └── src/
│       ├── data/
│       │   └── hospitalContent.js   ← Single source of truth: doctors, facilities,
│       │                              departments, photos, FAQs, phone numbers, address
│       ├── pages/               One component per page (Home, Facilities, Departments,
│       │                        Doctors, Gallery, About, Contact, Privacy, Terms)
│       ├── components/
│       │   ├── Navbar.jsx, Footer.jsx
│       │   ├── PulseLogo.jsx    Official rendered logo component
│       │   ├── DoctorCard.jsx, FacilityCard.jsx
│       │   ├── DetailDrawers.jsx Slide-in facility / doctor panels
│       │   ├── ui.jsx           Shared UI components: Avatar, PageHero, Icon...
│       │   ├── NextWeekBooking.jsx Direct WhatsApp slot booking engine
│       │   ├── AppointmentSlipModal.jsx Printable hospital slip
│       │   └── AppointmentLookupModal.jsx Local storage appointment tracker
│       ├── hooks/useReveal.js   Scroll-in reveal animations
│       ├── router.js            Clean HTML5 path routing with GitHub Pages subpath support
│       ├── App.jsx              Root application shell
│       └── index.css            Design system: typography, tokens, responsive styles
├── .github/workflows/
│   └── deploy-pages.yml         GitHub Actions auto-deployment to GitHub Pages
└── package.json                 Root development scripts
```

---

## Tech Stack

- **Framework**: React 19, Vite 8
- **Icons**: Lucide React
- **Confetti**: Canvas-confetti
- **Typography**: Outfit, Plus Jakarta Sans, Noto Sans Gujarati (Google Fonts)
- **Styling**: Vanilla CSS design system with custom CSS variables, responsive mobile-first layouts, and dark mode accents
- **Storage**: Browser `localStorage` for patient receipts + WhatsApp Web / WhatsApp Mobile API for instant reception handoff
