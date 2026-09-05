import { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router'
import { Plus, Settings, Ticket, X } from 'lucide-react'
import DashboardHeader from '../dashboard/DashboardHeader'
import SidebarNav from '../common/SidebarNav'
import BrandLogo from '../common/BrandLogo'
import { Button } from '../ui/button.jsx'

function SidebarContent({ compact = false, onNavigate, onClose }) {
  return <>
    <div className={`flex h-16 items-center border-b border-border ${compact ? 'justify-center px-3' : 'justify-between px-3'}`}><BrandLogo compact={compact} />{onClose && <button type="button" onClick={onClose} className="rounded-md p-2 text-text-muted transition-colors hover:bg-canvas hover:text-text-heading" aria-label="Close navigation"><X size={19} /></button>}</div>
    <SidebarNav compact={compact} onNavigate={onNavigate} />
    <div className="m-3 mt-0 space-y-2 border-t border-border pt-3"><p className={compact ? 'sr-only' : 'px-2 text-xs font-semibold uppercase tracking-wide text-text-muted'}>Classroom</p><Button to="/dashboard/class/join" variant="outline" className="w-full justify-start" onClick={onNavigate} title={compact ? 'Join with code' : undefined}><Ticket size={17} aria-hidden="true" /><span className={compact ? 'sr-only' : undefined}>Join with code</span></Button><Button to="/dashboard/class/create" className="w-full justify-start" onClick={onNavigate} title={compact ? 'Create a class' : undefined}><Plus size={17} aria-hidden="true" /><span className={compact ? 'sr-only' : undefined}>Create a class</span></Button></div>
    <div className="mt-auto border-t border-border p-3"><Link to="/dashboard/settings" onClick={onNavigate} title={compact ? 'Settings' : undefined} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-text-main transition-colors hover:bg-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"><Settings size={19} /><span className={compact ? 'sr-only' : undefined}>Settings</span></Link></div>
  </>
}

function DashboardLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const closeMobileSidebar = () => setIsMobileOpen(false)

  useEffect(() => {
    const closeOnDesktop = () => { if (window.innerWidth >= 768) closeMobileSidebar() }
    window.addEventListener('resize', closeOnDesktop)
    return () => window.removeEventListener('resize', closeOnDesktop)
  }, [])

  return <div className="flex h-dvh w-full overflow-hidden bg-canvas">
    <aside className={`z-20 hidden shrink-0 flex-col border-r border-border bg-surface transition-[width] duration-200 ease-out md:flex ${isCollapsed ? 'w-20' : 'w-72'}`} aria-label="Desktop navigation"><SidebarContent compact={isCollapsed} /></aside>
    {isMobileOpen && <><div className="fixed inset-0 z-30 bg-text-heading/40 backdrop-blur-[1px] md:hidden" aria-hidden="true" /><aside className="fixed inset-y-0 left-0 z-40 flex w-[18rem] max-w-[85vw] flex-col bg-surface shadow-2xl md:hidden" aria-label="Mobile navigation"><SidebarContent onNavigate={closeMobileSidebar} onClose={closeMobileSidebar} /></aside></>}
    <div className="relative flex h-full min-w-0 flex-1 flex-col" aria-hidden={isMobileOpen} inert={isMobileOpen ? '' : undefined}><div className="z-10 bg-surface"><DashboardHeader isDesktopCollapsed={isCollapsed} isMobileOpen={isMobileOpen} onDesktopToggle={() => setIsCollapsed((collapsed) => !collapsed)} onMobileToggle={() => setIsMobileOpen((open) => !open)} /></div><main className="flex-1 overflow-y-auto"><Outlet /></main></div>
  </div>
}

export default DashboardLayout
