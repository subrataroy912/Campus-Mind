export const EXPLORE_TABS = {
  CLASSES: "classes",
  PEOPLE: "people",
};

export const DEFAULT_FILTER = "all";

export const BUILT_IN_CLASS_FILTERS = [
  { id: "all", label: "All" },
  { id: "popular", label: "Popular" },
  { id: "recommended", label: "Recommended" },
];

export const BUILT_IN_PERSON_FILTERS = [
  { id: "all", label: "All departments" },
  { id: "shared", label: "Shares a class with you" },
];

export const EXPLORE_BANNERS = {
  [EXPLORE_TABS.CLASSES]: {
    badge: "Discover & Learn",
    title: "Explore Spaces & Communities",
    description:
      "Browse open spaces created by educators and fellow students. Enroll with one click or explore materials freely.",
    imageSrc: "/images/illustrations/learning-ecosystem.jpg",
    imageAlt: "Interactive course discovery",
  },
  [EXPLORE_TABS.PEOPLE]: {
    badge: "Campus Network",
    title: "Connect with Learners & Instructors",
    description:
      "Find peers in your spaces, discover collaborators in your department, and expand your academic network.",
    imageSrc: "/images/illustrations/diverse-campus.jpg",
    imageAlt: "Diverse campus community",
  },
};
