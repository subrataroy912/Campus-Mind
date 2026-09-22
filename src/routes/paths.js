export const routes = {
  home: "/",

  auth: {
    root: "/auth",
    login: "/auth/login",
    register: "/auth/register",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    callback: "/auth/callback",
  },

  dashboard: "/dashboard",

  community: "/community",
  messages: "/messages",
  saved: "/saved",
  explore: "/explore",
  search: "/search",

  spaces: {
    list: "/spaces",
    new: "/spaces/new",
    join: "/spaces/join",
    detail: (spaceId = ":classId") => `/spaces/${spaceId}`,
  },

  classes: {
    list: "/spaces",
    new: "/spaces/new",
    join: "/spaces/join",
    detail: (classId = ":classId") => `/spaces/${classId}`,
  },

  profile: {
    root: "/profile",
    new: "/users/new",
    tab: (tab) =>
      tab ? `/profile?tab=${encodeURIComponent(tab)}` : "/profile",
  },

  user: (userId = ":userId") => `/users/${userId}`,
  settings: "/settings",

  serverDown: "/server-down",
  notFound: "*",
};
