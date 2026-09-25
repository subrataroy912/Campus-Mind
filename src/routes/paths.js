export const routes = {
  home: "/",
  dashboard: "/",

  auth: {
    root: "/auth",
    login: "/auth/login",
    register: "/auth/register",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    callback: "/auth/callback",
  },

  community: "/community",
  messages: "/messages",
  saved: "/saved",
  explore: "/explore",
  search: "/search",

  spaces: {
    list: "/spaces",
    new: "/spaces/new",
    join: "/spaces/join",
    detail: (spaceId = ":spaceId") => `/spaces/${spaceId}`,
  },

  space: {
    home: (spaceId = ":spaceId") => `/spaces/${spaceId}`,
    stream: (spaceId = ":spaceId") => `/spaces/${spaceId}`,
    posts: (spaceId = ":spaceId") => `/spaces/${spaceId}/posts`,
    announcements: (spaceId = ":spaceId") => `/spaces/${spaceId}/announcements`,
    classwork: (spaceId = ":spaceId") => `/spaces/${spaceId}/classwork`,
    assignments: (spaceId = ":spaceId") => `/spaces/${spaceId}/assignments`,
    materials: (spaceId = ":spaceId") => `/spaces/${spaceId}/materials`,
    resources: (spaceId = ":spaceId") => `/spaces/${spaceId}/resources`,
    people: (spaceId = ":spaceId") => `/spaces/${spaceId}/people`,
    grades: (spaceId = ":spaceId") => `/spaces/${spaceId}/grades`,
    settings: (spaceId = ":spaceId") => `/spaces/${spaceId}/settings`,
  },

  // Backward-compatible alias for legacy callers
  classes: {
    list: "/spaces",
    new: "/spaces/new",
    join: "/spaces/join",
    detail: (spaceId = ":spaceId") => `/spaces/${spaceId}`,
  },

  profile: {
    root: "/profile",
    new: "/profile/new",
    tab: (tab) =>
      tab ? `/profile?tab=${encodeURIComponent(tab)}` : "/profile",
  },

  user: (userId = ":userId") => `/users/${userId}`,

  settings: "/settings",

  serverDown: "/server-down",
  notFound: "*",
};
