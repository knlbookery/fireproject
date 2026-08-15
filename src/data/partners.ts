/**
 * Partner directory.
 *
 * Shared by the homepage partner marquee and the dedicated /partners page.
 * Copy here is placeholder-safe: it describes the category of support each
 * partner provides and can be overridden per-row from Airtable page content.
 */

export type PartnerCategory =
  | "Corporate"
  | "Foundation"
  | "Civic & Government"
  | "Community & Advisory";

export type Partner = {
  name: string;
  logo: string;
  category: PartnerCategory;
  /** Who they are. */
  about: string;
  /** How they have supported F.I.R.E. */
  support: string;
  region: string;
};

export const PARTNERS: Partner[] = [
  {
    name: "ExxonMobil",
    logo: "/images/partners/exxonLogo.png",
    category: "Corporate",
    about: "A global energy company with a long-standing community investment programme.",
    support: "Corporate giving toward youth STEM access and programme equipment.",
    region: "USA & Ghana",
  },
  {
    name: "MacArthur Foundation",
    logo: "/images/partners/macarthur.png",
    category: "Foundation",
    about: "A private foundation backing organizations working on justice and opportunity.",
    support: "Grant support for education and community development initiatives.",
    region: "USA",
  },
  {
    name: "The Mayor's Fund for Philadelphia",
    logo: "/images/partners/mayors-fund-philadelphia.png",
    category: "Civic & Government",
    about: "The nonprofit partner of the City of Philadelphia advancing citywide priorities.",
    support: "Civic collaboration on youth engagement and neighbourhood programming.",
    region: "Philadelphia, USA",
  },
  {
    name: "Urban Affairs Coalition",
    logo: "/images/partners/urban-affairs-coalition.png",
    category: "Community & Advisory",
    about: "A Philadelphia coalition supporting community organizations and fiscal sponsorship.",
    support: "Capacity building, back-office guidance, and network access.",
    region: "Philadelphia, USA",
  },
  {
    name: "Feed The Children",
    logo: "/images/partners/feed-the-children.png",
    category: "Foundation",
    about: "A relief organization distributing food and essentials to families in need.",
    support: "In-kind supplies for family support drives and outreach events.",
    region: "USA",
  },
  {
    name: "City of Philadelphia",
    logo: "/images/partners/city-of-philadelphia.png",
    category: "Civic & Government",
    about: "Municipal departments serving Philadelphia neighbourhoods.",
    support: "Facility access, permits, and coordination for community events.",
    region: "Philadelphia, USA",
  },
  {
    name: "T-Mobile",
    logo: "/images/partners/tmobile.png",
    category: "Corporate",
    about: "A national telecommunications provider with a community connectivity programme.",
    support: "Connectivity and device support for digital-access initiatives.",
    region: "USA",
  },
  {
    name: "Network for Good",
    logo: "/images/partners/network-for-good.png",
    category: "Corporate",
    about: "A giving platform powering online donations for nonprofits.",
    support: "Donation infrastructure and secure processing for F.I.R.E. giving.",
    region: "USA",
  },
  {
    name: "Raytheon Technologies",
    logo: "/images/partners/raytheon.jpg",
    category: "Corporate",
    about: "An aerospace and defense company with employee-led volunteering programmes.",
    support: "Employee volunteering and mentorship for technology programmes.",
    region: "USA",
  },
  {
    name: "Get The Millions",
    logo: "/images/partners/get-the-millions.jpg",
    category: "Community & Advisory",
    about: "A financial literacy and enterprise education initiative.",
    support: "Curriculum and workshops for the entrepreneurship track.",
    region: "USA",
  },
  {
    name: "DTR Consulting",
    logo: "/images/partners/dtr-consulting.png",
    category: "Community & Advisory",
    about: "A consulting practice advising mission-driven organizations.",
    support: "Pro-bono strategy and operations advisory.",
    region: "USA",
  },
  {
    name: "Atolatse",
    logo: "/images/partners/atolatse.jpg",
    category: "Community & Advisory",
    about: "A Ghana-based enterprise supporting local business development.",
    support: "On-the-ground coordination for Ghana initiatives.",
    region: "Ghana",
  },
  {
    name: "US-Ghana Chamber of Commerce",
    logo: "/images/partners/us-ghana-chamber.jpg",
    category: "Community & Advisory",
    about: "A bilateral chamber connecting American and Ghanaian business communities.",
    support: "Introductions, trade guidance, and cross-border partnership building.",
    region: "USA & Ghana",
  },
  {
    name: "EJ Consulting",
    logo: "/images/partners/ej-consulting.jpg",
    category: "Community & Advisory",
    about: "An advisory firm supporting programme design and delivery.",
    support: "Programme evaluation and reporting support.",
    region: "USA",
  },
];

export const PARTNER_WAYS = [
  {
    title: "Fund a programme",
    body: "Underwrite a named cohort, a court, or a scholarship round — with quarterly reporting you can share with your board.",
  },
  {
    title: "Give in kind",
    body: "Equipment, devices, connectivity, venue space, food, or transport. In-kind support often unblocks a programme faster than cash.",
  },
  {
    title: "Send your people",
    body: "Employee volunteering, mentorship pairings, and skills days for design, legal, finance, and technology.",
  },
  {
    title: "Open a door",
    body: "Introductions to funders, civic partners, and local leaders in Philadelphia and Accra multiply everything else.",
  },
];

export const PARTNER_STEPS = [
  {
    step: "01",
    title: "Tell us what matters to you",
    body: "Share the outcomes, regions, and audiences your organization cares about.",
  },
  {
    step: "02",
    title: "We map it to live work",
    body: "Within a week we return two or three concrete programmes your support could carry.",
  },
  {
    step: "03",
    title: "Agree the partnership",
    body: "Scope, budget, recognition, and reporting cadence written down before anything starts.",
  },
  {
    step: "04",
    title: "See the proof",
    body: "Quarterly figures, photography, and participant stories from the work you funded.",
  },
];
