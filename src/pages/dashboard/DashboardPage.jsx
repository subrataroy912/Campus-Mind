import { createElement } from 'react'
import { Bell, CalendarDays, ChevronRight, ClipboardList, Code2, FlaskConical, GraduationCap, Home, LogOut, Mail, Pi, Settings, User, Users } from 'lucide-react'
import BrandLogo from '../../components/common/BrandLogo.jsx'

const navItems = [{ label: 'Dashboard', icon: Home }, { label: 'My Classes', icon: CalendarDays }, { label: 'Calendar', icon: CalendarDays }, { label: 'Assignments', icon: ClipboardList }, { label: 'Messages', icon: Mail }, { label: 'Notifications', icon: Bell }, { label: 'Profile', icon: User }, { label: 'Settings', icon: Settings }]
const stats = [{ label: 'Classes', value: '3', icon: GraduationCap, color: 'from-blue-500 to-blue-600' }, { label: 'Assignments', value: '5', icon: ClipboardList, color: 'from-purple-500 to-purple-700' }, { label: 'Due Today', value: '2', icon: CalendarDays, color: 'from-teal-400 to-teal-600' }, { label: 'Messages', value: '4', icon: Mail, color: 'from-red-400 to-red-500' }]
const classes = [{ name: 'Mathematics', section: 'Section A • Mr. Thompson', students: 28, progress: 75, icon: Pi, color: 'blue' }, { name: 'Physics', section: 'Section B • Dr. Patel', students: 31, progress: 60, icon: FlaskConical, color: 'purple' }, { name: 'Computer Science', section: 'Section C • Prof. Lee', students: 26, progress: 90, icon: Code2, color: 'teal' }]
const assignments = [{ title: 'Calculus Problem Set', className: 'Mathematics • Section A', tag: 'Mathematics', due: 'Due in 2 Hours', icon: Pi, color: 'blue', dueColor: 'red' }, { title: "Lab Report: Newton's Laws", className: 'Physics • Section B', tag: 'Physics', due: 'Due Tomorrow', icon: FlaskConical, color: 'purple', dueColor: 'orange' }, { title: 'Python Programming Project', className: 'Computer Science • Section C', tag: 'Computer Science', due: 'Due in 3 days', icon: Code2, color: 'teal', dueColor: 'green' }]
const colorMap = { blue: 'bg-blue-500 text-white', purple: 'bg-purple-600 text-white', teal: 'bg-teal-500 text-white', red: 'bg-red-400 text-white', orange: 'bg-orange-400 text-white', green: 'bg-green-500 text-white' }

function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-950 lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="hidden min-h-screen flex-col border-r border-gray-100 bg-white p-6 shadow-sm lg:flex">
        <BrandLogo />
        <nav className="mt-10 space-y-3">
          {navItems.map(({ label, icon: Icon }, index) => <a className={`flex min-h-14 items-center gap-4 rounded-2xl px-5 text-lg font-bold ${index === 0 ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-purple-200' : 'text-gray-700 hover:bg-gray-50'}`} href="#dashboard" key={label}>{createElement(Icon, { size: 25 })}{label}</a>)}
        </nav>
        <button className="mt-auto flex min-h-14 items-center gap-4 border-t border-gray-100 pt-8 text-lg font-bold text-gray-700"><LogOut size={25} />Logout</button>
      </aside>
      <section className="px-5 py-8 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div><h1 className="text-5xl font-black tracking-tight">Good Morning, Alex 👋</h1><p className="mt-3 text-xl text-gray-600">Ready to learn something amazing today?</p></div>
          <div className="flex items-center gap-5"><button className="relative rounded-2xl bg-white p-5 shadow-sm"><Bell size={28} /><span className="absolute right-3 top-2 rounded-full bg-purple-600 px-2 text-sm font-bold text-white">3</span></button><div className="flex items-center gap-3"><span className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-gray-200 to-gray-400 text-3xl">👨🏻</span><div><p className="text-xl font-black">Alex Johnson</p><p className="text-gray-600">Student</p></div></div></div>
        </header>
        <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{stats.map(({ label, value, icon: Icon, color }) => <article className={`rounded-3xl bg-gradient-to-r ${color} p-7 text-white shadow-lg`} key={label}><div className="flex items-center justify-between">{createElement(Icon, { size: 48 })}<span className="grid h-11 w-11 place-items-center rounded-full bg-white/90 text-purple-600"><ChevronRight /></span></div><p className="mt-4 text-xl font-bold">{label}</p><p className="text-5xl font-black">{value}</p></article>)}</section>
        <section className="mt-8"><div className="flex items-center justify-between"><h2 className="text-3xl font-black">My Classes</h2><a className="flex items-center gap-2 text-xl font-bold text-purple-700" href="#classes">View All <ChevronRight /></a></div><div className="mt-5 grid gap-5 xl:grid-cols-3">{classes.map(({ name, section, students, progress, icon: Icon, color }) => <article className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm" key={name}><div className="flex gap-5"><span className={`grid h-16 w-16 place-items-center rounded-2xl ${colorMap[color]}`}>{createElement(Icon, { size: 38 })}</span><div><h3 className="text-2xl font-black">{name}</h3><p className="text-gray-600">{section}</p><p className="mt-3 flex items-center gap-2 font-bold"><Users size={20} />{students} Students</p></div></div><p className="mt-6 font-black">Progress</p><div className="mt-3 flex items-center gap-4"><span className="h-3 flex-1 rounded-full bg-gray-100"><span className={`block h-full rounded-full ${colorMap[color]}`} style={{ width: `${progress}%` }} /></span><span className="font-black">{progress}%</span></div></article>)}</div></section>
        <section className="mt-8"><div className="flex items-center justify-between"><h2 className="text-3xl font-black">Upcoming Assignments</h2><a className="flex items-center gap-2 text-xl font-bold text-purple-700" href="#assignments">View All <ChevronRight /></a></div><div className="mt-5 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">{assignments.map(({ title, className, tag, due, icon: Icon, color, dueColor }) => <article className="grid gap-4 border-b border-gray-100 p-5 last:border-b-0 md:grid-cols-[1fr_auto_auto] md:items-center" key={title}><div className="flex items-center gap-5"><span className={`grid h-16 w-16 place-items-center rounded-2xl ${colorMap[color]}`}>{createElement(Icon, { size: 36 })}</span><div><h3 className="text-2xl font-black">{title}</h3><p className="text-gray-600">{className}</p></div></div><span className={`rounded-xl px-5 py-3 font-bold ${colorMap[color]}`}>{tag}</span><span className={`rounded-xl px-5 py-3 font-bold ${colorMap[dueColor]}`}>{due}</span></article>)}</div></section>
      </section>
    </main>
  )
}

export default DashboardPage
