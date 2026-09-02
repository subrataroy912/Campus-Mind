import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import { AppRouter } from './routes/AppRouter.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <RouterProvider router={AppRouter} />
  </StrictMode>,
)
