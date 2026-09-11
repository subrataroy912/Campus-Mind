import { useState } from "react";
import { Link } from "react-router";
import { Camera, Globe, Menu, MessageCircle, Pencil, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";
import { initials } from "@/utils/initials.js";
import { formatDisplayText } from "@/utils/textFormat.js";

export default function ProfileHeader({
  profile,
  isOwner,
  onEdit,
  onPreview,
  sharedClassCount,
  onAvatarUpload,
  onBannerUpload,
}) {
  const copyLink = () =>
    navigator.clipboard?.writeText(
      `${window.location.origin}/dashboard/profile/${profile.id}`,
    );
  return (
    <header className="overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-border">
      <div className="relative h-40 bg-accent/30 sm:h-56">
        {profile.banner ? (
          <img
            src={profile.banner}
            alt="Profile banner"
            className="block h-full w-full object-cover"
          />
        ) : (
          <div className="h-full bg-linear-to-r from-accent/20 to-accent/40" />
        )}
        {isOwner && onBannerUpload && (
          <label className="absolute bottom-3 right-3 flex cursor-pointer items-center gap-1.5 rounded-lg bg-surface/90 px-3 py-1.5 text-xs font-medium text-text-heading shadow-md backdrop-blur-xs transition hover:bg-surface hover:text-primary">
            <Camera size={14} />
            <span>Change banner</span>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onBannerUpload(file);
                  e.target.value = "";
                }
              }}
            />
          </label>
        )}
      </div>
      <div className="px-4 pb-6 sm:px-7">
        <div className="flex items-center justify-between gap-3">
          <div className="relative -mt-10 flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-surface bg-primary text-xl font-bold text-primary-foreground shadow-sm">
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full">
              {profile.avatar ? (
                <img
                  className="h-full w-full object-cover"
                  src={profile.avatar}
                  alt={`${profile.name}'s avatar`}
                  referrerPolicy="no-referrer"
                />
              ) : (
                initials(profile.name)
              )}
            </div>
            {isOwner && onAvatarUpload && (
              <label
                title="Change avatar"
                className="absolute bottom-0 right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-surface bg-surface text-text-muted shadow-sm transition hover:border-primary/40 hover:text-primary"
              >
                <Camera size={13} />
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onAvatarUpload(file);
                      e.target.value = "";
                    }
                  }}
                />
              </label>
            )}
          </div>
          <div className="flex gap-2">
            {isOwner ? (
              <Button variant="outline" onClick={onEdit}>
                <Pencil aria-hidden="true" />
                <span className="hidden min-[380px]:inline">Edit profile</span>
              </Button>
            ) : (
              <Button to={`/dashboard/messages?member=${profile.id}`}>
                <MessageCircle aria-hidden="true" />
                Message
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Profile options"
                  >
                    <Menu aria-hidden="true" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-52">
                {isOwner ? (
                  <>
                    <DropdownMenuItem onClick={copyLink}>
                      Share profile link
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onPreview}>
                      View as others see it
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      render={<Link to="/dashboard/settings" />}
                    >
                      Go to Settings
                    </DropdownMenuItem>
                  </>
                ) : (
                  <ViewerMenu copyLink={copyLink} />
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-text-heading">
              {profile.name}
            </h1>
            <span
              className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary"
              title={profile.canCreateCourses ? "Course Creator" : undefined}
            >
              {formatDisplayText(profile.accountType) || "Student"}
              {profile.canCreateCourses && (
                <Sparkles
                  size={12}
                  className="fill-amber-500 text-amber-500 shrink-0"
                  aria-label="Course Creator"
                />
              )}
            </span>
          </div>
          <p className="text-sm font-medium text-text-muted">
            @{profile.handle || "unknown"}
          </p>
          {profile.headline && (
            <p className="mt-4 text-sm font-medium text-text-main">
              {profile.headline}
            </p>
          )}
          {!isOwner && sharedClassCount > 0 && (
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-secondary/10 px-2 py-0.5 text-[11px] font-medium text-secondary">
              {sharedClassCount} classes together
            </span>
          )}
          {profile.bio ? (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
              {profile.bio}
            </p>
          ) : (
            isOwner && (
              <p className="mt-2 text-sm text-text-muted">
                Add a bio so classmates know a bit about you.{" "}
                <button
                  onClick={onEdit}
                  className="text-primary hover:underline"
                >
                  Edit profile
                </button>
              </p>
            )
          )}
          {Array.isArray(profile.links) && profile.links.length > 0 && (
            <div className="mt-3.5 flex flex-wrap gap-2">
              {profile.links.map((link, idx) => {
                const rawUrl = typeof link === "object" && link !== null ? link.url : link;
                if (!rawUrl) return null;
                const linkName = typeof link === "object" && link !== null && link.name ? link.name : null;
                const url = rawUrl.startsWith("http://") || rawUrl.startsWith("https://") ? rawUrl : `https://${rawUrl}`;
                let displayUrl = rawUrl.replace(/^https?:\/\/(www\.)?/, "");
                if (displayUrl.endsWith("/")) displayUrl = displayUrl.slice(0, -1);
                const label = linkName || displayUrl;
                return (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-canvas/60 px-2.5 py-1 text-xs font-medium text-text-main transition hover:border-primary/40 hover:bg-canvas hover:text-primary"
                  >
                    <Globe size={13} className="shrink-0 text-text-muted" />
                    <span className="max-w-[200px] truncate">{label}</span>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function ViewerMenu({ copyLink, onBlock, onReport }) {
  const [confirming, setConfirming] = useState(false);
  return confirming ? (
    <div className="p-2">
      <p className="px-1 text-xs text-text-muted">Block this member?</p>
      <div className="mt-2 flex gap-2">
        <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
          Cancel
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => {
            onBlock?.();
            setConfirming(false);
          }}
        >
          Block
        </Button>
      </div>
    </div>
  ) : (
    <>
      <DropdownMenuItem onClick={copyLink}>Copy profile link</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive" onClick={onReport}>
        Report
      </DropdownMenuItem>
      <DropdownMenuItem
        variant="destructive"
        onClick={() => setConfirming(true)}
      >
        Block
      </DropdownMenuItem>
    </>
  );
}
