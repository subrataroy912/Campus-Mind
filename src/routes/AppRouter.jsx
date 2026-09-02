import { createBrowserRouter, redirect } from 'react-router'
import { lazy } from 'react'
import AuthLayout from '../components/layout/AuthLayout.jsx'
import DashboardLayout from '../components/layout/DashboardLayout.jsx'
import RootLayout from '../components/layout/RootLayout.jsx'

const GetStartedPage = lazy(() => import("../pages/GetStartedPage.jsx"))
const DashboardHome = lazy(() => import("../pages/dashboard/DashboardHomePage.jsx"))
const DashboardClassesPage = lazy(() => import("../pages/dashboard/DashboardClassesPage.jsx"))
const DashboardCommunityPage = lazy(() => import("../pages/dashboard/DashboardCommunityPage.jsx"))
const DashboardMessagesPage = lazy(() => import("../pages/dashboard/DashboardMessagesPage.jsx"))
const DashboardAssignmentPage = lazy(() => import("../pages/dashboard/DashboardAssignmentPage.jsx"))
const DashboardSavedPage = lazy(() => import("../pages/dashboard/DashboardSavedPage.jsx"))
const LoginPage = lazy(() => import("../pages/auth/LoginPage.jsx"))
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage.jsx"))
const ForgotPasswordPage = lazy(() => import("../pages/auth/ForgotPasswordPage.jsx"))
const ResetPasswordPage = lazy(() => import("../pages/auth/ResetPasswordPage.jsx"))
const ClassPage = lazy(() => import("../pages/classroom/ClassPage.jsx"))
const CreateClassPage = lazy(() => import("../pages/classroom/CreateClass.jsx"))
const JoinClassPage = lazy(() => import("../pages/classroom/JoinClass.jsx"))
const ProfilePage = lazy(() => import("../pages/profile/ProfilePage.jsx"))
const SettingsPage = lazy(() => import("../pages/settings/SettingsPage.jsx"))

const NotFound = lazy(() => import("../pages/NotFoundPage.jsx"))
// function AppRouter() {
//   return (
//     <Routes>
//       {/* Root public routes */}
//       <Route element={<App />} path="/" />
//       <Route element={<PracticsPage />} path="/practics" />
//       <Route element={<GetStartedPage />} path="/get-started" />

//       {/** Protected routes: Have to protect */}
//       <Route element={<ProfilePage />} path="/profile" />
//       <Route element={<SettingsPage />} path="/settings" />
//       <Route element={<CreateClass />} path="/create-class" />
//       <Route element={<JoinClass />} path="/join-class" />
//       <Route element={<JoinClass />} path="/join-class" />
//       <Route path="/class/:userId" element={<ClassPage />} />



//       {/* Authentication Routes */}
//       <Route path='/auth'>
//         <Route index element={<Navigate to="login" replace />} />
//         <Route element={<LoginPage />} path="login" />
//         <Route element={<RegisterPage />} path="register" />
//         <Route element={<ForgotPasswordPage />} path="forgot-password" />
//         <Route element={<ResetPasswordPage />} path="reset-password" />
//       </Route>

//       <Route element={<DashboardLayout />} path="/dashboard">

//         <Route index element={<DashboardHomePage />} />
//         <Route element={<DashboardClassesPage />} path="classes" />
//         <Route element={<DashboardCommunityPage />} path="community" />
//         <Route element={<DashboardMessagesPage />} path="messages" />
//         <Route element={<DashboardAssignmentPage />} path="assignment" />
//         <Route element={<DashboardSavedPage />} path="saved" />
//       </Route>

//       <Route element={<NotFoundPage />} path="/404" />
//       <Route element={<Navigate replace to="/404" />} path="*" />
//     </Routes>
//   )
// }

// export default AppRouter

export const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <GetStartedPage />
      }
    ]
  },

  // 1️⃣ DASHBOARD PAGES WITHOUT THE LAYOUT (Full Screen)
  {
    path: "/dashboard",
    children: [
      { path: "classes/:classId", element: <ClassPage /> },
      { path: "class/create", element: <CreateClassPage /> },
      { path: "class/join", element: <JoinClassPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "settings", element: <SettingsPage /> }
    ]
  },

  // 2️⃣ DASHBOARD PAGES WITH THE LAYOUT (Sidebar, Navbar, etc.)
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true, // Matches exactly "/dashboard"
        element: <DashboardHome />
      },
      {
        path: "classes", // Matches "/dashboard/classes"
        element: <DashboardClassesPage />
      },
      {
        path: "community",
        element: <DashboardCommunityPage />
      },
      {
        path: "messages",
        element: <DashboardMessagesPage />
      },
      {
        path: "assignments",
        element: <DashboardAssignmentPage />
      },
      {
        path: "saved",
        element: <DashboardSavedPage />
      }
    ]
  },

  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        loader: () => redirect("/auth/login"),
      },
      {
        path: "login",
        element: <LoginPage />
      },
      {
        path: "register",
        element: <RegisterPage />
      },
      {
        path: "forgot-password",
        element: <ForgotPasswordPage />
      },
      {
        path: "reset-password",
        element: <ResetPasswordPage />
      }
    ]
  },
  {
    path: "*",
    element: <NotFound />
  }
]);
