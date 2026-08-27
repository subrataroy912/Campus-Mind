import React from 'react'
import { Link } from 'react-router-dom'
import BrandLogo from './components/common/BrandLogo'

function App() {
  const routes = [
    {
      "id": "1",
      "name": "Home",
      "path": "/"
    },
    {
      "id": "2",
      "name": "Practice Hub",
      "path": "/practics"
    },
    {
      "id": "3",
      "name": "User Profile",
      "path": "/profile"
    },
    {
      "id": "4",
      "name": "Notifications",
      "path": "/notification"
    },
    {
      "id": "5",
      "name": "Login Portal",
      "path": "/auth/login"
    },
    {
      "id": "6",
      "name": "Register Account",
      "path": "/auth/register"
    },
    {
      "id": "7",
      "name": "Forgot Password",
      "path": "/auth/forgot-password"
    },
    {
      "id": "8",
      "name": "Reset Password",
      "path": "/auth/reset-password"
    },
    {
      "id": "9",
      "name": "Dashboard Home",
      "path": "/dashboard"
    },
    {
      "id": "10",
      "name": "Academic Classes",
      "path": "/dashboard/classes"
    },
    {
      "id": "11",
      "name": "Campus Chat",
      "path": "/dashboard/chat"
    },
    {
      "id": "12",
      "name": "System Settings",
      "path": "/dashboard/settings"
    }
  ]


  return (
    <div className='min-h-screen bg-sky-500 flex flex-col items-center justify-center p-4 relative pt-12'>

      <div className="absolute top-0 left-0 w-full bg-yellow-400 text-black py-1 font-bold text-sm shadow-md overflow-hidden z-50">
        <marquee behavior="scroll" direction="left" scrollamount="6">
          ⚠️ WARNING: For Testing Purposes All Routes Are Public!⚠️
        </marquee>
      </div>

      <div className='text-center mb-10 text-white'>
        <div className='flex justify-center mb-4'>
          <BrandLogo />
        </div>
        <h1 className='text-xl font-medium max-w-md mx-auto'>
          An Educational Platform where anyone can manage their academic activities digitally.
        </h1>
      </div>

      <div className='flex flex-col items-center justify-center  p-6  gap-4'>
        <Link to="/dashboard" className=" text-white text-xl font-serif  shadow-md shadow-black-md p-4 rounded-lg">
          Go to Dashboard
        </Link>
        <Link to="/auth" className="text-xl font-serif text-white shadow-md shadow-black-md p-4 rounded-lg">
          Go to Login/Register
        </Link>
      </div>

      {/* Platform Modules Section */}
      <section className="py-8 px-4 w-full max-w-4xl mx-auto">
        <div className="bg-slate-50 rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Platform Modules
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {routes.map((route) => (
              <li
                key={route.id}
                className="group flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-sky-300 transition-all duration-200"
              >
                <div className="flex flex-col">
                  <h1 className="text-lg font-medium text-slate-800 group-hover:text-sky-600 transition-colors">
                    {route.name}
                  </h1>
                  <span className="text-xs text-slate-400 font-mono">{route.path}</span>
                </div>
                <Link
                  to={route.path}
                  className="px-4 py-2 bg-sky-50 text-sky-600 text-sm font-semibold rounded-lg group-hover:bg-sky-500 group-hover:text-white transition-all duration-200"
                >
                  Go &rarr;
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

    </div>
  )
}

export default App
