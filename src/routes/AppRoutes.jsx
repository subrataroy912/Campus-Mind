import { Navigate, Route, Routes } from 'react-router-dom'
import App from '../App.jsx'
import AssignmentDetailPage from '../pages/assignment/AssignmentDetailPage.jsx'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage.jsx'
import LoginPage from '../pages/auth/LoginPage.jsx'
import RegisterPage from '../pages/auth/RegisterPage.jsx'
import ResetPasswordPage from '../pages/auth/ResetPasswordPage.jsx'
import ChatPage from '../pages/chat/ChatPage.jsx'
import ClassChatPage from '../pages/chat/ClassChatPage.jsx'
import ClassesPage from '../pages/classroom/ClassesPage.jsx'
import ClassStreamPage from '../pages/classroom/ClassStreamPage.jsx'
import ClassworkPage from '../pages/classroom/ClassworkPage.jsx'
import CreateClassPage from '../pages/classroom/CreateClassPage.jsx'
import JoinClassPage from '../pages/classroom/JoinClassPage.jsx'
import MaterialsPage from '../pages/classroom/MaterialsPage.jsx'
import PeoplePage from '../pages/classroom/PeoplePage.jsx'
import DashboardPage from '../pages/dashboard/DashboardPage.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'
import NotificationsPage from '../pages/notification/NotificationsPage.jsx'
import ProfilePage from '../pages/profile/ProfilePage.jsx'
import SettingsPage from '../pages/settings/SettingsPage.jsx'
import GuardedRoute from './GuardedRoute.jsx'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<App />} path="/" />
      <Route element={<LoginPage />} path="/login" />

      <Route element={<RegisterPage />} path="/register" />

      <Route element={<ForgotPasswordPage />} path="/forgot-password" />

      <Route element={<ResetPasswordPage />} path="/reset-password" />

      <Route element={<DashboardPage />} path="/dashboard" />

      <Route element={<ClassesPage />} path="/classes" />







      <Route element={<NotFoundPage />} path="/404" />
      <Route element={<Navigate replace to="/404" />} path="*" />
    </Routes>
  )
}

export default AppRoutes
