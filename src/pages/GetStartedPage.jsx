import { ArrowRight, BookOpen, HeartHandshake, Users } from "lucide-react";
import BrandLogo from "@/components/common/BrandLogo";
import { Button } from "@/components/ui/button";
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
    text: "A clear, welcoming space for members and creators to stay connected.",
  },
];

export default function GetStartedPage() {
  return (
    <main className="min-h-dvh bg-canvas px-4 py-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between py-2.5 border-b border-border/60">
          <BrandLogo />
          <Button
            to={routes.auth.login}
            variant="ghost"
            size="sm"
            className="min-h-11 px-3 text-xs font-medium sm:min-h-8 sm:h-8"
          >
            Sign in
          </Button>
        </header>

        <section className="grid gap-8 py-8 sm:py-12 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
          <div>
            <span className="inline-flex rounded-md border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
              A shared space for campus life
            </span>
            <h1 className="mt-3.5 max-w-xl text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-text-heading">
              Stay organized. Feel connected. Learn together.
            </h1>
            <p className="mt-3 max-w-lg text-sm sm:text-base leading-relaxed text-text-muted">
              CampusMind helps classes share the everyday details that make
              learning easier—without making school feel more complicated.
            </p>
            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
              <Button
                to={routes.auth.register}
                className="min-h-11 px-5 text-sm sm:h-9 sm:min-h-9 sm:text-xs font-semibold gap-1.5"
                size="sm"
              >
                Get Started <ArrowRight size={14} />
              </Button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-lg border border-border/80 bg-surface p-2 shadow-xs">
            <div className="overflow-hidden rounded-md bg-card p-0.5">
              <img
                src="/images/illustrations/learning-ecosystem.jpg"
                alt="CampusMind learning and collaboration ecosystem"
                className="w-full aspect-16/10 rounded object-cover"
                loading="eager"
                width={800}
                height={500}
              />
            </div>
            <div className="mt-2 flex items-center justify-between px-1.5 text-[11px] text-text-muted">
              <span className="font-semibold text-primary">Interactive Learning</span>
              <span>Classes · Community · Collaboration</span>
            </div>
          </div>
        </section>

        <section className="grid gap-3 pb-8 md:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <article
              className="rounded-lg border border-border/80 bg-surface p-4 shadow-xs"
              key={title}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon size={15} aria-hidden="true" />
              </div>
              <h2 className="mt-2.5 text-xs font-semibold text-text-heading">
                {title}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-text-muted">{text}</p>
            </article>
          ))}
        </section>

        {/* Diverse community showcase banner */}
        <section className="mb-8 overflow-hidden rounded-lg border border-border/80 bg-surface shadow-xs">
          <div className="grid items-center gap-6 p-4 sm:p-6 lg:grid-cols-2">
            <div>
              <span className="inline-flex rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                Inclusive Community
              </span>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-text-heading sm:text-2xl">
                A welcoming space for every learner
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-text-muted">
                From study groups to collaborative projects, CampusMind brings learners, creators, and communities together in one inclusive space.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  to={routes.auth.register}
                  size="sm"
                  className="min-h-11 px-4 text-xs font-medium sm:min-h-8 sm:h-8"
                >
                  Join the Community
                </Button>
                <Button
                  to={routes.explore}
                  variant="outline"
                  size="sm"
                  className="min-h-11 px-4 text-xs font-medium sm:min-h-8 sm:h-8"
                >
                  Explore Courses
                </Button>
              </div>
            </div>
            <div className="overflow-hidden rounded-md border border-border/60 bg-card p-1 shadow-2xs">
              <img
                src="/images/illustrations/diverse-campus.jpg"
                alt="Diverse CampusMind community of learners and creators"
                className="w-full aspect-16/10 rounded object-cover"
                loading="lazy"
                width={800}
                height={500}
              />
            </div>
          </div>
        </section>
      </div>
      <footer className="py-4 text-center text-xs text-text-muted border-t border-border/50 max-w-5xl mx-auto">
        © {new Date().getFullYear()} CampusMind. All rights reserved.
      </footer>
    </main>
  );
}
