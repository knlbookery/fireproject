/**
 * Stable, locally-managed site content.
 *
 * Per the Revised Content Management Requirements: brand language, navigation,
 * page structure, SEO defaults and legal copy stay in code. Frequently updated
 * operational content (events, hero slides, team) continues to come from
 * Airtable through the same-origin /api/*.php endpoints.
 */

export type NavItem = {
  label: string;
  to: string;
  children?: { label: string; to: string }[];
};

export const NAV: NavItem[] = [
  {
    label: "About",
    to: "/about",
    children: [
      { label: "About F.I.R.E.", to: "/about" },
      { label: "Our Mission", to: "/mission" },
      { label: "Our Impact", to: "/impact" },
      { label: "Organisation Leaders", to: "/leadership" },
    ],
  },
  { label: "Programs", to: "/programs" },
  {
    label: "Initiatives",
    to: "/ghana-initiatives",
    children: [
      { label: "Ghana Initiatives", to: "/ghana-initiatives" },
      { label: "Philadelphia / U.S.", to: "/us-initiatives" },
    ],
  },
  { label: "Events", to: "/events" },
  { label: "Partners", to: "/partners" },
  { label: "Press", to: "/press" },
  { label: "Contact", to: "/contact" },
];


export const SITE = {
  name: "F.I.R.E.",
  legalName: "Free Inspiration Reaching Everyone",
  tagline: "Empowering communities. Inspiring futures.",
  email: "info@freeinspiration.org",
  phone: "+1 (215) 555-0142",
  addressUS: "Philadelphia, Pennsylvania, USA",
  addressGH: "Accra, Greater Accra, Ghana",
  donateUrl: "/donate",
  ein: "EIN 88-1234567 · 501(c)(3) nonprofit organization",
  socials: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Facebook", href: "https://facebook.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "YouTube", href: "https://youtube.com" },
  ],
} as const;

export const IMPACT_STATS = [
  { value: "12,400+", label: "Young people reached", detail: "Across Ghana and the United States" },
  { value: "48", label: "Community programs", detail: "Sports, education, enterprise, outreach" },
  { value: "2", label: "Countries served", detail: "Ghana and the U.S., one shared mission" },
  { value: "$1.4M", label: "Value delivered", detail: "Equipment, scholarships, and services" },
];

export const PROGRAMS = [
  {
    slug: "sports",
    fundingGoal: 60000,
    title: "Sports & Wellness",
    summary:
      "Courts, coaching, and competition that keep young people connected to a team, a routine, and a reason to show up.",
    image: "/images/sport.jpg",
    points: ["Youth basketball leagues", "Coach development", "Equipment and facility grants"],
  },
  {
    slug: "entrepreneurship",
    fundingGoal: 75000,
    title: "Entrepreneurship",
    summary:
      "Practical business training, mentorship, and micro-capital for founders building livelihoods in their own communities.",
    image: "/images/mission_enterprenuer.jpg",
    points: ["Founder bootcamps", "Micro-grant fund", "Market access and mentorship"],
  },
  {
    slug: "community-development",
    fundingGoal: 90000,
    title: "Community Development",
    summary:
      "Neighbourhood-scale projects — from clean water to shared spaces — designed with residents, not for them.",
    image: "/images/community_dev.jpg",
    points: ["Community infrastructure", "Family support drives", "Local leadership councils"],
  },
  {
    slug: "education",
    fundingGoal: 50000,
    title: "Education & Mentorship",
    summary:
      "Scholarships, tutoring, and one-to-one mentorship that carry students from classroom to career.",
    image: "/images/capsule1.jpg",
    points: ["Scholarship fund", "After-school tutoring", "Career mentorship pairs"],
  },
  {
    slug: "technology",
    fundingGoal: 45000,
    title: "Technology Access",
    summary:
      "Digital literacy labs and device access so the next generation builds with technology rather than around it.",
    image: "/images/capsule2.jpg",
    points: ["Computer labs", "Digital skills curriculum", "Device donation programme"],
  },
  {
    slug: "outreach",
    fundingGoal: 30000,
    title: "Community Outreach",
    summary:
      "Direct, seasonal support — meals, supplies, and health drives — delivered where the need is most immediate.",
    image: "/images/impact.jpg",
    points: ["Food and supply drives", "Health screenings", "Holiday family support"],
  },
];

export const VOLUNTEER_ROLES = [
  {
    title: "Youth Coach",
    location: "Philadelphia, PA",
    commitment: "4–6 hrs / week, seasonal",
    description: "Lead practices, mentor players, and keep the season running for a youth team.",
  },
  {
    title: "Mentor",
    location: "Remote or in-person",
    commitment: "2 hrs / month",
    description: "Pair with a student or founder for structured monthly guidance.",
  },
  {
    title: "Event Volunteer",
    location: "Philadelphia & Accra",
    commitment: "Per event",
    description: "Set-up, registration, hospitality, and photography at F.I.R.E. events.",
  },
  {
    title: "Skills Volunteer",
    location: "Remote",
    commitment: "Flexible",
    description:
      "Design, legal, accounting, translation, or curriculum support for our programmes.",
  },
];

export const SPONSOR_TIERS = [
  {
    name: "Community",
    amount: "$2,500",
    benefits: [
      "Logo on the sponsors page",
      "Recognition in one event programme",
      "Annual impact report",
    ],
  },
  {
    name: "Champion",
    amount: "$10,000",
    benefits: [
      "Everything in Community",
      "Logo on the homepage sponsor strip",
      "Named programme cohort",
      "Quarterly impact briefing",
    ],
    featured: true,
  },
  {
    name: "Legacy",
    amount: "$25,000+",
    benefits: [
      "Everything in Champion",
      "Co-branded initiative in Ghana or the U.S.",
      "Site visit and story package",
      "Executive briefing with leadership",
    ],
  },
];

export const PRESS_ITEMS = [
  {
    title: "F.I.R.E. opens third youth court in Accra",
    outlet: "Ghana Community Press",
    date: "2026-05-14",
    type: "Article",
    excerpt:
      "The organization's third community court brings structured play to more than 400 additional young people in Greater Accra.",
    href: "#",
  },
  {
    title: "Philadelphia mentorship cohort graduates 62 students",
    outlet: "Philly Neighborhood Report",
    date: "2026-03-02",
    type: "Article",
    excerpt:
      "A yearlong pairing programme closes with the highest completion rate in the organization's history.",
    href: "#",
  },
  {
    title: "Inside the F.I.R.E. founder bootcamp",
    outlet: "F.I.R.E. Media",
    date: "2026-01-20",
    type: "Video",
    excerpt:
      "A short documentary following four founders through eight weeks of business training.",
    href: "#",
  },
  {
    title: "Annual impact report published",
    outlet: "F.I.R.E.",
    date: "2025-12-11",
    type: "Announcement",
    excerpt: "Full-year figures on reach, spending, and programme outcomes across both countries.",
    href: "#",
  },
];

export const GALLERY = [
  "/images/capsule1.jpg",
  "/images/capsule2.jpg",
  "/images/capsule3.jpg",
  "/images/capsule4.jpg",
  "/images/basketball.jpg",
  "/images/impact.jpg",
  "/images/sport.jpg",
  "/images/community_dev.jpg",
];

export const VALUES = [
  {
    title: "Dignity first",
    body: "We design with communities, never for them. Local leadership decides what gets built.",
  },
  {
    title: "Proof over promise",
    body: "Every programme carries a number attached to it — reach, completion, or outcome.",
  },
  {
    title: "Long horizons",
    body: "We stay in a neighbourhood long enough for the work to compound into something durable.",
  },
  {
    title: "Open books",
    body: "Donors and sponsors see where money goes, in plain language, every quarter.",
  },
];
