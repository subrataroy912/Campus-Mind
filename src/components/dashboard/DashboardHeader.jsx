import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router'
import { LogOut, Menu, Plus, Settings, Ticket, UserRound, X } from 'lucide-react'
import { SIDEBAR_NAV_ITEMS } from '../../config/navigation.js'
import { getNavLinkStyles } from '../../utils/routeHelpers.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export default function DashboardHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const leave = () => { logout(); navigate('/', { replace: true }) }
  return <header className="flex min-h-16 items-center justify-between border-b border-border bg-surface px-3 sm:px-6">
    <button className="rounded-lg p-2 text-text-main hover:bg-canvas md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation" aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</button>
    <p className="hidden text-sm text-text-muted md:block">A thoughtful place to learn together.</p>
    <div className="flex items-center gap-2"><Link to="/dashboard/profile" className="flex items-center gap-2 rounded-lg p-2 text-sm font-semibold text-text-main hover:bg-canvas"><span className="grid h-8 w-8 place-items-center rounded-full bg-accent/20 text-primary"><UserRound size={17} /></span><span className="hidden sm:inline">{user?.name || 'Profile'}</span></Link><button onClick={leave} className="rounded-lg p-2 text-text-muted hover:bg-canvas hover:text-primary" aria-label="Log out"><LogOut size={18} /></button></div>
    {menuOpen && <nav className="absolute left-0 top-16 z-30 w-72 border-b border-r border-border bg-surface p-3 shadow-lg md:hidden"><ul className="space-y-1">{SIDEBAR_NAV_ITEMS.map(({ label, to, Icon }) => <li key={to}><NavLink to={to} end={to === '/dashboard'} className={getNavLinkStyles} onClick={() => setMenuOpen(false)}><Icon size={20} />{label}</NavLink></li>)}</ul><div className="mt-3 space-y-1 border-t border-border pt-3"><Link to="/dashboard/class/join" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-md p-3 text-sm font-medium text-text-main hover:bg-canvas"><Ticket size={20} />Join with code</Link><Link to="/dashboard/class/create" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-md bg-primary p-3 text-sm font-medium text-surface hover:bg-primary-hover"><Plus size={20} />Create a class</Link></div><Link to="/dashboard/settings" onClick={() => setMenuOpen(false)} className="mt-3 flex items-center gap-3 rounded-lg p-3 text-sm font-medium text-text-main hover:bg-canvas"><Settings size={20} />Settings</Link></nav>}
  </header>
}
