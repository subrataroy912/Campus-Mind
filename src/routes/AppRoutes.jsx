import { Navigate, Route, Routes } from 'react-router-dom'
import App from '../App.jsx'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage.jsx'
import LoginPage from '../pages/auth/LoginPage.jsx'
import RegisterPage from '../pages/auth/RegisterPage.jsx'
import ResetPasswordPage from '../pages/auth/ResetPasswordPage.jsx'
import DashboardLayout from '../components/layout/DashboardLayout.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'
import PracticsPage from '../pages/PracticsPage.jsx'
import DashboardHomePage from '../pages/dashboard/DashboardHomePage.jsx'
import DashboardClassesPage from '../pages/dashboard/DashboardClassesPage.jsx'
import DashboardChatPage from '../pages/dashboard/DashboardChatPage.jsx'
import DashboardSettingsPage from '../pages/dashboard/DashboardSettingsPage.jsx'

function AppRoutes() {
  return (
    <Routes>
      {/* Root public routes */}
      <Route element={<App />} path="/" />
      <Route element={<PracticsPage />} path="/practics" />

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
        <Route element={<DashboardClassesPage/>} path="classes" />
        <Route element={<DashboardChatPage/>} path="chat" />
        <Route element={<DashboardSettingsPage/>} path="settings" />
      </Route>

      <Route element={<NotFoundPage />} path="/404" />
      <Route element={<Navigate replace to="/404" />} path="*" />
    </Routes>
  )
}

export default AppRoutes
