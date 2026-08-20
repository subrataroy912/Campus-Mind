import { Navigate, Route, Routes } from 'react-router-dom'
import App from '../App.jsx'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage.jsx'
import LoginPage from '../pages/auth/LoginPage.jsx'
import RegisterPage from '../pages/auth/RegisterPage.jsx'
import ResetPasswordPage from '../pages/auth/ResetPasswordPage.jsx'
import ClassesPage from '../pages/classroom/ClassesPage.jsx'
import DashboardPage from '../pages/dashboard/DashboardPage.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<App />} path="/" />
      {/* Authentication Routes */}
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
