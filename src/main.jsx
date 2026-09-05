import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import './index.css'
import { AppRoutes } from './routes/AppRoutes.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode><AuthProvider><Suspense fallback={<div className="grid min-h-screen place-items-center bg-canvas px-4 text-center text-sm font-medium text-text-muted" role="status">Loading CampusMind…</div>}><RouterProvider router={AppRoutes} /></Suspense></AuthProvider></StrictMode>,
)
