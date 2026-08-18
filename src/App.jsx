import { ArrowRight, BookOpen, CalendarDays, MessageCircle, Play } from 'lucide-react'
import BrandLogo from './components/common/BrandLogo.jsx'
import Button from './components/common/Button.jsx'
import './App.css'

function App() {
  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-br from-white via-purple-50/40 to-blue-50 text-gray-950">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 sm:px-8 lg:px-10">
        <nav className="flex items-center justify-between">
          <BrandLogo />
          <div className="hidden items-center gap-12 text-base font-semibold text-gray-800 md:flex">
            <a href="#features">Features</a><a href="#how-it-works">How it Works</a><a href="#teachers">For Teachers</a><a href="#students">For Students</a>
          </div>
          <Button to="/login" className="px-8">Get Started nabo</Button>
        </nav>

        <div className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="space-y-8">
            <h1 className="text-6xl font-black leading-none tracking-tight sm:text-7xl lg:text-8xl">Learn. Share. <span className="block bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Connect.</span></h1>
            <p className="max-w-xl text-2xl leading-10 text-gray-700">A modern learning platform that brings classes, assignments and real-time text chat together.</p>
            <div className="flex flex-wrap gap-5">
              <Button to="/login" className="px-8 text-lg">Get Started <ArrowRight size={24} /></Button>
              <Button to="/dashboard" variant="secondary" className="px-8 text-lg">Learn More <Play className="rounded-full border border-purple-200 p-1 text-purple-600" size={30} /></Button>
            </div>
          </section>

          <section className="relative rounded-[2.5rem] border border-white/80 bg-white/70 p-8 shadow-2xl shadow-purple-200/60 backdrop-blur">
            <div className="absolute left-8 top-8 rounded-3xl bg-purple-600 p-5 text-white shadow-xl"><BookOpen size={44} /></div>
            <div className="absolute right-10 top-12 rounded-3xl bg-blue-500 p-5 text-white shadow-xl"><MessageCircle size={44} /></div>
            <div className="mx-auto flex min-h-[28rem] max-w-2xl items-center justify-center gap-3 pt-16 text-[8rem] sm:text-[10rem]">👩🏻‍💻🧑🏾‍🎓👩🏻‍🎓</div>
            <div className="grid gap-5 md:grid-cols-2">
              <article className="rounded-3xl bg-white p-5 shadow-lg"><p className="text-xl font-black">Biology 101</p><p className="mt-2 text-gray-600">Live Class • Today</p></article>
              <article className="rounded-3xl bg-white p-5 shadow-lg"><p className="text-xl font-black">Assignment Due</p><p className="mt-2 text-gray-600">Poster Design • Fri</p></article>
            </div>
            <div className="absolute bottom-44 left-4 rounded-2xl bg-teal-400 p-4 text-white shadow-lg"><p className="font-black">Team Chat</p><p className="text-sm">Discuss. Ask. Solve.</p></div>
            <CalendarDays className="absolute bottom-16 right-16 text-purple-500" size={42} />
          </section>
        </div>
      </section>
    </main>
  )
}

export default App
