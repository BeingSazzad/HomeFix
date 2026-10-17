/**
 * Trade-correct photography only.
 * Do not reuse plumbing/electrician hero shots for HVAC, painting, etc.
 */
const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const p = (id: string, w = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

export const photos = {
  hero: u("photo-1621905252507-b35492cc74b4", 2200),
  heroInset: u("photo-1585704032915-c3400ca199e7", 900),
  trust: u("photo-1504328345606-18bbc8c9d7d1", 1400),
  trustAlt: u("photo-1581578731548-c64695cc6952", 900),
  cta: u("photo-1558618666-fcd25c85cd64", 2000),
  banner: u("photo-1504328345606-18bbc8c9d7d1", 1800),
  auth: u("photo-1621905252507-b35492cc74b4", 2200),
  banners: {
    pros: u("photo-1621905252472-943afaa20e20", 1800),
    how: u("photo-1585704032915-c3400ca199e7", 1800),
    jobs: u("photo-1556911220-bff31c812dba", 1800),
    pricing: u("photo-1503387762-592deb58ef4e", 1800),
    contact: u("photo-1581578731548-c64695cc6952", 1800),
    about: u("photo-1621905252507-b35492cc74b4", 1800),
    legal: u("photo-1504328345606-18bbc8c9d7d1", 1800),
  },
  /** Cover / card image per trade — must match the craft visually */
  services: {
    "appliance-repair": p("4391470"),
    electrical: u("photo-1621905252472-943afaa20e20", 1200),
    hvac: p("5463587"),
    handyman: u("photo-1581578731548-c64695cc6952", 1200),
    landscaping: u("photo-1416879595882-3373a0480b5b", 1200),
    painting: u("photo-1589939705384-5185137a7f0f", 1200),
    "pest-control": u("photo-1584622650111-993a426fbf0a", 1200),
    plumbing: u("photo-1607472586893-edb57bdc0e39", 1200),
    roofing: u("photo-1632759145351-1d592919f522", 1200),
  } as Record<string, string>,
  /** Extra portfolio shots — kept trade-pure */
  portfolio: {
    plumbing: [u("photo-1585704032915-c3400ca199e7", 900), p("1216589"), p("6474471")],
    electrical: [u("photo-1558618666-fcd25c85cd64", 900), p("257736"), u("photo-1621905252472-943afaa20e20", 900)],
    hvac: [p("5463587"), p("5463576"), u("photo-1568634699096-82c9765548a0", 900)],
    painting: [u("photo-1589939705384-5185137a7f0f", 900), p("1669754"), p("6474481")],
    handyman: [u("photo-1581578731548-c64695cc6952", 900), p("1249611")],
    landscaping: [u("photo-1416879595882-3373a0480b5b", 900), p("1301856")],
    roofing: [u("photo-1632759145351-1d592919f522", 900), p("221024")],
    "appliance-repair": [p("4391470"), p("4108715")],
    "pest-control": [u("photo-1584622650111-993a426fbf0a", 900)],
  } as Record<string, string[]>,
};
