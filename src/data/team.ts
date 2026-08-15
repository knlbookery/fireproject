/**
 * Organisation leadership.
 *
 * Shared by the homepage leadership carousel and the dedicated /leadership page.
 */

export type Leader = {
  slug: string;
  img: string;
  name: string;
  role: string;
  location: string;
  quote: string;
  body: string;
};

export const LEADERS: Leader[] = [
  {
    slug: "emil-acolatse",
    img: "/images/portrait1.jpg",
    name: "Emil Acolatse",
    role: "Founder & Executive Director",
    location: "USA & Ghana",
    quote: "Empowering communities through shared inspiration and sustainable vision.",
    body: "Leading strategic growth, partnership expansion, and organizational alignment across all regional initiatives.",
  },
  {
    slug: "larz-e-jeter",
    img: "/images/portrait2.jpg",
    name: "Larz E. Jeter",
    role: "Chief Financial Officer",
    location: "USA & Ghana",
    quote: "Efficiency and empathy are the pillars of impactful execution.",
    body: "Oversees financial planning, budgeting, compliance, and the fiscal architecture supporting F.I.R.E.'s cross-border operations.",
  },
  {
    slug: "donavan-s-west",
    img: "/images/portrait3.jpg",
    name: "Donavan S. West",
    role: "Chief Business Officer",
    location: "USA & Ghana",
    quote: "Real transformation starts at the grassroots level.",
    body: "Driving outreach programs, volunteer mobilization, and building lasting relationships with local partners.",
  },
  {
    slug: "james-r-beckley",
    img: "/images/portrait4.jpg",
    name: "James R. Beckley",
    role: "Chief Technology Officer",
    location: "USA & Ghana",
    quote:
      "Building scalable frameworks and leveraging modern technology to amplify real-world human impact.",
    body: "Architecting and maintaining the core digital platforms, web infrastructure, and automated systems.",
  },
  {
    slug: "zebi-williams",
    img: "/images/portrait5.jpg",
    name: "Zebi Williams",
    role: "Program Director",
    location: "USA & Ghana",
    quote:
      "We empower the people we work alongside to ignite action and spark real change in their communities.",
    body: "Developing ecosystem growth plans, project roadmaps, and key stakeholder performance frameworks.",
  },
  {
    slug: "star-wright",
    img: "/images/portrait6.jpg",
    name: "Star Wright",
    role: "Chief Partnerships Officer",
    location: "USA & Ghana",
    quote: "Every partnership is an opportunity to uplift lives and create opportunity.",
    body: "Coordinating event execution, field operations, and monitoring program impact across active locations.",
  },
  {
    slug: "sean-mcmillan",
    img: "/images/portrait7.jpg",
    name: "Sean McMillan",
    role: "Business Intelligence Director",
    location: "USA & Ghana",
    quote: "Information is the key to unlocking potential and driving meaningful change.",
    body: "Coordinating data collection, analysis, and reporting to inform strategic decisions and measure program effectiveness.",
  },
];
