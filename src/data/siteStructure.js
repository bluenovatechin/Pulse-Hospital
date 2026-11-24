// ========================================================
// Which facilities get their own page (website structure, not hospital
// data). Related facilities appear as sections on the same page, and the
// small amenities appear only as cards on the Facilities page.
// Departments all live on one page (/departments#<id>).
// ========================================================
import { FACILITIES } from './hospitalContent.js';

// page id -> facilities shown as extra sections on that page
export const FACILITY_PAGES = {
  icu: ['isolation', 'nursing'],
  emergency: ['ambulance'],
  dialysis: [],
  ct: ['imaging'],
  lab: [],
  ot: ['lap-endo'],
  deluxe: ['twin'],
  'pulmo-lab': ['physio']
};

/** The page a facility lives on (null = no page of its own: an amenity card) */
export function facilityPageId(id) {
  if (FACILITY_PAGES[id]) return id;
  const owner = Object.entries(FACILITY_PAGES).find(([, members]) => members.includes(id));
  return owner ? owner[0] : null;
}

/** Link props for a facility: its page, a section on its group page, or its card */
export function facilityLink(id) {
  const page = facilityPageId(id);
  if (!page) return { to: 'facilities', hash: id };
  return page === id ? { to: 'facilities', param: id } : { to: 'facilities', param: page, hash: id };
}

/** Link props for a department section on the Departments page */
export const departmentLink = (id) => ({ to: 'departments', hash: id });

/** Facilities with their own page, in the order they appear in the data */
export const FACILITY_PAGE_IDS = FACILITIES.map((f) => f.id).filter((id) => FACILITY_PAGES[id]);

/** Small amenities without a page (shown as cards on /facilities) */
export const AMENITY_IDS = FACILITIES.map((f) => f.id).filter((id) => !facilityPageId(id));
