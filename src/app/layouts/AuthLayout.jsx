import { Outlet } from 'react-router'
import BrandLogo from '@/components/common/BrandLogo.jsx'

function AuthLayout() {
  return (
    <main className="min-h-screen bg-canvas px-4 py-8 flex flex-col justify-center">
      <div className="mx-auto w-full max-w-sm">
        <div className="flex justify-center">
          <BrandLogo />
        </div>
        <div className="mt-5 rounded-xl border border-border/80 bg-surface p-5 shadow-xs sm:p-6">
          <Outlet />
        </div>
      </div>
    </main>
  );
}

export default AuthLayout
