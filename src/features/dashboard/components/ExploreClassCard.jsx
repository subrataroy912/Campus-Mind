import { Link } from "react-router";
import {
  Code2,
  Brain,
  Shield,
  TrendingUp,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useDashboardData } from "@/features/dashboard/useDashboardData.js";
import {
  LaptopIllustration,
  BrainIllustration,
  ShieldIllustration,
  ChartIllustration,
} from "./ExploreClassIllustration.jsx";
import { getIllustrationForSubject } from "./exploreClassHelper.js";

const THEME_CONFIG = {
  orange: {
    cardBg: "bg-[#FFF7F2] dark:bg-[#2A1D1A]/60",
    border: "border-[#FFE5D6] dark:border-[#523226]",
    hoverBorder: "hover:border-[#F97316]/50",
    badgeBg: "bg-white/80 dark:bg-zinc-800/80 shadow-xs",
    iconColor: "text-[#E85D3B]",
    buttonBg: "bg-[#E85D3B] hover:bg-[#D44B29] text-white",
    Illustration: LaptopIllustration,
    defaultIcon: Code2,
  },
  emerald: {
    cardBg: "bg-[#F0FAF5] dark:bg-[#162720]/60",
    border: "border-[#D4EFE3] dark:border-[#234E3C]",
    hoverBorder: "hover:border-[#10B981]/50",
    badgeBg: "bg-white/80 dark:bg-zinc-800/80 shadow-xs",
    iconColor: "text-[#1F7A5E]",
    buttonBg: "bg-[#1F7A5E] hover:bg-[#17624B] text-white",
    Illustration: BrainIllustration,
    defaultIcon: Brain,
  },
  purple: {
    cardBg: "bg-[#F7F3FD] dark:bg-[#231A33]/60",
    border: "border-[#E7DCFC] dark:border-[#47346A]",
    hoverBorder: "hover:border-[#8B5CF6]/50",
    badgeBg: "bg-white/80 dark:bg-zinc-800/80 shadow-xs",
    iconColor: "text-[#5E48A2]",
    buttonBg: "bg-[#5E48A2] hover:bg-[#4E3989] text-white",
    Illustration: ShieldIllustration,
    defaultIcon: Shield,
  },
  blue: {
    cardBg: "bg-[#F1F7FE] dark:bg-[#192438]/60",
    border: "border-[#D6E7FC] dark:border-[#274670]",
    hoverBorder: "hover:border-[#3B82F6]/50",
    badgeBg: "bg-white/80 dark:bg-zinc-800/80 shadow-xs",
    iconColor: "text-[#2F7BE5]",
    buttonBg: "bg-[#2F7BE5] hover:bg-[#2067CB] text-white",
    Illustration: ChartIllustration,
    defaultIcon: TrendingUp,
  },
};

/**
 * ExploreClassCard matching high-fidelity design.
 * Can accept either a standard course object ('classroom' prop) or standalone topic fields.
 */
export default function ExploreClassCard({
  classroom,
  title,
  subject,
  learnersText,
  target: customTarget,
  theme: customTheme,
  className = "",
}) {
  const { classrooms = [] } = useDashboardData();

  // Determine values from either classroom prop or direct props
  const effectiveTitle = classroom ? classroom.title : title || "Course";
  const effectiveSubject = classroom
    ? classroom.subject || "General"
    : subject || "General";

  const rawLearners =
    classroom?.enrollmentCount != null
      ? Number(classroom.enrollmentCount)
      : null;

  const effectiveLearners =
    learnersText ||
    (rawLearners != null
      ? rawLearners >= 1000
        ? (rawLearners / 1000).toFixed(1).replace(/\.0$/, "") + "k learners"
        : rawLearners + " learners"
      : "1.2k learners");

  const detectedConfig = getIllustrationForSubject(
    effectiveSubject,
    effectiveTitle
  );
  const themeKey = customTheme || detectedConfig.theme || "orange";
  const theme = THEME_CONFIG[themeKey] || THEME_CONFIG.orange;
  const CardIllustration = theme.Illustration;
  const IconGlyph = theme.defaultIcon || Sparkles;

  // Routing resolution
  let target = customTarget;
  if (!target && classroom) {
    const courseId = classroom.courseId || classroom.id;
    const isEnrolled = classrooms.some(
      (c) => c.id === courseId || c.courseId === courseId
    );
    const accessType = (classroom.accessType || "OPEN").toUpperCase();

    if (isEnrolled || accessType === "OPEN") {
      target = `/dashboard/classes/${courseId}`;
    } else if (accessType === "INVITE") {
      target = `/dashboard/class/join?courseId=${encodeURIComponent(
        courseId
      )}&accessType=invite`;
    } else {
      target = classroom.code
        ? `/dashboard/class/join?courseId=${encodeURIComponent(
            courseId
          )}&accessType=code&code=${encodeURIComponent(classroom.code)}`
        : `/dashboard/class/join?courseId=${encodeURIComponent(
            courseId
          )}&accessType=code`;
    }
  }

  if (!target) {
    target = `/dashboard/explore?subject=${encodeURIComponent(
      effectiveSubject
    )}`;
  }

  return (
    <div
      className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${theme.cardBg} ${theme.border} ${theme.hoverBorder} ${className}`}
    >
      {/* Main content wrapper */}
      <div className="flex flex-1 items-start justify-between p-5">
        {/* Left column: Badge, Title, Learners count, and Explore button */}
        <div className="flex flex-col justify-between h-full pr-2 z-10">
          <div>
            {/* Category Icon Badge */}
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full border border-black/5 ${theme.badgeBg} ${theme.iconColor} mb-3 transition-transform group-hover:scale-105`}
            >
              <IconGlyph size={18} strokeWidth={2.2} />
            </div>

            {/* Course / Topic Title */}
            <h3 className="text-base sm:text-lg font-bold text-text-heading line-clamp-1 tracking-tight group-hover:text-primary transition-colors">
              {effectiveTitle}
            </h3>

            {/* Learners Count */}
            <p className="mt-0.5 text-xs text-text-muted font-normal">
              {effectiveLearners}
            </p>
          </div>

          {/* Explore Pill Button */}
          <div className="mt-4">
            <Link
              to={target}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold shadow-xs transition-all duration-150 active:scale-95 ${theme.buttonBg}`}
            >
              <span>Explore</span>
              <ArrowRight
                size={13}
                strokeWidth={2.4}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>

        {/* Right column: 3D Illustration */}
        <div className="shrink-0 flex items-center justify-center -mr-2 -mt-1 select-none pointer-events-none transition-transform duration-200 group-hover:scale-105">
          <img
            src={classroom.coverUrl}
            alt={effectiveTitle}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
