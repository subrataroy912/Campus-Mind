import { Navigate, Route, Routes } from 'react-router-dom'
import App from '../App.jsx'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage.jsx'
import LoginPage from '../pages/auth/LoginPage.jsx'
import RegisterPage from '../pages/auth/RegisterPage.jsx'
import ResetPasswordPage from '../pages/auth/ResetPasswordPage.jsx'
import DashboardLayout from '../components/layout/DashboardLayout.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'
import PracticsPage from '../pages/PracticsPage.jsx'
import GetStartedPage from '../pages/GetStartedPage.jsx'
import DashboardHomePage from '../pages/dashboard/DashboardHomePage.jsx'
import DashboardClassesPage from '../pages/dashboard/DashboardClassesPage.jsx'
import DashboardMessagesPage from '../pages/dashboard/DashboardMessagesPage.jsx'
import SettingsPage from '../pages/settings/SettingsPage.jsx'
import DashboardAssignmentPage from '../pages/dashboard/DashboardAssignmentPage.jsx'
import DashboardCommunityPage from '../pages/dashboard/DashboardCommunityPage.jsx'
import DashboardSavedPage from '../pages/dashboard/DashboardSavedPage.jsx'
import ProfilePage from "../pages/profile/ProfilePage.jsx"
import CreateClass from '../pages/classroom/CreateClass.jsx'
import JoinClass from '../pages/classroom/JoinClass.jsx'
import ClassPage from '../pages/classroom/ClassPage.jsx'

function AppRoutes() {
  return (
    <Routes>
      {/* Root public routes */}
      <Route element={<App />} path="/" />
      <Route element={<PracticsPage />} path="/practics" />
      <Route element={<GetStartedPage />} path="/get-started" />

      {/** Protected routes: Have to protect */}
      <Route element={<ProfilePage />} path="/profile" />
      <Route element={<SettingsPage />} path="/settings" />
      <Route element={<CreateClass />} path="/create-class" />
      <Route element={<JoinClass />} path="/join-class" />
      <Route element={<JoinClass />} path="/join-class" />
      <Route path="/class/:userId" element={<ClassPage />} />



      {/* Authentication Routes */}
      <Route path='/auth'>
        <Route index element={<Navigate to="login" replace />} />
        <Route element={<LoginPage />} path="login" />
        <Route element={<RegisterPage />} path="register" />
        <Route element={<ForgotPasswordPage />} path="forgot-password" />
        <Route element={<ResetPasswordPage />} path="reset-password" />
      </Route>

      <Route element={<DashboardLayout />} path="/dashboard">

        <Route index element={<DashboardHomePage />} />
        <Route element={<DashboardClassesPage />} path="classes" />
        <Route element={<DashboardCommunityPage />} path="community" />
        <Route element={<DashboardMessagesPage />} path="messages" />
        <Route element={<DashboardAssignmentPage />} path="assignment" />
        <Route element={<DashboardSavedPage />} path="saved" />
      </Route>

      <Route element={<NotFoundPage />} path="/404" />
      <Route element={<Navigate replace to="/404" />} path="*" />
    </Routes>
  )
}

export default AppRoutes
