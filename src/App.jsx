import { Link } from 'react-router-dom'
import { ArrowRight, AlertTriangle, Route } from 'lucide-react'
import './App.css'

function App() {
  const devRoutes = [
    { name: 'Home(Current page)', path: '/' },
    { name: 'Code Practics(ONLY FOR DEVELOPMENT TIME)', path: '/practics' },
    { name: 'Login', path: '/login' },
    { name: 'Register', path: '/register' },
    { name: 'Forgot Password', path: '/forgot-password' },
    { name: 'Reset Password', path: '/reset-password' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Classes', path: '/classes' },
    { name: 'Settings', path: '/settings' },
    { name: 'Chat', path: '/chat' },
    { name: 'Profile', path: '/profile' },
    { name: 'Notification', path: '/notification' },
    { name: '404 Not Found', path: '/404' },
  ]

  return (
    <main className="min-h-screen w-full bg-linear-to-br from-white via-purple-50/40 to-blue-50 text-gray-950 flex items-center justify-center p-4 sm:p-8">

      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">

        {/* Warning Banner */}
        <div className="bg-red-600 px-6 py-8 text-center text-white sm:px-12">
          <h1 className="text-xl font-black uppercase tracking-wider sm:text-2xl md:text-3xl">
            CUMPUS MIND
          </h1>
          <AlertTriangle className="mx-auto mb-3 h-10 w-10 text-red-200" />
          <h1 className="text-xl font-black uppercase tracking-wider sm:text-2xl md:text-3xl">
            Don't change this page without team approval
          </h1>

          <h2 className="mt-2 text-sm font-semibold tracking-wide text-red-200 sm:text-base">
            This page is for development purposes only. It contains all the routes and links for easy testing and navigation during the development phase. Please refrain from making any changes without prior approval from the team.
          </h2>
        </div>

        {/* Development Routes Section */}
        <div className="p-6 sm:p-10">
          <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
            <Route className="h-6 w-6 text-purple-600" />
            <div>
              <h3 className="text-xl font-bold text-gray-800">Development Environment</h3>
              <p className="text-sm text-gray-500">Current working routes for easy testing.</p>
            </div>
          </div>

          {/* Responsive Grid for Links */}
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:gap-6">
            {devRoutes.map((route) => (
              <li key={route.path}>
                <Link
                  to={route.path}
                  className="group flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4 transition-all hover:border-purple-300 hover:bg-purple-50 hover:shadow-md"
                >
                  <span className="font-semibold text-gray-700 group-hover:text-purple-700">
                    {route.name}
                  </span>
                  <ArrowRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-purple-600" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </main>
  )
}

export default App