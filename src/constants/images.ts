// Centralized padel-specific image URLs (Unsplash).
// Photo IDs verified to depict padel courts (the glass-walled racquet sport),
// not tennis or badminton.
const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

// Verified padel court photos (resolved from unsplash.com download redirects)
const PADEL_COURT_1 = "1673266893352-6de89e258064"; // P-squared aerial padel night
const PADEL_COURT_2 = "1709587824645-cf6dd2041e2b"; // blue padel glass court
const PADEL_COURT_3 = "1709587825135-80b00570c355"; // padel court w/ buildings
const PADEL_COURT_4 = "1646651105454-6c167ea6f83b"; // padel arena
const PADEL_COURT_5 = "1646649852046-b758d2d573f3"; // padel court 2
const PADEL_COURT_6 = "1613870930431-a09c7139eb33"; // padel match

export const PADEL_IMAGES = {
  hero: u(PADEL_COURT_1, 1920),
  facility: u(PADEL_COURT_2, 1200),
  facilitySecondary: u(PADEL_COURT_4, 1000),
  gallery: {
    feature: u(PADEL_COURT_1, 1600),
    a: u(PADEL_COURT_2, 1000),
    b: u(PADEL_COURT_3, 1000),
    c: u(PADEL_COURT_4, 1000),
    d: u(PADEL_COURT_5, 1000),
    e: u(PADEL_COURT_6, 1000),
  },
  fieldFallbacks: [
    u(PADEL_COURT_1, 1000),
    u(PADEL_COURT_2, 1000),
    u(PADEL_COURT_3, 1000),
    u(PADEL_COURT_4, 1000),
  ],
};
