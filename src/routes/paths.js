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

  classes: {
    list: "/classes",
    new: "/classes/new",
    join: "/classes/join",
    detail: (classId = ":classId") => `/classes/${classId}`,
  },

  profile: {
    root: "/profile",
    tab: (tab) =>
      tab ? `/profile?tab=${encodeURIComponent(tab)}` : "/profile",
  },

  user: (userId = ":userId") => `/users/${userId}`,
  settings: "/settings",

  serverDown: "/server-down",
  notFound: "*",
};
