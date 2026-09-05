import { createBrowserRouter, Navigate } from "react-router";
import { lazy } from "react";
import AuthLayout from "../components/layout/AuthLayout.jsx";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import RootLayout from "../components/layout/RootLayout.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

const GetStartedPage = lazy(() => import("../pages/GetStartedPage.jsx"));
const DashboardHome = lazy(
  () => import("../pages/dashboard/DashboardHomePage.jsx"),
);
const DashboardCommunityPage = lazy(
  () => import("../pages/dashboard/DashboardCommunityPage.jsx"),
);
const DashboardMessagesPage = lazy(
  () => import("../pages/dashboard/DashboardMessagesPage.jsx"),
);
const DashboardAssignmentPage = lazy(
  () => import("../pages/dashboard/DashboardAssignmentPage.jsx"),
);
const DashboardSavedPage = lazy(
  () => import("../pages/dashboard/DashboardSavedPage.jsx"),
);
const LoginPage = lazy(() => import("../pages/auth/LoginPage.jsx"));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage.jsx"));
const ForgotPasswordPage = lazy(
  () => import("../pages/auth/ForgotPasswordPage.jsx"),
);
const ResetPasswordPage = lazy(
  () => import("../pages/auth/ResetPasswordPage.jsx"),
);
const ClassPage = lazy(() => import("../pages/classroom/ClassPage.jsx"));
const CreateClassPage = lazy(
  () => import("../pages/classroom/CreateClass.jsx"),
);
const JoinClassPage = lazy(() => import("../pages/classroom/JoinClass.jsx"));
const ProfilePage = lazy(() => import("../pages/profile/ProfilePage.jsx"));
const SettingsPage = lazy(() => import("../pages/settings/SettingsPage.jsx"));
const NotFound = lazy(() => import("../pages/NotFoundPage.jsx"));

export const AppRoutes = createBrowserRouter([
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
    ],
  },
  {
    path: "/login",
    element: <Navigate to="/auth/login" replace />,
  },
  {
    element: <ProtectedRoute />,
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
            path: "assignments",
            element: <DashboardAssignmentPage />,
          },
          {
            path: "saved",
            element: <DashboardSavedPage />,
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
        element: <h1>/dashboard/classes</h1>,
      },
      {
        path: "/dashboard/profile",
        element: <ProfilePage />,
      },
      {
        path: "/dashboard/settings",
        element: <SettingsPage />,
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);
