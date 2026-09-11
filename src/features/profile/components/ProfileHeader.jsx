import { useState } from "react";
import { Link } from "react-router";
import { Globe, Menu, MessageCircle, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";
import { initials } from "@/utils/initials.js";

export default function ProfileHeader({
  profile,
  isOwner,
  onEdit,
  onPreview,
  sharedClassCount,
}) {
  const copyLink = () =>
    navigator.clipboard?.writeText(
      `${window.location.origin}/dashboard/profile/${profile.id}`,
    );
  return (
    <header className="overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-border">
      <div className="h-40 bg-accent/30 sm:h-56">
        {profile.banner ? (
          <img
            src={profile.banner}
            alt="Profile banner"
            className="block h-full w-full object-cover"
          />
        ) : (
          <div className="h-full bg-linear-to-r from-accent/20 to-accent/40" />
        )}
      </div>
      <div className="px-4 pb-6 sm:px-7">
        <div className="flex items-center justify-between gap-3">
          <div className="-mt-10 flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-surface bg-primary text-xl font-bold text-primary-foreground shadow-sm">
            {profile.avatar ? (
              <img
                className="h-20 w-20 object-cover"
                src={profile.avatar}
                alt={`${profile.name}'s avatar`}
                referrerPolicy="no-referrer"
              />
            ) : (
              initials(profile.name)
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
          <h1 className="text-2xl font-bold tracking-tight text-text-heading">
            {profile.name}
          </h1>
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
                const url = link.startsWith("http://") || link.startsWith("https://") ? link : `https://${link}`;
                let displayUrl = link.replace(/^https?:\/\/(www\.)?/, "");
                if (displayUrl.endsWith("/")) displayUrl = displayUrl.slice(0, -1);
                return (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-canvas/60 px-2.5 py-1 text-xs font-medium text-text-main transition hover:border-primary/40 hover:bg-canvas hover:text-primary"
                  >
                    <Globe size={13} className="shrink-0 text-text-muted" />
                    <span className="max-w-[200px] truncate">{displayUrl}</span>
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
