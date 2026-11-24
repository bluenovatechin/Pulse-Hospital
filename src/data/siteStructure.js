// ========================================================
// Website structure (not hospital data).
// - Facilities are grouped: each group is one section of /facilities
//   (related facilities shown inside it).
// - Only the groups people search for by name also get their own page
//   (/facilities/icu, ...). The rest live on /facilities#<id>.
// - Small amenities appear only as cards at the end of /facilities.
// - Departments all live on one page (/departments#<id>).
// ========================================================
import { FACILITIES } from './hospitalContent.js';

// group id -> related facilities shown inside that group
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

// Groups that also have a page of their own (high-intent searches such as
// "ICU in Modasa", "emergency hospital Modasa", "dialysis Modasa", "CT scan Modasa")
export const OWN_PAGE_GROUPS = ['icu', 'emergency', 'dialysis', 'ct'];

/** The group a facility belongs to (null = an amenity card) */
export function facilityGroupId(id) {
  if (FACILITY_PAGES[id]) return id;
  const owner = Object.entries(FACILITY_PAGES).find(([, members]) => members.includes(id));
  return owner ? owner[0] : null;
}

/** The separate page a facility is shown on (null = only on /facilities) */
export function facilityPageId(id) {
  const group = facilityGroupId(id);
  return group && OWN_PAGE_GROUPS.includes(group) ? group : null;
}

/** Link props for a facility: its own page, a section of one, or a section of /facilities */
export function facilityLink(id) {
  const page = facilityPageId(id);
  if (!page) return { to: 'facilities', hash: id };
  return page === id ? { to: 'facilities', param: id } : { to: 'facilities', param: page, hash: id };
}

/** Link props for a department section on the Departments page */
export const departmentLink = (id) => ({ to: 'departments', hash: id });

/** Facility groups (sections of /facilities), in the order they appear in the data */
export const FACILITY_GROUP_IDS = FACILITIES.map((f) => f.id).filter((id) => FACILITY_PAGES[id]);

/** Groups that have their own page */
export const FACILITY_PAGE_IDS = FACILITY_GROUP_IDS.filter((id) => OWN_PAGE_GROUPS.includes(id));

/** Small amenities without a group (shown as cards on /facilities) */
export const AMENITY_IDS = FACILITIES.map((f) => f.id).filter((id) => !facilityGroupId(id));
