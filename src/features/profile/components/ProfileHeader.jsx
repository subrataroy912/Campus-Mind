import { useState } from "react";
import { Link } from "react-router";
import {
  Camera,
  Globe,
  MoreHorizontal,
  MessageCircle,
  Pencil,
  Sparkles,
  Trash2,
} from "lucide-react";
import { routes } from "@/routes/paths.js";
import { Button } from "@/components/ui/button.jsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.jsx";
import { toast } from "@/components/ui/toast.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import { initials } from "@/utils/initials.js";
import { parseApiError } from "@/lib/errorUtils.js";

export default function ProfileHeader({
  profile,
  isOwner,
  onEdit,
  onPreview,
  sharedClassCount,
  onAvatarUpload,
  onAvatarDelete,
  onBannerUpload,
  onBannerDelete,
}) {
  const { unlockCreator } = useAuth();
  const [showCreatorConfirm, setShowCreatorConfirm] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleConfirmUnlock = async () => {
    setIsUnlocking(true);
    try {
      await unlockCreator();
      toast.add({
        title: "Course Creator Unlocked",
        description:
          "You now have privileges to build classes and host learning groups.",
        type: "success",
      });
      setShowCreatorConfirm(false);
    } catch (err) {
      toast.add({
        title: "Unlock failed",
        description: parseApiError(
          err,
          "Failed to unlock course creation privileges. Please try again.",
        ).message,
        type: "error",
      });
    } finally {
      setIsUnlocking(false);
    }
  };

  const copyLink = () =>
    navigator.clipboard?.writeText(
      `${window.location.origin}${routes.user(profile.id)}`,
    );
  return (
    <header className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-none">
      <div className="relative h-24 sm:h-32 md:h-40 w-full overflow-hidden bg-muted/40 transition-all">
        {profile.banner ? (
          <img
            src={profile.banner}
            alt="Profile banner"
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-primary/15 via-primary/5 to-muted" />
        )}

        {isOwner && (onBannerUpload || onBannerDelete) && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
            {onBannerUpload && (
              <label
                title="Change profile banner (Recommended: 1200 × 300px, 4:1 ratio · Keep important text centered)"
                className="flex cursor-pointer items-center gap-1 rounded-md bg-background/85 px-2 py-0.5 text-[10px] font-medium text-foreground shadow-2xs backdrop-blur-xs transition hover:bg-background"
              >
                <Camera className="h-3 w-3" />
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
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
            {profile.banner && onBannerDelete && (
              <button
                type="button"
                onClick={onBannerDelete}
                title="Remove banner cover"
                className="flex cursor-pointer items-center justify-center rounded-md bg-background/85 p-1 text-[10px] text-destructive hover:bg-destructive/10 shadow-2xs backdrop-blur-xs transition"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* 2. Integrated Identity Strip */}
      <div className="px-3.5 pb-3 sm:px-5 sm:pb-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          {/* Avatar + Main Names Lockup */}
          <div className="flex items-end gap-3 sm:gap-4">
            {/* Anchored Responsive Avatar (h-14 mobile, h-18 tablet, h-21 desktop) */}
            <div className="relative -mt-7 sm:-mt-9 md:-mt-11 flex h-14 w-14 sm:h-18 sm:w-18 md:h-21 md:w-21 shrink-0 items-center justify-center rounded-full border-2 sm:border-[3px] md:border-4 border-card bg-primary text-xs sm:text-base md:text-lg font-bold text-primary-foreground shadow-md">
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full">
                {profile.avatar ? (
                  <img
                    className="h-full w-full object-cover"
                    src={profile.avatar}
                    alt={`${profile.name}'s avatar`}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  initials(profile.name)
                )}
              </div>

              {isOwner && (onAvatarUpload || onAvatarDelete) && (
                <div className="absolute -bottom-0.5 -right-0.5 flex items-center gap-0.5">
                  {onAvatarUpload && (
                    <label
                      title="Change avatar (Recommended: 400 × 400px, 1:1 square · Max 2MB)"
                      className="flex h-5 w-5 sm:h-6 sm:w-6 cursor-pointer items-center justify-center rounded-full border border-card bg-background text-muted-foreground shadow-2xs transition hover:text-foreground hover:bg-canvas"
                    >
                      <Camera className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
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
                  {profile.avatar && onAvatarDelete && (
                    <button
                      type="button"
                      onClick={onAvatarDelete}
                      title="Remove avatar picture"
                      className="flex h-5 w-5 sm:h-6 sm:w-6 cursor-pointer items-center justify-center rounded-full border border-card bg-background text-destructive shadow-2xs transition hover:bg-destructive/10"
                    >
                      <Trash2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Inlined Name & Meta Row */}
            <div className="min-w-0 space-y-0.5">
              <div className="flex flex-wrap items-center gap-1.5">
                <h1 className="truncate text-sm font-semibold tracking-tight text-foreground sm:text-base">
                  {profile.name}
                </h1>

                {profile.canCreateCourses && (
                  <span
                    data-slot="creator-badge"
                    className="inline-flex items-center gap-0.5 rounded border border-amber-500/20 bg-amber-500/10 px-1 py-0.2 text-[9px] font-medium text-amber-600 dark:text-amber-400"
                    title="Course Creator"
                  >
                    <Sparkles className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
                    Creator
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-2 text-[11px] text-muted-foreground">
                <span>@{profile.handle || "unknown"}</span>
                {!isOwner && sharedClassCount > 0 && (
                  <>
                    <span>·</span>
                    <span className="font-medium text-primary">
                      {sharedClassCount} shared{" "}
                      {sharedClassCount === 1 ? "class" : "classes"}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex shrink-0 items-center gap-1.5 self-start pt-1 sm:self-auto sm:pt-0">
            {isOwner ? (
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="h-7 gap-1 px-2.5 text-xs"
              >
                <Pencil className="h-3 w-3" aria-hidden="true" />
                <span>Edit</span>
              </Button>
            ) : (
              <Button
                size="sm"
                to={`${routes.messages}?member=${profile.id}`}
                className="h-7 gap-1 px-2.5 text-xs font-medium"
              >
                <MessageCircle className="h-3 w-3" aria-hidden="true" />
                <span>Message</span>
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    aria-label="Profile options"
                  >
                    <MoreHorizontal
                      className="h-3.5 w-3.5"
                      aria-hidden="true"
                    />
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-48">
                {isOwner ? (
                  <>
                    <DropdownMenuItem onClick={copyLink} className="text-xs">
                      Share profile link
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onPreview} className="text-xs">
                      View as others see it
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      render={<Link to={routes.settings} />}
                      className="text-xs"
                    >
                      Go to Settings
                    </DropdownMenuItem>
                    {!profile.canCreateCourses && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setShowCreatorConfirm(true)}
                          className="flex flex-col items-start gap-0.5 py-1.5 cursor-pointer text-xs"
                        >
                          <span className="flex items-center gap-1.5 font-medium text-foreground">
                            <Sparkles className="h-3 w-3 fill-amber-500 text-amber-500 shrink-0" />
                            Become a Creator
                          </span>
                          <span className="text-[10px] leading-tight text-muted-foreground">
                            Unlocks course and group creation. Permanent change.
                          </span>
                        </DropdownMenuItem>
                      </>
                    )}
                  </>
                ) : (
                  <ViewerMenu copyLink={copyLink} />
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* 3. Sub-Details: Headline, Bio & Inlined Links */}
        {(profile.headline ||
          profile.bio ||
          (profile.links && profile.links.length > 0)) && (
          <div className="mt-2.5 space-y-1.5 border-t border-border/40 pt-2 text-xs">
            {profile.headline && (
              <p className="font-medium text-foreground/90">
                {profile.headline}
              </p>
            )}

            {profile.bio ? (
              <p className="max-w-2xl leading-relaxed text-muted-foreground">
                {profile.bio}
              </p>
            ) : isOwner ? (
              <p className="text-muted-foreground">
                Add a bio so classmates know about you.{" "}
                <button
                  type="button"
                  onClick={onEdit}
                  className="text-primary underline underline-offset-2 hover:text-primary/80"
                >
                  Edit
                </button>
              </p>
            ) : null}

            {/* Compact Link Pills */}
            {Array.isArray(profile.links) && profile.links.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                {profile.links.map((link, idx) => {
                  const rawUrl =
                    typeof link === "object" && link !== null ? link.url : link;
                  if (!rawUrl) return null;
                  const linkName =
                    typeof link === "object" && link !== null && link.name
                      ? link.name
                      : null;
                  const url =
                    rawUrl.startsWith("http://") ||
                    rawUrl.startsWith("https://")
                      ? rawUrl
                      : `https://${rawUrl}`;
                  let displayUrl = rawUrl.replace(/^https?:\/\/(www\.)?/, "");
                  if (displayUrl.endsWith("/"))
                    displayUrl = displayUrl.slice(0, -1);
                  const label = linkName || displayUrl;

                  return (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded border border-border/80 bg-muted/20 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:bg-muted/50 hover:text-foreground"
                    >
                      <Globe className="h-2.5 w-2.5 shrink-0" />
                      <span className="max-w-[130px] truncate">{label}</span>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Dialog for Becoming a Creator */}
      <Dialog open={showCreatorConfirm} onOpenChange={setShowCreatorConfirm}>
        <DialogContent className="max-w-sm p-4">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold text-foreground">
              Become a Course Creator
            </DialogTitle>
            <DialogDescription className="mt-1 text-xs text-muted-foreground">
              Unlock course-creation privileges to build classes and host
              learning groups. This is a permanent change and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-3 flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={isUnlocking}
              onClick={() => setShowCreatorConfirm(false)}
              className="h-7 px-2.5 text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={isUnlocking}
              onClick={handleConfirmUnlock}
              className="h-7 px-3 text-xs"
            >
              {isUnlocking ? "Unlocking…" : "Yes, Become Creator"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}

function ViewerMenu({ copyLink, onBlock, onReport }) {
  const [confirming, setConfirming] = useState(false);
  return confirming ? (
    <div className="p-2 space-y-1.5">
      <p className="text-[11px] text-muted-foreground">Block this member?</p>
      <div className="flex gap-1.5">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setConfirming(false)}
          className="h-6 px-2 text-[11px]"
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => {
            onBlock?.();
            setConfirming(false);
          }}
          className="h-6 px-2 text-[11px]"
        >
          Block
        </Button>
      </div>
    </div>
  ) : (
    <>
      <DropdownMenuItem onClick={copyLink} className="text-xs">
        Copy profile link
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        variant="destructive"
        onClick={onReport}
        className="text-xs"
      >
        Report
      </DropdownMenuItem>
      <DropdownMenuItem
        variant="destructive"
        onClick={() => setConfirming(true)}
        className="text-xs"
      >
        Block
      </DropdownMenuItem>
    </>
  );
}
