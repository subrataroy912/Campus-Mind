import {
  BookOpen,
  Calendar,
  CalendarDays,
  Eye,
  GraduationCap,
  Home,
  MapPin,
  Phone,
  Sparkles,
  User,
} from "lucide-react";
import { formatDisplayText } from "@/utils/textFormat.js";

const icons = {
  program: GraduationCap,
  focus: BookOpen,
  member: CalendarDays,
  phone: Phone,
  gender: User,
  calendar: Calendar,
  location: MapPin,
  address: Home,
  visibility: Eye,
};

export default function ProfileDetails({ details = [] }) {
  const visibleDetails = details.filter(
    (d) => d?.value && d.value !== "—" && d.value !== "",
  );

  if (!visibleDetails.length) return null;

  return (
    <section
      aria-label="Profile Details"
      className="rounded-xl border border-border/70 bg-card p-3 shadow-none sm:p-3.5"
    >
      <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {visibleDetails.map(({ label, value, icon, isCreator }) => {
          const Icon = icons[icon] || BookOpen;
          const formattedValue =
            typeof value === "string"
              ? formatDisplayText(value) || value
              : value;

          return (
            <div
              key={label}
              className="flex items-center gap-2.5 rounded-lg border border-border/40 bg-muted/20 px-2.5 py-1.5 transition-colors hover:bg-muted/40"
            >
              {/* Micro-Icon Plate */}
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border/60 bg-background text-muted-foreground shadow-2xs">
                <Icon className="h-3 w-3 text-primary" aria-hidden="true" />
              </div>

              {/* Compact Key-Value Stack */}
              <div className="flex min-w-0 flex-1 flex-col leading-tight">
                <dt className="truncate text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {label}
                </dt>
                <dd className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-foreground">
                  <span className="truncate">{formattedValue}</span>
                  {isCreator && (
                    <span
                      className="inline-flex shrink-0 items-center text-amber-500"
                      title="Course Creator"
                      aria-label="Course Creator"
                    >
                      <Sparkles className="h-2.5 w-2.5 fill-amber-500" />
                    </span>
                  )}
                </dd>
              </div>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
