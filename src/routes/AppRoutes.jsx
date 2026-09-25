import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { lazy, Suspense } from "react";
import AuthLayout from "../app/layouts/AuthLayout.jsx";
import DashboardLayout from "../app/layouts/DashboardLayout.jsx";
import RootLayout from "../app/layouts/RootLayout.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import PublicRoute from "./PublicRoute.jsx";
import CreatorRoute from "./CreatorRoute.jsx";
import ServerDown from "@/pages/ServerDown.jsx";
import RouteErrorBoundary from "@/components/common/RouteErrorBoundary.jsx";
import SessionBootstrapSkeleton from "@/features/auth/components/SessionBootstrapSkeleton.jsx";
import SafeScrollRestoration from "./SafeScrollRestoration.jsx";
import { AuthProvider } from "../context/AuthContext.jsx";
import { routes } from "./paths.js";
import ParamRedirect from "./ParamRedirect.jsx";
import { store } from "../app/store.js";
import {
  createDashboardLoader,
  createSpacesLoader,
  createSpaceDetailLoader,
  createExploreLoader,
  dashboardShouldRevalidate,
  spacesShouldRevalidate,
  spaceDetailShouldRevalidate,
  exploreShouldRevalidate,
} from "./routeLoaders.js";
const GetStartedPage = lazy(() => import("../pages/GetStartedPage.jsx"));
const DashboardHome = lazy(
  () => import("../features/dashboard/pages/DashboardHomePage.jsx"),
);
const DashboardCommunityPage = lazy(
  () => import("../features/dashboard/pages/DashboardCommunityPage.jsx"),
);
const DashboardMessagesPage = lazy(
  () => import("../features/dashboard/pages/DashboardMessagesPage.jsx"),
);
const DashboardSavedPage = lazy(
  () => import("../features/dashboard/pages/DashboardSavedPage.jsx"),
);
const DashboardHeaderSearchPage = lazy(
  () => import("../features/dashboard/pages/DashboardHeaderSearchPage.jsx"),
);
const ExplorePage = lazy(
  () => import("../features/explore/pages/ExplorePage.jsx"),
);
const LoginPage = lazy(() => import("../features/auth/pages/LoginPage.jsx"));
const RegisterPage = lazy(
  () => import("../features/auth/pages/RegisterPage.jsx"),
);
const ForgotPasswordPage = lazy(
  () => import("../features/auth/pages/ForgotPasswordPage.jsx"),
);
const ResetPasswordPage = lazy(
  () => import("../features/auth/pages/ResetPasswordPage.jsx"),
);
const OAuthCallbackPage = lazy(
  () => import("../features/auth/pages/OAuthCallbackPage.jsx"),
);

const SpaceListPage = lazy(
  () => import("../features/dashboard/pages/SpaceListPage.jsx"),
);
const SpacePage = lazy(
  () => import("../features/classroom/pages/SpacePage.jsx"),
);
const CreateSpacePage = lazy(
  () => import("../features/classroom/pages/CreateSpace.jsx"),
);
const JoinSpacePage = lazy(
  () => import("../features/classroom/pages/JoinSpace.jsx"),
);
const ProfilePage = lazy(
  () => import("../features/profile/pages/ProfilePage.jsx"),
);

const CreateProfilePage = lazy(
  () => import("../features/profile/pages/CreateProfilePage.jsx"),
);
const SettingsPage = lazy(
  () => import("../features/settings/pages/SettingsPage.jsx"),
);
const NotFound = lazy(() => import("../pages/NotFoundPage.jsx"));

export const appRouteConfig = [
  {
    element: (
      <AuthProvider>
        <SafeScrollRestoration />
        <Suspense fallback={<SessionBootstrapSkeleton />}>
          <Outlet />
        </Suspense>
      </AuthProvider>
    ),
    errorElement: <RouteErrorBoundary />,
    children: [
      /* =====================================================================
          PUBLIC ROUTES
          ===================================================================== */
      {
        element: <PublicRoute />,
        handle: { requiresSessionRestore: true },
        children: [
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
        element: (
          <ProtectedRoute
            unauthenticatedHomeElement={
              <RootLayout>
                <GetStartedPage />
              </RootLayout>
            }
          />
        ),
        handle: { requiresSessionRestore: true, isProtected: true },
        children: [
          {
            element: <DashboardLayout />,
            errorElement: <RouteErrorBoundary isInline />,
            children: [
              // Application Core (Unified Home "/" + backward-compatible "/home" redirect)
              {
                path: routes.home,
                element: <DashboardHome />,
                loader: createDashboardLoader(store),
                shouldRevalidate: dashboardShouldRevalidate,
              },
              {
                path: "/home",
                element: <Navigate to={routes.home} replace />,
              },
              { path: routes.community, element: <DashboardCommunityPage /> },
              { path: routes.messages, element: <DashboardMessagesPage /> },
              { path: routes.saved, element: <DashboardSavedPage /> },
              {
                path: routes.explore,
                element: <ExplorePage />,
                loader: createExploreLoader(store),
                shouldRevalidate: exploreShouldRevalidate,
              },

              // Spaces & Nested Sub-Routes (/spaces/:spaceId/*)
              {
                path: routes.spaces.list,
                element: <SpaceListPage />,
                loader: createSpacesLoader(store),
                shouldRevalidate: spacesShouldRevalidate,
              },
              { path: routes.spaces.join, element: <JoinSpacePage /> },
              {
                path: routes.spaces.detail(),
                element: <SpacePage />,
                loader: createSpaceDetailLoader(store),
                shouldRevalidate: spaceDetailShouldRevalidate,
                children: [
                  { index: true, element: null },
                  { path: "posts", element: null },
                  { path: "announcements", element: null },
                  { path: "classwork", element: null },
                  { path: "assignments", element: null },
                  { path: "materials", element: null },
                  { path: "resources", element: null },
                  { path: "quick-links", element: null },
                  { path: "people", element: null },
                  { path: "members", element: null },
                  { path: "grades", element: null },
                  { path: "settings", element: null },
                ],
              },
              {
                element: <CreatorRoute />,
                children: [
                  { path: routes.spaces.new, element: <CreateSpacePage /> },
                ],
              },

              /* Backward-Compatible Redirects for legacy /classes/* paths */
              {
                path: "/classes",
                element: <Navigate to={routes.spaces.list} replace />,
              },
              {
                path: "/classes/join",
                element: <Navigate to={routes.spaces.join} replace />,
              },
              {
                path: "/classes/new",
                element: <Navigate to={routes.spaces.new} replace />,
              },
              {
                path: "/classes/:classId",
                element: (
                  <ParamRedirect
                    to={(params) => routes.spaces.detail(params.classId)}
                  />
                ),
              },
              {
                path: routes.search,
                element: <DashboardHeaderSearchPage />,
              },
              // Users & Profile
              { path: routes.profile.root, element: <ProfilePage /> },
              { path: routes.user(), element: <ProfilePage /> },

              // Settings
              { path: routes.settings, element: <SettingsPage /> },

              /* Backward-Compatible Redirects for legacy /dashboard/* paths */
              {
                path: "/dashboard/classes",
                element: <Navigate to={routes.spaces.list} replace />,
              },
              {
                path: "/dashboard/classes/:classId",
                element: (
                  <ParamRedirect
                    to={(params) => routes.spaces.detail(params.classId)}
                  />
                ),
              },
              {
                path: "/dashboard/class/join",
                element: <ParamRedirect to={routes.spaces.join} />,
              },
              {
                path: "/dashboard/class/create",
                element: <Navigate to={routes.spaces.new} replace />,
              },
              {
                path: "/dashboard/community",
                element: <ParamRedirect to={routes.community} />,
              },
              {
                path: "/dashboard/messages",
                element: <ParamRedirect to={routes.messages} />,
              },
              {
                path: "/dashboard/saved",
                element: <ParamRedirect to={routes.saved} />,
              },
              {
                path: "/dashboard/explore",
                element: <ParamRedirect to={routes.explore} />,
              },
              {
                path: "/dashboard/profile",
                element: <ParamRedirect to={routes.profile.root} />,
              },
              {
                path: "/dashboard/profile/:userId",
                element: (
                  <ParamRedirect to={(params) => routes.user(params.userId)} />
                ),
              },
              {
                path: "/dashboard/settings",
                element: <Navigate to={routes.settings} replace />,
              },
            ],
          },
          {
            path: routes.profile.new,
            element: <CreateProfilePage />,
          },
          {
            path: "/users/new",
            element: <Navigate to={routes.profile.new} replace />,
          },
        ],
      },

      /* =====================================================================
          SYSTEM ROUTES & CONVENIENCE REDIRECTS
          ===================================================================== */
      {
        path: "/login",
        element: <Navigate to={routes.auth.login} replace />,
      },
      {
        path: "/register",
        element: <Navigate to={routes.auth.register} replace />,
      },
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
