import { ArrowRight, BookOpen, HeartHandshake, Users } from "lucide-react";
import BrandLogo from "../components/common/BrandLogo.jsx";
import { Button } from "../components/ui/button.jsx";
import { routes } from "@/routes/paths.js";

const features = [
  {
    icon: BookOpen,
    title: "Keep classwork together",
    text: "Find class updates, assignments, and useful resources in one calm place.",
  },
  {
    icon: Users,
    title: "Learn with your people",
    text: "Make study groups and classroom conversations easy to join.",
  },
  {
    icon: HeartHandshake,
    title: "Built for every learner",
    text: "A clear, welcoming space for students and teachers to stay connected.",
  },
];

export default function GetStartedPage() {
  return (
    <main className="min-h-screen bg-canvas px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between py-3">
          <BrandLogo />
          <Button to={routes.auth.login} variant="ghost" className="px-4">
            Sign in
          </Button>
        </header>

        <section className="grid gap-10 py-16 lg:grid-cols-[1.2fr_.8fr] lg:items-center lg:py-24">
          <div>
            <p className="inline-flex rounded-full bg-accent/15 px-3 py-1 text-sm font-semibold text-primary">
              A shared space for campus life
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-text-heading sm:text-5xl">
              Stay organized. Feel connected. Learn together.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-text-main">
              CampusMind helps classes share the everyday details that make
              learning easier—without making school feel more complicated.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button to={routes.auth.register} className="px-6" size="lg">
                Get Started <ArrowRight size={18} />
              </Button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-border bg-surface p-3 shadow-sm sm:p-4">
            <div className="overflow-hidden rounded-2xl bg-white p-1">
              <img
                src="/images/illustrations/learning-ecosystem.jpg"
                alt="CampusMind learning and collaboration ecosystem"
                className="w-full rounded-xl object-cover"
                loading="eager"
              />
            </div>
            <div className="mt-3 flex items-center justify-between px-2 text-xs text-text-muted">
              <span className="font-semibold text-primary">Interactive Learning</span>
              <span>Classes · Community · Collaboration</span>
            </div>
          </div>
        </section>

        <section className="grid gap-4 pb-12 md:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <article
              className="rounded-2xl border border-border bg-surface p-6 shadow-xs"
              key={title}
            >
              <Icon className="text-primary" aria-hidden="true" />
              <h2 className="mt-4 text-lg font-bold text-text-heading">
                {title}
              </h2>
              <p className="mt-2 leading-6 text-text-muted">{text}</p>
            </article>
          ))}
        </section>

        {/* Diverse community showcase banner */}
        <section className="mb-12 overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
          <div className="grid items-center gap-8 p-6 sm:p-10 lg:grid-cols-2">
            <div>
              <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                Inclusive Community
              </span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-text-heading sm:text-3xl">
                A welcoming space for every learner
              </h2>
              <p className="mt-3 text-base leading-7 text-text-muted">
                From first-year study groups to collaborative course projects, CampusMind brings students, teachers, and mentors together in one inclusive space.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button to={routes.auth.register} size="lg">
                  Join the Community
                </Button>
                <Button to={routes.explore} variant="outline" size="lg">
                  Explore Courses
                </Button>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-white p-1.5 shadow-xs">
              <img
                src="/images/illustrations/diverse-campus.jpg"
                alt="Diverse CampusMind community of students and educators"
                className="w-full rounded-xl object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </section>
      </div>
      <footer className="py-6 text-center text-sm text-text-muted">
        © {new Date().getFullYear()} CampusMind. All rights reserved.
      </footer>
    </main>
  );
}
