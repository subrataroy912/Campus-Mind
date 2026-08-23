import { Navigate, Route, Routes } from 'react-router-dom'
import App from '../App.jsx'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage.jsx'
import LoginPage from '../pages/auth/LoginPage.jsx'
import RegisterPage from '../pages/auth/RegisterPage.jsx'
import ResetPasswordPage from '../pages/auth/ResetPasswordPage.jsx'
import DashboardPage from '../pages/dashboard/DashboardPage.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'
import PracticsPage from '../pages/PracticsPage.jsx'
import DashboardHomeView from '../components/dashboard/DashboardHomeView.jsx'

function AppRoutes() {
  return (
    <Routes>
      {/* Root public routes */}
      <Route element={<App />} path="/" />
      <Route element={<PracticsPage />} path="/practics" />

      {/* Authentication Routes */}
      <Route element={<LoginPage />} path="/login" />
      <Route element={<RegisterPage />} path="/register" />
      <Route element={<ForgotPasswordPage />} path="/forgot-password" />
      <Route element={<ResetPasswordPage />} path="/reset-password" />

      <Route element={<DashboardPage />} path="/dashboard">
        <Route index element={<DashboardHomeView />} />


        <Route element={<h1>Working</h1>} path="classes" />
        <Route element={<h1>Chat View Working</h1>} path="chat" />
        <Route element={<h1>Settings View Working</h1>} path="settings" />
        <Route element={<h1>Notification View Working</h1>} path="notification" />
        <Route element={<h1>Profile View Working</h1>} path="profile" />
      </Route>

      <Route element={<NotFoundPage />} path="/404" />
      <Route element={<Navigate replace to="/404" />} path="*" />
    </Routes>
  )
}

export default AppRoutes
