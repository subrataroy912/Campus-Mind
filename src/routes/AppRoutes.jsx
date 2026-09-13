import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { lazy } from "react";
import AuthLayout from "../app/layouts/AuthLayout.jsx";
import DashboardLayout from "../app/layouts/DashboardLayout.jsx";
import RootLayout from "../app/layouts/RootLayout.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import PublicRoute from "./PublicRoute.jsx";
import CreatorRoute from "./CreatorRoute.jsx";
import ServerDown from "@/pages/ServerDown.jsx";
import { AuthProvider } from "../context/AuthContext.jsx";
import { routes } from "./paths.js";
const GetStartedPage = lazy(() => import("../pages/GetStartedPage.jsx"));
const DashboardHome = lazy(() =>
  import("../features/dashboard/pages/DashboardHomePage.jsx")
);
const DashboardCommunityPage = lazy(() =>
  import("../features/dashboard/pages/DashboardCommunityPage.jsx")
);
const DashboardMessagesPage = lazy(() =>
  import("../features/dashboard/pages/DashboardMessagesPage.jsx")
);
const DashboardSavedPage = lazy(() =>
  import("../features/dashboard/pages/DashboardSavedPage.jsx")
);
const ExplorePage = lazy(() =>
  import("../features/explore/pages/ExplorePage.jsx")
);
const LoginPage = lazy(() => import("../features/auth/pages/LoginPage.jsx"));
const RegisterPage = lazy(() =>
  import("../features/auth/pages/RegisterPage.jsx")
);
const ForgotPasswordPage = lazy(() =>
  import("../features/auth/pages/ForgotPasswordPage.jsx")
);
const ResetPasswordPage = lazy(() =>
  import("../features/auth/pages/ResetPasswordPage.jsx")
);
const OAuthCallbackPage = lazy(() =>
  import("../features/auth/pages/OAuthCallbackPage.jsx")
);

const ClassListPage = lazy(() =>
  import("../features/classroom/pages/ClassListPage.jsx")
);
const ClassPage = lazy(() =>
  import("../features/classroom/pages/ClassPage.jsx")
);
const CreateClassPage = lazy(() =>
  import("../features/classroom/pages/CreateClass.jsx")
);
const JoinClassPage = lazy(() =>
  import("../features/classroom/pages/JoinClass.jsx")
);
const ProfilePage = lazy(() =>
  import("../features/profile/pages/ProfilePage.jsx")
);
const SettingsPage = lazy(() =>
  import("../features/settings/pages/SettingsPage.jsx")
);
const NotFound = lazy(() => import("../pages/NotFoundPage.jsx"));

export const appRouteConfig = [
  {
    element: (
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    ),
    children: [
      /* =====================================================================
          PUBLIC ROUTES
          ===================================================================== */
      {
        element: <PublicRoute />,
        handle: { requiresSessionRestore: true },
        children: [
          {
            path: routes.home,
            element: <RootLayout />,
            children: [{ index: true, element: <GetStartedPage /> }],
          },
          {
            path: routes.auth.root,
            element: <AuthLayout />,
            children: [
              {
                index: true,
                element: <Navigate to={routes.auth.login} replace />,
              },
              { path: "login", element: <LoginPage /> },
              { path: "register", element: <RegisterPage /> },
              { path: "forgot-password", element: <ForgotPasswordPage /> },
              { path: "reset-password", element: <ResetPasswordPage /> },
              { path: "callback", element: <OAuthCallbackPage /> },
            ],
          },
        ],
      },

      /* =====================================================================
          AUTHENTICATED APPLICATION ROUTES (DashboardLayout as Pathless Layout)
          ===================================================================== */
      {
        element: <ProtectedRoute />,
        handle: { requiresSessionRestore: true, isProtected: true },
        children: [
          {
            element: <DashboardLayout />,
            children: [
              // Application Core
              { path: routes.dashboard, element: <DashboardHome /> },
              { path: routes.community, element: <DashboardCommunityPage /> },
              { path: routes.messages, element: <DashboardMessagesPage /> },
              { path: routes.saved, element: <DashboardSavedPage /> },
              { path: routes.explore, element: <ExplorePage /> },

              // Classes
              { path: routes.classes.list, element: <ClassListPage /> },
              { path: routes.classes.join, element: <JoinClassPage /> },
              { path: routes.classes.detail(), element: <ClassPage /> },
              {
                element: <CreatorRoute />,
                children: [
                  { path: routes.classes.new, element: <CreateClassPage /> },
                ],
              },

              // Users & Profile
              { path: routes.profile.root, element: <ProfilePage /> },
              { path: routes.user(), element: <ProfilePage /> },

              // Settings
              { path: routes.settings, element: <SettingsPage /> },
            ],
          },
        ],
      },

      /* =====================================================================
          SYSTEM ROUTES
          ===================================================================== */
      {
        path: routes.serverDown,
        element: <ServerDown />,
      },
      {
        path: routes.notFound, // covers "*" from your routes.js
        element: <NotFound />,
      },
    ],
  },
];

export const AppRoutes =
  typeof document === "undefined" ? null : createBrowserRouter(appRouteConfig);
