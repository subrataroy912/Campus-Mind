import { BookOpen, CalendarDays, GraduationCap } from "lucide-react";

const icons = { program: GraduationCap, focus: BookOpen, member: CalendarDays };

export default function ProfileDetails({ details }) {
  return (
    <dl className="grid gap-4 sm:grid-cols-3">
      {details?.map(({ label, value, icon }) => {
        const Icon = icons[icon];
        return (
          <div key={label} className="flex gap-3">
            <Icon
              className="mt-0.5 shrink-0 text-primary"
              size={18}
              aria-hidden="true"
            />
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                {label}
              </dt>
              <dd className="mt-1 text-sm font-medium text-text-main">
                {value}
              </dd>
            </div>
          </div>
        );
      })}
    </dl>
  );
}
