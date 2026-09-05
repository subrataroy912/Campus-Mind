import { Link, useNavigate } from 'react-router'
import { LogOut, Menu, PanelLeftClose, PanelLeftOpen, UserRound } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'

export default function DashboardHeader({ isDesktopCollapsed, isMobileOpen, onDesktopToggle, onMobileToggle }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const leave = () => { logout(); navigate('/', { replace: true }) }

  return <header className="flex min-h-16 items-center justify-between border-b border-border bg-surface px-3 sm:px-5">
    <button className="rounded-md p-2 text-text-main transition-colors hover:bg-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus md:hidden" onClick={onMobileToggle} aria-label={isMobileOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={isMobileOpen}>{isMobileOpen ? <PanelLeftClose size={20} /> : <Menu size={20} />}</button>
    <button className="hidden rounded-md p-2 text-text-muted transition-colors hover:bg-canvas hover:text-text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus md:inline-flex" onClick={onDesktopToggle} aria-label={isDesktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>{isDesktopCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}</button>
    <p className="hidden text-sm text-text-muted sm:block">A thoughtful place to learn together.</p>
    <div className="ml-auto flex items-center gap-1 sm:gap-2"><Link to="/dashboard/profile" className="flex items-center gap-2 rounded-md p-2 text-sm font-semibold text-text-main transition-colors hover:bg-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"><span className="grid h-8 w-8 place-items-center rounded-full bg-accent/20 text-primary"><UserRound size={17} /></span><span className="hidden sm:inline">{user?.name || 'Profile'}</span></Link><button onClick={leave} className="rounded-md p-2 text-text-muted transition-colors hover:bg-canvas hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus" aria-label="Log out"><LogOut size={18} /></button></div>
  </header>
}
