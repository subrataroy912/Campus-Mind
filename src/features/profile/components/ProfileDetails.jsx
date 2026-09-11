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

export default function ProfileDetails({ details }) {
  return (
    <dl className="grid gap-4 sm:grid-cols-3">
      {details?.map(({ label, value, icon, isCreator }) => {
        const Icon = icons[icon] || BookOpen;
        const formattedValue =
          typeof value === "string" ? formatDisplayText(value) || value : value;
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
              <dd className="mt-1 flex items-center gap-1.5 text-sm font-medium text-text-main">
                <span>{formattedValue}</span>
                {isCreator && (
                  <span
                    className="inline-flex items-center text-amber-500"
                    title="Course Creator"
                    aria-label="Course Creator"
                  >
                    <Sparkles size={14} className="fill-amber-500 shrink-0" />
                  </span>
                )}
              </dd>
            </div>
          </div>
        );
      })}
    </dl>
  );
}
