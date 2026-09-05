import { Link, useNavigate } from 'react-router'
import { LogOut, Menu, PanelLeftClose, UserRound } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'

export default function DashboardHeader({ isSidebarOpen, onSidebarToggle }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const leave = () => { logout(); navigate('/', { replace: true }) }
  return <header className="flex min-h-16 items-center justify-between border-b border-border bg-surface px-3 sm:px-6">
    <button className="rounded-md p-2 text-text-main transition-colors hover:bg-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus" onClick={onSidebarToggle} aria-label={isSidebarOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={isSidebarOpen}>{isSidebarOpen ? <PanelLeftClose size={20} /> : <Menu size={20} />}</button>
    <p className="hidden text-sm text-text-muted sm:block">A thoughtful place to learn together.</p>
    <div className="flex items-center gap-2"><Link to="/dashboard/profile" className="flex items-center gap-2 rounded-md p-2 text-sm font-semibold text-text-main transition-colors hover:bg-canvas"><span className="grid h-8 w-8 place-items-center rounded-full bg-accent/20 text-primary"><UserRound size={17} /></span><span className="hidden sm:inline">{user?.name || 'Profile'}</span></Link><button onClick={leave} className="rounded-md p-2 text-text-muted transition-colors hover:bg-canvas hover:text-primary" aria-label="Log out"><LogOut size={18} /></button></div>
  </header>
}
