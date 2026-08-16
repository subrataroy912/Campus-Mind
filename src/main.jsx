import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes.jsx'
import AuthProvider from './context/AuthContext.jsx'
import SocketProvider from './context/SocketContext.jsx'
import AppErrorBoundary from './components/common/AppErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <AppErrorBoundary>
            <AppRoutes />
          </AppErrorBoundary>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
