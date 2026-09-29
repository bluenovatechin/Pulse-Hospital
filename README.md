# Pulse Hospital & I.C.U — Website

Website and appointment-booking system for **Pulse Hospital & I.C.U**, 4th Floor, A-block, City Centre, Shamlaji Road, Modasa, Arvalli – 383315, Gujarat.

Patients can explore the hospital's facilities, departments and doctors, book a 30-minute OPD slot for the coming week, and look up or cancel their booking. Reception staff use a built-in portal to manage appointments. The site is available in English and Gujarati.

---

## Quick start

Requires **Node.js 18+**.

```bash
# 1. Install dependencies (first time only)
npm --prefix client install
npm --prefix server install

# 2. Start the API and the website together
npm run dev
```

| What | URL |
|---|---|
| Website | http://localhost:5173 |
| API | http://localhost:5000/api |

The Vite dev server forwards every `/api/...` request to port 5000, so both must be running. The website falls back to a locally generated schedule if the API is down, but bookings will not save.

### Other commands

| Command (run from the project root) | Does |
|---|---|
| `npm run dev` / `npm start` | Starts API + website (`run-all.js`) |
| `npm run server` | API only |
| `npm run client` | Website only |
| `npm run build` | Builds the website into `client/dist/` |
| `npx --prefix client oxlint client/src` | Lints the website code |

---

## Project structure

```
Pulse Hospital/
├── client/                      React 19 + Vite website
│   ├── public/assets/           Hospital photos (gallery-1…16.jpeg) and brochure scans
│   └── src/
│       ├── data/
│       │   └── hospitalContent.js   ← ALL site content: doctors, facilities, departments,
│       │                              photos, FAQs, phone numbers, address
│       ├── pages/               One file per page (Home, Facilities, Departments, Doctors,
│       │                        Gallery, About, Contact)
│       ├── components/
│       │   ├── Navbar.jsx, Footer.jsx
│       │   ├── DoctorCard.jsx, FacilityCard.jsx
│       │   ├── DetailDrawers.jsx      Slide-in facility / doctor panels
│       │   ├── ui.jsx                 Shared pieces: Icon, Avatar, PageHero, Drawer…
│       │   ├── NextWeekBooking.jsx    Booking form
│       │   ├── AppointmentSlipModal.jsx, AppointmentLookupModal.jsx
│       │   └── AdminPortal.jsx        Staff & reception portal
│       ├── hooks/useReveal.js   Scroll-in animations
│       ├── api.js               Server address (VITE_API_URL)
│       ├── router.js            Hash-based URLs (#/doctors/4)
│       ├── App.jsx              Page switching, popups, floating buttons
│       └── index.css            Design system: colours, fonts, all component styles
│
├── server/                      Express API
│   ├── server.js                Entry point (port 5000, or $PORT)
│   ├── routes/ → controllers/ → services/ → models/storage.js
│   ├── middleware/requireStaffKey.js   Staff-portal password check
│   └── data/pulse_hospital_db.json   Doctors, appointments and inquiries (created on first run)
│
├── .github/workflows/           Auto-deploy of the website to GitHub Pages
├── render.yaml                  One-click API hosting on Render
├── run-all.js                   Starts server + client together
└── package.json                 Root scripts
```

---

## Pages

Every page and panel has its own URL, so the browser Back button works and links can be shared.

| Page | URL | What it shows |
|---|---|---|
| Home | `#/` | Emergency card, quick actions, featured facilities, doctors, booking steps, conditions treated, patient stories, FAQ |
| Facilities | `#/facilities` | All facilities, filterable by category, plus the brochure checklist |
| ↳ Facility panel | `#/facilities/icu` | What's included, who it's for, 24x7 or not, doctors, departments |
| Departments | `#/departments` | Conditions treated, services, facilities and doctors for each department |
| ↳ Department | `#/departments/chest` | Scrolls to that department |
| Doctors | `#/doctors` | Consultants and 24x7 resident doctors, "What they do", search, filters, weekly timetable |
| ↳ Doctor panel | `#/doctors/4` | Full profile with timings, room, specialties, booking |
| Hospital Tour | `#/gallery` | Photo gallery with full-screen viewer |
| About | `#/about` | Hospital story and values |
| Contact | `#/contact` | Phone, address, hours, map, inquiry form |

Popups (no URL): **Book appointment**, **Appointment slip**, **My Booking** (look up or cancel), **Staff portal**.

The old `#/services` link redirects to Facilities.

---

## Features

- **Next-week slot booking**: choose a doctor, a day (next Monday to Sunday) and a free 30-minute slot. The server re-checks the slot before confirming, so double booking is impossible.
- **Appointment slip**: a booking ID (e.g. `PLS-920101`) you can print or share to WhatsApp.
- **My Booking**: search by mobile number or booking ID, view the slip or cancel.
- **Staff portal**: all appointments with filters and statistics, plus status updates.
- **Contact inquiries**: saved on the server for reception to call back.
- **Gujarati / English**: toggle in the top bar.
- **Mobile friendly**: a bottom action bar on phones (Emergency · My booking · Book slot) and floating buttons on desktop.
- **Accessible**: keyboard-friendly, Escape closes popups, and animations turn off for users who prefer reduced motion.

---

## API

All endpoints are under `/api`.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/hospital-info` | Hospital details |
| GET | `/doctors`, `/doctors/:id` | Doctor list / one doctor |
| GET | `/next-week-schedule` | The 7 bookable days |
| GET | `/slots?doctorId=1&date=2026-10-05` | Morning and evening slots with availability |
| POST | `/appointments` | Create a booking |
| GET | `/appointments/:id` | One booking |
| GET | `/appointments-lookup?query=98250…` | Find bookings by mobile number or ID |
| PATCH | `/appointments/:id/cancel` | Cancel a booking |
| POST | `/contact` | Save an inquiry |
| GET | `/admin/appointments` | All bookings (staff) |
| PATCH | `/admin/appointments/:id/status` | Change booking status (staff) |
| GET | `/admin/stats` | Dashboard figures (staff) |

> The `/admin/*` endpoints require the header `x-admin-key` to match the server's `ADMIN_KEY`. The Staff portal asks for this key. When `ADMIN_KEY` is unset, the portal stays open on your own computer but is switched off when `NODE_ENV=production`.

---

## Making changes

Most content changes are a single edit in **`client/src/data/hospitalContent.js`**. The website reloads by itself while `npm run dev` is running. Server changes need a restart.

| I want to change… | Edit |
|---|---|
| Text, doctors, facilities, departments, photos, FAQs, phone, address | `client/src/data/hospitalContent.js` |
| Colours, fonts, spacing, animations | `client/src/index.css` (tokens at the top) |
| The layout of one page | `client/src/pages/<Page>.jsx` |
| Slot times, booking rules, WhatsApp message | `server/services/` |

### Add a doctor

1. In `hospitalContent.js`, copy an entry in `DOCTORS` and give it the next `id`.
2. Fill in `initials`, two `colors` for the monogram, `type` (`"visiting"` or `"resident"`), `whatTheyDo` and `departmentIds`.
3. Add the `id` to the `doctorIds` of the facilities and departments where they work.
4. **Add the same doctor, with the same `id`,** to the `doctors` array in `server/data/pulse_hospital_db.json`, including `availableDays`, `morningShift` and `eveningShift`. Also add them to `INITIAL_DOCTORS` in `server/models/storage.js` so fresh installs include them.
5. Restart the server.

### Add a facility

1. Add an object to `FACILITIES` with a unique `id` and a `category` from `FACILITY_CATEGORIES`.
2. Set `photo` to a `PHOTOS` entry, or `null` to show an illustrated icon tile.
3. Write `summary`, `includes`, `goodFor`, and set `is24x7`.
4. Optionally list it in a department's `facilityIds`, and add its `id` to `FEATURED` in `pages/HomePage.jsx` to show it on the home page.

### Add a department

Add an object to `DEPARTMENTS` with `id`, `title`, `titleGujarati`, `icon`, `intro`, `conditions`, `services`, `facilityIds` and `doctorIds`. It then appears on the Departments page, on the home page and as a doctor filter.

### Add a photo

1. Put the file in `client/public/assets/`.
2. Add it to `PHOTOS`, then to `GALLERY_IMAGES` with `title`, `titleGujarati` and `category`.

The current photos are Instagram screenshots, so `.photo > img` in `index.css` zooms in (`transform: scale(1.3)`) to hide the slide counter and mute icon. Remove that line once you have clean original photos.

### Use a new icon

Icons come from [lucide.dev](https://lucide.dev/icons). Import the icon and add it to the `ICONS` map in `components/ui.jsx`, then use its name as `icon` in the data file.

### Add a page

1. Create `client/src/pages/NewPage.jsx` (copy `AboutPage.jsx` as a starting point).
2. Add its id to `PAGES` in `client/src/router.js`.
3. Render it in `App.jsx` next to the other pages.
4. Add it to `NAV_LINKS` in `components/Navbar.jsx`. The footer uses the same list.

### Change the phone number

Update all of these:

- `HOSPITAL_INFO.appointmentNumber`, `phoneHref` and `whatsappNumber` in `hospitalContent.js`
- `HOSPITAL_WHATSAPP_NUMBER` on the server (or its default in `server/services/whatsappService.js`)
- The WhatsApp link in `client/src/components/AppointmentSlipModal.jsx`

---

## Before going live

- [ ] Replace the **testing phone number** `+91 63533 44875` with the hospital's real lines (brochure: `95120 45641` / `95120 45642`, currently commented out).
- [ ] Set a long random `ADMIN_KEY` on the server host and share it only with reception staff.
- [ ] Give the server **persistent storage** (see Deployment). Otherwise bookings are lost on restart.
- [ ] Replace the sample **patient testimonials** with real, consented reviews.
- [ ] Add photos of the CT scanner, dialysis unit, lab and pharmacy, and doctor portraits.
- [ ] Delete the unused files: `server/db.js`, the root `pulseHospitalData.js` / `.json` and `client/src/data/pulseHospitalData.*`.

---

## Deployment

The project is one GitHub repository with two parts that are hosted separately:

| Part | Where | Why |
|---|---|---|
| Website (`client/`) | **GitHub Pages**, free | It builds to plain HTML, CSS and JS files |
| Booking API (`server/`) | **Render** (or any Node host) | GitHub Pages cannot run a Node server |

```
Visitor ──► https://<user>.github.io/<repo>/   (GitHub Pages: website)
               │  booking, lookup, contact, staff portal
               ▼
            https://<api>.onrender.com/api       (Render: server/)
               │
               ▼
            server/data/pulse_hospital_db.json    (bookings and inquiries)
```

### What stays off GitHub

`.gitignore` already excludes these. Keep it that way:

- `server/data/`: patient names, phone numbers and symptoms. The server recreates it with sample data when it's missing.
- `.env` files: the staff key and URLs. Set them in the host's settings instead; the `.env.example` files show which ones.
- `node_modules/` and `client/dist/`: reinstalled and rebuilt automatically.

Everything else in the code is meant to be public. The phone numbers in `hospitalContent.js` and the brochure scans will be visible to anyone.

### 1. Push to GitHub

Repository: https://github.com/bluenovatechin/Pulse-Hospital

```bash
git add .
git commit -m "Pulse Hospital website and booking API"
git remote add origin https://github.com/bluenovatechin/Pulse-Hospital.git
git push -u origin main
```

On a free GitHub account, GitHub Pages requires the repository to be **public**.

### 2. Host the API on Render

1. Sign in at [render.com](https://render.com) with GitHub → **New → Blueprint** → choose this repo. It reads `render.yaml`.
2. When asked, set:
   - `ADMIN_KEY`: a long random value, e.g. `node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"`
   - `CORS_ORIGIN`: `https://bluenovatechin.github.io`
   - `META_WA_TOKEN`, `META_WA_PHONE_NUMBER_ID`, `WHATSAPP_NOTIFY_TO`: see [WhatsApp booking alerts](#whatsapp-booking-alerts)
3. Wait for the deploy, then open `https://<name>.onrender.com/api/health` to check it's running.

> **Storage warning.** On Render's free plan the server's files are reset on every restart. Free instances also sleep after 15 minutes idle, and the first request then takes about a minute. For real patients, use a paid instance with the persistent disk shown (commented out) in `render.yaml`, or move bookings to a database.

### 3. Publish the website on GitHub Pages

1. In the repo: **Settings → Pages → Source: GitHub Actions**.
2. **Settings → Secrets and variables → Actions → Variables → New repository variable**: `VITE_API_URL` = your Render URL (no trailing slash).
3. Go to **Actions → Deploy website to GitHub Pages → Run workflow**. Later pushes that change `client/` redeploy automatically.
4. The site is live at `https://bluenovatechin.github.io/Pulse-Hospital/`.

URLs use `#/` (e.g. `#/doctors/4`), so page refreshes work on GitHub Pages without extra setup. A custom domain can be added under **Settings → Pages**. If you add one, update `CORS_ORIGIN` on Render to match.

---

## WhatsApp booking alerts

Every new booking sends a WhatsApp message to hospital staff with the token ID, patient, phone, doctor, date, slot and reason. The message is sent after the booking is saved. If sending fails, the booking still succeeds and the error appears in the server log.

Choose a provider with `WHATSAPP_PROVIDER` on the server. See `server/.env.example` for every setting.

### Option A: CallMeBot (third-party, not used by default)

Best for alerting a few staff phones. Each phone that should receive alerts activates it once:

1. Go to [callmebot.com → WhatsApp API](https://www.callmebot.com/blog/free-api-whatsapp-messages/) and follow the steps: save their number in the phone's contacts and send them the activation message from WhatsApp.
2. CallMeBot replies with an **API key** for that phone.
3. On the server set:
   ```
   WHATSAPP_PROVIDER=callmebot
   CALLMEBOT_RECIPIENTS=916353344875:<apikey>
   ```
   Separate several phones with commas: `916353344875:111111,919512045641:222222`.

CallMeBot is a free third-party service for personal use and handles the message contents (patient names and phones). For an official business setup, use option B.

### Option B: Meta WhatsApp Cloud API (official)

1. Create an app at [developers.facebook.com](https://developers.facebook.com) → add the **WhatsApp** product, and register a business phone number.
2. Create a message template, e.g. `new_appointment`, whose body has five variables: `{{1}}` token ID, `{{2}}` patient, `{{3}}` phone, `{{4}}` doctor, `{{5}}` date & slot. Wait for approval.
3. On the server set `WHATSAPP_PROVIDER=meta`, `META_WA_TOKEN` (a permanent system-user token), `META_WA_PHONE_NUMBER_ID`, `WHATSAPP_NOTIFY_TO` (staff numbers) and `META_WA_TEMPLATE=new_appointment`.

### Test it

Locally: copy `server/.env.example` to `server/.env`, fill in your values, then:

```bash
npm --prefix server run test:whatsapp
```

You should receive a "Test Patient" message. On Render, make a test booking on the live site and check the service's **Logs** for a `📲 [WHATSAPP]` line.

---

## Tech stack

| Part | Uses |
|---|---|
| Website | React 19, Vite 8, lucide-react icons, canvas-confetti |
| Fonts | Outfit, Plus Jakarta Sans, Noto Sans Gujarati (Google Fonts) |
| API | Node.js, Express 4, CORS |
| Storage | A single JSON file (`server/data/pulse_hospital_db.json`) |
