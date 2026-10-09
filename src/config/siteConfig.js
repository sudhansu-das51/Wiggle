/**
 * Central site configuration for Wiggle preschool platform.
 * Reusable SaaS contract: changing this file customizes the entire brand.
 */
export const siteConfig = {
  brand: {
    name: "Wiggle",
    tagline: "Where little minds wiggle, giggle and grow",
    description: "Wiggle is a play-first preschool for children aged 1.5 to 5.5.",
    logoSrc: "/images/logo.svg", // Main logo image
  },
  theme: {
    overrides: {}, // e.g. { "--tangerine": "#E4572E" }
  },
  admissions: {
    open: true,
    session: "2026-27",
    badgeText: "Admissions open for 2026-27",
    email: null,
    whatsappNumber: null,
    replyPromise: "We usually reply the same day.",
    visitSlots: ["Morning (9 am to 12 pm)", "Afternoon (1 pm to 4 pm)"],
  },
  downloads: {
    syllabus: null, // set to a file path such as "/downloads/syllabus.pdf" to show a download button
  },
  gallery: {
    consentNote: "Photos of children are shared only with their parents' written consent.",
  },
  calendar: {
    weekStartsOn: 1, // 0 = Sunday, 1 = Monday
  },
  contact: {
    phone: "+919999999999",
    phoneDisplay: "+91 99999 99999",
    email: "hello@wigglepreschool.in",
    address: {
      line1: "12, Rainbow Lane",
      line2: "Near Green Park",
      city: "Your City",
      state: "Your State",
      pincode: "000000",
    },
    hours: [
      { days: "Monday to Friday", time: "8:30 am to 4:30 pm" },
      { days: "Saturday", time: "9:00 am to 1:00 pm (admissions desk)" },
    ],
    landmark: "Opposite Green Park main gate",
    parkingNote: "Free parking for visitors inside the gate.",
    directionsUrl: null,
    mapEmbedUrl: "https://www.google.com/maps?q=Rainbow+Lane&output=embed",
  },
  whatsapp: {
    number: "919999999999", // digits only, with country code
    defaultMessage: "Hi Wiggle! I would like to know more about admissions for my child.",
  },
  careers: {
    email: null, // set to an email such as "careers@wigglepreschool.in" to override contact.email
    whatsappNumber: null, // set to digits to override whatsapp.number
  },
  social: [
    { id: "instagram", label: "Instagram", url: "https://www.instagram.com/wigglepreschool" },
    { id: "facebook", label: "Facebook", url: "https://www.facebook.com/wigglepreschool" },
    { id: "youtube", label: "YouTube", url: "https://www.youtube.com/@wigglepreschool" },
  ],
  nav: [
    { label: "Home", path: "/" },
    {
      label: "About",
      path: "/about",
      children: [
        { label: "About us", path: "/about" },
        { label: "Why Wiggle", path: "/why-us" },
      ],
    },
    {
      label: "Programs",
      path: "/programs",
      children: [
        { label: "Playgroup", path: "/programs/playgroup" },
        { label: "Nursery", path: "/programs/nursery" },
        { label: "Jr. KG", path: "/programs/jr-kg" },
        { label: "Sr. KG", path: "/programs/sr-kg" },
        { label: "Curriculum", path: "/curriculum" },
      ],
    },
    { label: "Facilities", path: "/facilities" },
    { label: "Gallery", path: "/gallery" },
    { label: "Events", path: "/events" },
    { label: "Teachers", path: "/teachers" },
    { label: "Contact", path: "/contact" },
  ],
  footerLinks: [
    { label: "Careers", path: "/careers" },
    { label: "Enquire now", path: "/enquire" },
  ],
  cta: {
    label: "Enquire now",
    path: "/enquire",
  },
  animations: {
    gateIntro: true,
    pageTransition: true,
    bus: true,
    dayScroll: true,
    blocks: true,
    doodles: true,
  },
  seo: {
    titleTemplate: "%s | Wiggle",
    defaultTitle: "Wiggle | Play-first preschool",
    defaultDescription: "Wiggle is a play-first preschool for children aged 1.5 to 5.5.",
  },
};
