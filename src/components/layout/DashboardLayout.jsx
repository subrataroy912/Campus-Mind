import { useState } from 'react'
import { Link, Outlet } from 'react-router'
import { PanelLeftClose, PanelLeftOpen, Plus, Settings, Ticket } from 'lucide-react'
import DashboardHeader from '../dashboard/DashboardHeader'
import SidebarNav from '../common/SidebarNav'
import BrandLogo from '../common/BrandLogo'
import { Button } from '../ui/button.jsx'

function SidebarContent({ compact, onNavigate }) {
  return <>
    <div className="flex items-center justify-between border-b border-border py-2"><BrandLogo compact={compact} /><span className="sr-only">CampusMind navigation</span></div>
    <SidebarNav compact={compact} onNavigate={onNavigate} />
    <div className="space-y-2 border-t border-border p-3"><p className={compact ? 'sr-only' : 'px-2 text-xs font-semibold uppercase tracking-wide text-text-muted'}>Classroom</p><Button to="/dashboard/class/join" variant="outline" className="w-full justify-start" onClick={onNavigate} title={compact ? 'Join with code' : undefined}><Ticket size={17} aria-hidden="true" /><span className={compact ? 'sr-only' : undefined}>Join with code</span></Button><Button to="/dashboard/class/create" className="w-full justify-start" onClick={onNavigate} title={compact ? 'Create a class' : undefined}><Plus size={17} aria-hidden="true" /><span className={compact ? 'sr-only' : undefined}>Create a class</span></Button></div>
    <div className="border-t border-border p-3"><Link to="/dashboard/settings" onClick={onNavigate} title={compact ? 'Settings' : undefined} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-text-main transition-colors hover:bg-canvas"><Settings size={19} /><span className={compact ? 'sr-only' : undefined}>Settings</span></Link></div>
  </>
}

function DashboardLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const closeMobileSidebar = () => setIsMobileOpen(false)

  return <div className="flex h-screen w-full overflow-hidden bg-canvas">
    <aside className={`z-20 hidden shrink-0 flex-col border-r border-border bg-surface transition-[width] duration-200 md:flex ${isCollapsed ? 'w-20' : 'w-64'}`}><div className="flex justify-end px-3 pt-3"><button type="button" onClick={() => setIsCollapsed((collapsed) => !collapsed)} className="rounded-md p-2 text-text-muted transition-colors hover:bg-canvas hover:text-text-heading" aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>{isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}</button></div><SidebarContent compact={isCollapsed} /></aside>
    {isMobileOpen && <><div className="fixed inset-0 z-30 bg-text-heading/40" aria-hidden="true" /><aside className="fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-surface shadow-xl" aria-label="Mobile navigation"><div className="flex justify-end px-3 pt-3"><button type="button" onClick={closeMobileSidebar} className="rounded-md p-2 text-text-muted hover:bg-canvas" aria-label="Close navigation"><PanelLeftClose size={18} /></button></div><SidebarContent onNavigate={closeMobileSidebar} /></aside></>}
    <div className="relative flex h-full min-w-0 flex-1 flex-col" aria-hidden={isMobileOpen} inert={isMobileOpen ? '' : undefined}><div className="z-10 bg-surface"><DashboardHeader isSidebarOpen={isMobileOpen} onSidebarToggle={() => setIsMobileOpen((open) => !open)} /></div><main className="flex-1 overflow-y-auto"><Outlet /></main></div>
  </div>
}

export default DashboardLayout
