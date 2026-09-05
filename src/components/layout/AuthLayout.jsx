import { Outlet } from 'react-router'
import BrandLogo from '../common/BrandLogo.jsx'

function AuthLayout() {
    return (
    <main className="min-h-screen bg-canvas px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-md">
        <BrandLogo />
        <div className="mt-8 rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-8"><Outlet /></div>
      </div>
    </main>
    )
}

export default AuthLayout
