# SEO, AEO & GEO prompt: Pulse Hospital & I.C.U, Modasa

Use this prompt when asking an AI tool (or a developer) to work on the website's search visibility. It is written for this website as it is built today, with its real data.

---

## 1. Context: what already exists (do not rebuild)

- **Website:** React 19 + Vite. Every page is pre-rendered to full HTML at build time (`scripts/prerender.mjs`), so search engines and AI tools read complete content without JavaScript. Hosted on GitHub Pages at `https://bluenovatechin.github.io/Pulse-Hospital/` (a custom domain can replace it; see `docs/seo-setup-checklist.md`).
- **Single source of truth:** all hospital facts live in `src/data/hospitalContent.js` (doctors, departments, facilities, FAQs, address, phones, hours). Condition pages live in `src/data/conditions.js`. Titles, descriptions and structured data live in `src/data/seo.js`. Never write facts anywhere else.
- **Built automatically on every build:**
  - unique title, meta description and canonical link for every page;
  - Open Graph and X/Twitter tags in the initial HTML, with the 1200×630 share image `public/og-image.png` (made from the doctors' own portraits by `scripts/generate_og_card.py`);
  - JSON-LD: `Hospital` (address, geo, 24x7 hours, specialties), `Physician` for every doctor (GMC registration, qualification, college), `MedicalWebPage`, `BreadcrumbList`, `FAQPage`, `VideoObject`, `MedicalCondition` on condition pages;
  - `sitemap.xml` with image entries, `robots.txt`, `llms.txt` and `llms-full.txt` (all generated from the data);
  - forwarding files for old addresses (for example `/facilities/lab` → `/facilities#lab`).
- **Site structure (20 pages in the sitemap):**
  - 10 main pages: Home, Doctors, Departments, Facilities, Book appointment, Gallery, About, Contact, Privacy, Terms;
  - 6 doctor profiles;
  - 4 facility pages for the most-searched services: ICU, Emergency & Trauma, Dialysis, CT scan. All other facilities are sections of `/facilities`;
  - Departments are sections of one page (`/departments#<id>`);
  - 12 condition pages under `/conditions/<slug>`, as drafts awaiting doctor review (see section 4).
- **Languages:** English and Gujarati on the same address (language switch). Gujarati spellings: મોડાસા (Modasa), અરવલ્લી (Aravalli).
- **Booking:** no server. Appointment requests go to the hospital on WhatsApp; there are no forms that store data on a server.

## 2. Hospital facts (verified, from the site data)

- **Name:** Pulse Hospital & I.C.U (પલ્સ હોસ્પિટલ એન્ડ આઈ.સી.યુ.). Tagline: Caring For Life.
- **Address:** 4th Floor, A-block, City Centre, Shamlaji Road, Modasa, Aravalli - 383315, Gujarat.
- **Phone / WhatsApp:** +91 95120 45641, +91 95120 45642.
- **Hours:** Emergency, ICU, dialysis, lab and pharmacy 24x7. OPD Monday to Saturday.
- **Size:** 41 beds, including a 30-bed critical care department (15 ICCU, 7 MICU, 7 SICU, 1 isolation).
- **Doctors:** MD physicians, a DM (Cardiology) interventional cardiologist, a chest physician (DTCD, FICCM) and a resident medical officer. Surgery is done by visiting surgical teams.
- **What it is NOT:** do not describe it as "multispeciality", "the best", "the leading" or "No. 1", and do not claim accreditations, ratings, awards or reviews unless the hospital provides proof.

## 3. Goals

1. Be found for real local searches, including by people who don't know the hospital's name: emergency, ICU, dialysis, CT scan, specific doctors, and conditions such as dengue, heart attack, stroke, snakebite or poisoning in Modasa and the Aravalli district.
2. Make it easy for Google, Google AI Overviews, ChatGPT, Gemini and Perplexity to state correctly what the hospital is, where it is, who its doctors are, what it treats and how to contact it.
3. Keep patients' trust: accurate, simple, bilingual information with call, WhatsApp and booking always one tap away.

Never promise rankings, sitelinks or inclusion in AI answers.

## 4. Rules for medical content (most important)

- Health pages are "Your Money or Your Life" content. Only publish what a Pulse Hospital doctor has reviewed.
- A condition page in `src/data/conditions.js` stays a **draft** (`review: null`): it is not indexed, not in the sitemap and not linked from menus. To publish it, a doctor reads it and sets `review: { by: '<doctor slug>', date: 'YYYY-MM-DD' }`. The page then shows "Medically reviewed by…" and goes live everywhere automatically.
- Only add conditions the hospital really treats (they must appear in a department's "Conditions treated" in `hospitalContent.js`).
- Name only tests and treatments the hospital data lists (for example: dengue/malaria/typhoid panels, troponin, ABG, CT, 2D Echo, PFT, bronchoscopy, anti-snake venom, dialysis, ventilators, stroke thrombolysis). Don't claim a cath lab, blood bank or anything else not listed.
- No cures, guarantees, success rates or drug doses. Every page ends with "general information, not a diagnosis".
- Prefer 8 to 15 strong pages over many thin ones. No near-duplicate pages per town ("doorway pages").

## 5. Search phrases to target (no invented volumes)

Group by intent; use them naturally in headings and text, never as keyword lists. Check real volumes in Google Search Console (after verification) or Google Ads Keyword Planner.

| Intent | English | Gujarati | Gujarati typed in English |
|---|---|---|---|
| Hospital | hospital in Modasa, hospital near me Modasa, ICU hospital Modasa, hospital in Aravalli | મોડાસા હોસ્પિટલ, મોડાસામાં હોસ્પિટલ | modasa hospital, pulse hospital modasa |
| Emergency | emergency hospital Modasa, 24 hour hospital Modasa, ambulance Modasa | મોડાસા ઇમરજન્સી હોસ્પિટલ | emergency hospital modasa |
| ICU | ICU in Modasa, ventilator ICU Modasa, ICCU Modasa | મોડાસા ICU, વેન્ટિલેટર | icu modasa |
| Dialysis | dialysis centre Modasa, 24x7 dialysis Aravalli | મોડાસા ડાયાલિસિસ | dialysis modasa |
| CT scan | CT scan Modasa, CT scan near me | મોડાસા સીટી સ્કેન | ct scan modasa |
| Doctors | physician in Modasa, cardiologist Modasa, chest specialist Modasa, diabetes doctor Modasa, [doctor name] Modasa | મોડાસા ડૉક્ટર, હૃદયરોગ નિષ્ણાત | dr dipesh patel modasa |
| Conditions | dengue treatment Modasa, heart attack hospital Modasa, stroke treatment Modasa, snake bite treatment Modasa, poisoning treatment Modasa, typhoid / malaria treatment Modasa | ડેન્ગ્યુ સારવાર, લકવો સારવાર, સાપ કરડે તો શું કરવું | dengue ni sarvar |
| Nearby towns | hospital near Dhansura / Bayad / Malpur / Meghraj / Shamlaji | ધનસુરા, બાયડ, માલપુર, મેઘરજ, શામળાજી | |

Nearby towns belong in one "Serving Modasa and nearby towns" section (already on the About page), not in separate pages.

## 6. Tasks (in order)

1. **Domain:** if `pulsehospitalmodasa.com` is owned, connect it (steps in `docs/seo-setup-checklist.md`). Every canonical link, the sitemap and the share previews switch with one line (`SITE_URL` in `src/data/seo.js`).
2. **Medical review:** get the 12 draft condition pages reviewed and published; add more only with a reviewing doctor.
3. **Official profiles:** add the Google Business Profile, Facebook and Instagram links to `HOSPITAL_INFO.sameAs`.
4. **Measurement:** verify Google Search Console and submit `sitemap.xml`; optionally set the GA4 ID in `src/lib/analytics.js` (it loads only after cookie consent).
5. **Google Business Profile:** follow the checklist; keep Name, Address and Phone exactly as on the website.
6. **Content upkeep:** when a doctor, timing, facility or department changes, update `hospitalContent.js` only and rebuild. Titles, structured data, sitemap and `llms.txt` follow automatically.
7. **Check after each release:** Google Rich Results Test and Schema Markup Validator on Home, one doctor, one facility and one published condition page; PageSpeed Insights on Home (mobile).

## 7. Never do

Keyword stuffing, hidden text, fake reviews or ratings, fake backlinks, invented doctors or services, structured data that says something the visible page doesn't, separate near-identical pages per keyword or town, or unreviewed medical advice.
