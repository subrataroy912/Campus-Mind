import { ArrowRight } from 'lucide-react'

function DashboardHeader() {
  return (
    <section className="page-header shadow-sm flex items-center justify-between rounded-lg bg-white p-6 text-gray-950 ">
      <div>
        <p className="greeting">Good morning ☀️</p>

        <h1>Welcome back, Nabojeet.</h1>

        <p className="subtitle">
          Stay organized, keep learning, and achieve your goals.
        </p>
      </div>

      <button className="primary-btn flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white transition hover:bg-purple-700">
        Explore Classes
        <ArrowRight size={18} />
      </button>
    </section>
  )
}

export default DashboardHeader
