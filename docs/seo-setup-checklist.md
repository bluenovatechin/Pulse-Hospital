# Setup checklist: domain, Google and analytics

Tasks the hospital or the site owner does outside the code, plus the small code changes each one needs.

## 1. Connect the custom domain (if `pulsehospitalmodasa.com` is owned)

1. **At the domain registrar (DNS):**
   - Add `A` records for `@` pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`.
   - Add a `CNAME` record for `www` pointing to `bluenovatechin.github.io`.
2. **In the code:**
   - `src/data/seo.js`: set `SITE_URL = 'https://pulsehospitalmodasa.com/'`.
   - `package.json`, `predeploy`: change both `--base=/Pulse-Hospital/` to `--base=/`.
   - Create `public/CNAME` containing one line: `pulsehospitalmodasa.com`.
3. Build and deploy: `npm run deploy`.
4. **In GitHub** (repository → Settings → Pages): set the custom domain, then tick **Enforce HTTPS** once it is available.
5. Regenerate the share image only if its text should show the new address: `python scripts/generate_og_card.py`.

## 2. Google Search Console

1. Go to search.google.com/search-console → **Add property** → **URL prefix** → enter the live address (the custom domain once connected).
2. **Verify ownership**, with either:
   - the HTML tag method: add the given `<meta name="google-site-verification" ...>` line to `index.html` inside `<head>`, then deploy; or
   - the DNS method (for a custom domain).
3. **Sitemaps** → submit `sitemap.xml`.
4. **URL inspection** → request indexing for Home, Doctors, Facilities and the four facility pages.
5. Check **Pages** and **Enhancements** (breadcrumbs, FAQ) after a week.
6. After 4 to 6 weeks, use **Performance → Queries** to see the real search phrases and volumes; update `docs/seo-master-prompt.md` section 5 with them.

## 3. Google Analytics 4 (optional)

1. Go to analytics.google.com → **Admin** → **Create property** → **Web data stream** for the site address.
2. Copy the **Measurement ID** (`G-XXXXXXXXXX`).
3. Paste it into `src/lib/analytics.js` → `GA_MEASUREMENT_ID`.
4. Deploy.
5. Analytics loads only for visitors who allow analytics in the cookie banner. Google signals and ad features are turned off.

## 4. Google Business Profile

- [ ] **Claim or verify** the profile at business.google.com.
- [ ] **Name**, exactly as on the website: **Pulse Hospital & I.C.U**. Don't add keywords to the name.
- [ ] **Primary category:** Hospital. **Secondary categories:** Emergency care service, Dialysis center, Medical diagnostic imaging center, as applicable.
- [ ] **Address**, exactly as on the website: 4th Floor, A-block, City Centre, Shamlaji Road, Modasa, Aravalli - 383315. Check the pin on the map.
- [ ] **Phone** +91 95120 45641; **website** = the live site address.
- [ ] **Hours:** open 24 hours (emergency). Add the OPD hours under "More hours".
- [ ] **Services:** ICU, emergency, dialysis, CT scan, laboratory, pharmacy, ambulance, and the departments.
- [ ] **Photos:** real ones only (exterior, entrance, reception, ICU, OT, rooms). Use the same originals as the website, never the AI "representative" images.
- [ ] **Appointment link:** the `/book-appointment` page.
- [ ] **Reviews:** ask real patients' families for reviews (never buy or write them), and reply politely to every review without sharing medical details.
- [ ] **Updates:** post once or twice a month (new doctor, health-camp, monsoon fever advice).
- [ ] **Website link-back:** copy the profile's public link into `HOSPITAL_INFO.sameAs` in `src/data/hospitalContent.js`, with any official Facebook and Instagram pages.

## 5. Local listings (consistent Name, Address, Phone)

List the hospital with the same name, address and phone on Justdial, Practo (for the doctors), Sulekha, Bing Places and Apple Business Connect. Fix any old listing with a different phone or spelling.

## 6. Publishing a condition page (doctor review)

1. Open the draft, for example `/conditions/dengue` on the live site. A yellow "Draft" note is shown at the top.
2. The doctor reads it and sends corrections.
3. In `src/data/conditions.js`, apply the corrections and set, for example, `review: { by: 'dr-dipesh-patel', date: '2026-12-01' }`.
4. Build and deploy. The page is then indexed, added to the sitemap, linked from the Departments page and the footer, and shows "Medically reviewed by…".

## 7. After every release

- Rich Results Test (search.google.com/test/rich-results) and validator.schema.org: Home, one doctor page, one facility page, one published condition page.
- PageSpeed Insights (pagespeed.web.dev): Home on mobile.
- Share the home link in a WhatsApp chat to check the preview (WhatsApp caches previews; test with a page that was never shared, or add `?v=2`).
