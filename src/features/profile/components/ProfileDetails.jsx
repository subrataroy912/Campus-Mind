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
import { CollapsibleSection } from "@/components/common/CollapsibleSection.jsx";

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

const personalLabels = new Set([
  "Headline",
  "Gender",
  "Date of Birth",
  "Profile visibility",
]);

export default function ProfileDetails({ details }) {
  const personalDetails =
    details?.filter((d) => personalLabels.has(d.label)) ?? [];
  const contactDetails =
    details?.filter((d) => !personalLabels.has(d.label)) ?? [];

  return (
    <div className="space-y-4">
      <CollapsibleSection
        title="Personal & Account Information"
        subtitle="Identity, role, and visibility settings"
        defaultExpanded={true}
        storageKey="profile-personal-section-expanded" // <-- Added this key
      >
        <dl className="grid gap-4 sm:grid-cols-3">
          {personalDetails.map(({ label, value, icon, isCreator }) => {
            const Icon = icons[icon] || BookOpen;
            const formattedValue =
              typeof value === "string"
                ? formatDisplayText(value) || value
                : value;
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
                        <Sparkles
                          size={14}
                          className="shrink-0 fill-amber-500"
                        />
                      </span>
                    )}
                  </dd>
                </div>
              </div>
            );
          })}
        </dl>
      </CollapsibleSection>

      {contactDetails.length > 0 && (
        <CollapsibleSection
          title="Contact & Location"
          subtitle="Location and contact details"
          defaultExpanded={true}
          storageKey="profile-contact-section-expanded" // <-- Added this key
        >
          <dl className="grid gap-4 sm:grid-cols-3">
            {contactDetails.map(({ label, value, icon, isCreator }) => {
              const Icon = icons[icon] || BookOpen;
              const formattedValue =
                typeof value === "string"
                  ? formatDisplayText(value) || value
                  : value;
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
                          <Sparkles
                            size={14}
                            className="shrink-0 fill-amber-500"
                          />
                        </span>
                      )}
                    </dd>
                  </div>
                </div>
              );
            })}
          </dl>
        </CollapsibleSection>
      )}
    </div>
  );
}
