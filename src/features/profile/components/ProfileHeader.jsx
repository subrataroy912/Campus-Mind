import { Menu, MessageCircle, Pencil } from "lucide-react";
import { Button } from "../../../components/ui/button.jsx";
import { initials } from "../../../utils/initials.js";

export default function ProfileHeader({ profile = null, onEdit }) {
  return (
    <header className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {/* Banner */}
      <div
        className="relative  h-40 w-full overflow-hidden bg-accent/30 sm:h-54"
        aria-hidden="true"
      >
        {profile?.banner ? (
          <img
            src={profile.banner}
            alt="Profile banner"
            className="h-full w-full object-cover"
          />
        ) : (
          // Optional: Placeholder state when there is no banner image
          <div className="h-full w-full bg-linear-to-r from-accent/20 to-accent/40" />
        )}
      </div>

      <div className="px-4 pb-6 sm:px-7">
        <div className="flex items-center justify-between gap-3">
          {/* Avatar container */}
          <div className="-mt-10 flex items-end gap-4">
            <div className="z-10 grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full border-4 border-card bg-primary text-xl font-bold text-primary-foreground shadow-sm">
              {profile?.avatar ? (
                <img
                  className="h-full w-full object-cover"
                  src={profile.avatar}
                  alt={`${profile?.name}'s avatar`}
                />
              ) : (
                initials(profile?.name || "")
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex shrink-0 gap-2">
            {profile ? (
              <>
                <Button
                  variant="outline"
                  onClick={onEdit}
                  className="flex items-center gap-1 sm:mb-1"
                >
                  <Pencil size={16} aria-hidden="true" />
                  <span className="hidden min-[380px]:inline">Edit profile</span>
                </Button>
                <Button variant="outline" className="sm:mb-1" aria-label="Menu">
                  <Menu size={16} aria-hidden="true" />
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                to="/dashboard/messages"
                className="flex items-center gap-1 sm:mb-1"
              >
                <MessageCircle size={16} aria-hidden="true" />
                Message
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          {/* Profile Info */}
          <div className="mt-3 pb-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {profile?.name || "Anonymous User"}
            </h1>
            <p className="text-sm font-medium tracking-tight text-muted-foreground">
              @{profile?.handle || "unknown"}
            </p>
          </div>

          {/* Bio / Headline */}
          <div className="mt-4 max-w-2xl space-y-2">
            {profile?.headline && (
              <p className="text-sm font-medium text-foreground">
                {profile.headline}
              </p>
            )}
            {profile?.bio && (
              <p className="text-sm leading-6 text-muted-foreground">
                {profile.bio}
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
