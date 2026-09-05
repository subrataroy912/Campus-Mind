import { ArrowRight, BookOpen, HeartHandshake, Users } from 'lucide-react'
import BrandLogo from '../components/common/BrandLogo.jsx'
import Button from '../components/common/Button.jsx'

const features = [
  { icon: BookOpen, title: 'Keep classwork together', text: 'Find class updates, assignments, and useful resources in one calm place.' },
  { icon: Users, title: 'Learn with your people', text: 'Make study groups and classroom conversations easy to join.' },
  { icon: HeartHandshake, title: 'Built for every learner', text: 'A clear, welcoming space for students and teachers to stay connected.' },
]

export default function GetStartedPage() {
  return <main className="min-h-screen bg-canvas px-4 py-5 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-6xl">
      <header className="flex items-center justify-between py-3">
        <BrandLogo />
        <Button to="/auth/login" variant="ghost" className="px-4">Sign in</Button>
      </header>
      <section className="grid gap-10 py-16 lg:grid-cols-[1.2fr_.8fr] lg:items-center lg:py-24">
        <div>
          <p className="inline-flex rounded-full bg-accent/15 px-3 py-1 text-sm font-semibold text-primary">A shared space for campus life</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-text-heading sm:text-5xl">Stay organized. Feel connected. Learn together.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-text-main">CampusMind helps classes share the everyday details that make learning easier—without making school feel more complicated.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button to="/auth/register" className="px-6">Create a local account <ArrowRight size={18} /></Button>
            <Button to="/auth/login" variant="outline" className="px-6">Explore the demo</Button>
          </div>
          <p className="mt-4 text-sm text-text-muted">Try the demo: student@campusmind.local · password123</p>
        </div>
        <aside className="rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold text-primary">Today at CampusMind</p>
          <h2 className="mt-2 text-2xl font-bold text-text-heading">A little clarity for a busy week.</h2>
          <div className="mt-6 space-y-3">
            {['Review Algebra II notes', 'Join the history discussion', 'Save the physics practice set'].map((item, index) => <div className="flex items-center gap-3 rounded-xl bg-canvas p-3" key={item}><span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-sm font-bold text-surface">{index + 1}</span><span className="font-medium text-text-main">{item}</span></div>)}
          </div>
        </aside>
      </section>
      <section className="grid gap-4 pb-12 md:grid-cols-3">
        {features.map(({ icon: Icon, title, text }) => <article className="rounded-2xl border border-border bg-surface p-6" key={title}><Icon className="text-primary" aria-hidden="true" /><h2 className="mt-4 text-lg font-bold text-text-heading">{title}</h2><p className="mt-2 leading-6 text-text-muted">{text}</p></article>)}
      </section>
    </div>
  </main>
}
