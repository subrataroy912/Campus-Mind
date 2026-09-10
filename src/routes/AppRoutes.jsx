import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { lazy } from "react";
import AuthLayout from "../app/layouts/AuthLayout.jsx";
import DashboardLayout from "../app/layouts/DashboardLayout.jsx";
import RootLayout from "../app/layouts/RootLayout.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import PublicRoute from "./PublicRoute.jsx";
import ServerDown from "@/pages/ServerDown.jsx";
import { AuthProvider } from "../context/AuthContext.jsx";
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

export const AppRoutes = createBrowserRouter([
  {
    element: (
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    ),
    children: [
      {
        element: <PublicRoute />,
        children: [
          {
            path: "/",
            element: <RootLayout />,
            children: [
              {
                index: true,
                element: <GetStartedPage />,
              },
            ],
          },
          {
            path: "/auth",
            element: <AuthLayout />,
            children: [
              {
                index: true,
                element: <Navigate to="login" replace />,
              },
              {
                path: "login",
                element: <LoginPage />,
              },
              {
                path: "register",
                element: <RegisterPage />,
              },
              {
                path: "forgot-password",
                element: <ForgotPasswordPage />,
              },

              {
                path: "reset-password",
                element: <ResetPasswordPage />,
              },
              {
                path: "callback",
                element: <OAuthCallbackPage />,
              },
            ],
          },
          {
            path: "/login",
            element: <Navigate to="/auth/login" replace />,
          },
        ],
      },

      // end public routes

      {
        element: <ProtectedRoute />,
        handle: { requiresSessionRestore: true },
        children: [
          {
            path: "/dashboard",
            element: <DashboardLayout />,
            children: [
              {
                index: true,
                element: <DashboardHome />,
              },
              {
                path: "community",
                element: <DashboardCommunityPage />,
              },
              {
                path: "messages",
                element: <DashboardMessagesPage />,
              },
              {
                path: "saved",
                element: <DashboardSavedPage />,
              },
              {
                path: "explore",
                element: <ExplorePage />,
              },
            ],
          },
          {
            path: "/dashboard/classes/:classId",
            element: <ClassPage />,
          },
          {
            path: "/dashboard/class/create",
            element: <CreateClassPage />,
          },
          {
            path: "/dashboard/class/join",
            element: <JoinClassPage />,
          },
          {
            path: "/dashboard/classes",
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: "/dashboard/profile",
            element: <ProfilePage />,
          },
          {
            path: "/dashboard/profile/:userId",
            element: <ProfilePage />,
          },
          {
            path: "/dashboard/settings",
            element: <SettingsPage />,
          },
        ],
      },
      {
        path: "/server-down",
        element: <ServerDown />,
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
