import BrandLogo from '../common/BrandLogo.jsx'

function AuthLayout({ children }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-white text-gray-950">
      <div className="absolute -left-24 -top-24 h-[38rem] w-[38rem] rounded-full bg-purple-100 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-blue-100 blur-3xl" />
      <section className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 py-10 lg:grid-cols-[1fr_0.9fr]">
        <div className="hidden min-h-[42rem] flex-col justify-center lg:flex">
          <div className="mb-10"><BrandLogo /></div>
          <div className="relative rounded-[2rem] bg-gradient-to-br from-blue-50 via-purple-50 to-white p-10 shadow-inner">
            <div className="mb-8 inline-flex rounded-3xl bg-gradient-to-br from-blue-400 to-purple-500 p-8 text-7xl shadow-xl">🎓</div>
            <h2 className="max-w-xl text-5xl font-black leading-tight tracking-tight">Your classes, assignments, and messages in one calm workspace.</h2>
            <p className="mt-5 max-w-lg text-lg leading-8 text-gray-600">Continue to a text-first classroom experience designed for students and teachers.</p>
            <div className="mt-8 grid max-w-md grid-cols-3 gap-3 text-center text-sm font-bold text-gray-700">
              {['Classes', 'Tasks', 'Chat'].map((item) => <span className="rounded-2xl bg-white/80 px-4 py-3 shadow-sm" key={item}>{item}</span>)}
            </div>
          </div>
        </div>
        {children}
      </section>
    </main>
  )
}

export default AuthLayout
