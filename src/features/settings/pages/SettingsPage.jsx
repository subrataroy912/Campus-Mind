import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { LogOut, Moon, Shield, Sun, Trash2, UserRound } from "lucide-react";

import { useAuth } from "@/context/AuthContext.jsx";
import { Card } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Switch } from "@/components/ui/switch.jsx";
import ProfileSection from "@/features/profile/components/ProfileSection.jsx";
import { initials } from "@/utils/initials.js";

function SettingRow({ title, description, checked, onChange }) {
  return (
    <label className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <span>
        <span className="block text-sm font-semibold text-text-heading">{title}</span>
        <span className="mt-0.5 block text-sm text-text-muted">{description}</span>
      </span>
      <Switch checked={checked} onCheckedChange={onChange} className="mt-0.5 shrink-0" />
    </label>
  );
}

const DEFAULT_NOTIFICATIONS = {
  classAnnouncements: true,
  directMessages: true,
  assignmentReminders: true,
  weeklyDigest: false,
};

const DEFAULT_PRIVACY = {
  discoverable: true,
  showOnlineStatus: true,
};

export default function SettingsPage() {
  const { user, logout, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);
  const [privacy, setPrivacy] = useState(DEFAULT_PRIVACY);
  const [theme, setTheme] = useState(() => window.localStorage.getItem("campus-mind.theme") || "light");
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const toggleNotification = (key) =>
    setNotifications((previous) => ({ ...previous, [key]: !previous[key] }));

  const togglePrivacy = (key) =>
    setPrivacy((previous) => ({ ...previous, [key]: !previous[key] }));

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("campus-mind.theme", theme);
  }, [theme]);

  const handleDeleteAccount = async () => {
    await deleteAccount();
    navigate("/", { replace: true });
  };

  return (
    <div className="mx-auto max-w-4xl p-3 sm:p-6">
      <header>
        <p className="text-sm font-semibold text-primary">Account</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-text-heading">
          Settings
        </h1>
        <p className="mt-2 max-w-2xl text-text-muted">
          Manage your profile, notifications, and privacy preferences.
        </p>
      </header>

      <div className="mt-8 space-y-8">
        <Card className="p-5 sm:p-6">
          <div className="space-y-6">
            <ProfileSection
              title="Profile"
              description="This is how you appear across CampusMind."
              action={
                <Button variant="outline" to="/dashboard/profile">
                  Edit profile
                </Button>
              }
            >
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={`${user?.name || "User"}'s avatar`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials(user?.name || "") || <UserRound size={22} aria-hidden="true" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-text-heading">
                    {user?.name || "CampusMind member"}
                  </p>
                  <p className="truncate text-sm text-text-muted">
                    {user?.email || "no email on file"}
                  </p>
                </div>
              </div>
            </ProfileSection>

            <ProfileSection
              title="Notifications"
              description="Choose what CampusMind should notify you about."
            >
              <div className="divide-y divide-border rounded-xl border border-border px-4">
                <SettingRow
                  title="Class announcements"
                  description="Pinned posts and updates from your teachers."
                  checked={notifications.classAnnouncements}
                  onChange={() => toggleNotification("classAnnouncements")}
                />
                <SettingRow
                  title="Direct messages"
                  description="New messages from classmates and instructors."
                  checked={notifications.directMessages}
                  onChange={() => toggleNotification("directMessages")}
                />
                <SettingRow
                  title="Assignment reminders"
                  description="A nudge before something you saved is due."
                  checked={notifications.assignmentReminders}
                  onChange={() => toggleNotification("assignmentReminders")}
                />
                <SettingRow
                  title="Weekly digest"
                  description="A Sunday-evening summary of what you missed."
                  checked={notifications.weeklyDigest}
                  onChange={() => toggleNotification("weeklyDigest")}
                />
              </div>
            </ProfileSection>

            <ProfileSection
              title="Privacy"
              description="Control who can find and message you."
            >
              <div className="divide-y divide-border rounded-xl border border-border px-4">
                <SettingRow
                  title="Discoverable in class search"
                  description="Classmates can find your profile from a shared class."
                  checked={privacy.discoverable}
                  onChange={() => togglePrivacy("discoverable")}
                />
                <SettingRow
                  title="Show online status"
                  description="Let others see when you're active in a class."
                  checked={privacy.showOnlineStatus}
                  onChange={() => togglePrivacy("showOnlineStatus")}
                />
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-text-muted">
                <Shield size={14} aria-hidden="true" />
                Your email is never shown to other students.
              </p>
            </ProfileSection>

            <ProfileSection title="Appearance" description="Pick how CampusMind looks on this device.">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    theme === "light"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-text-main hover:bg-canvas"
                  }`}
                >
                  <Sun size={18} aria-hidden="true" />
                  Light
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    theme === "dark"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-text-main hover:bg-canvas"
                  }`}
                >
                  <Moon size={18} aria-hidden="true" />
                  Dark
                </button>
              </div>
              <p className="mt-3 text-xs text-text-muted">Theme preference is saved on this device.</p>
            </ProfileSection>
          </div>
        </Card>

        <Card className="border-primary/20 p-5 sm:p-6">
          <ProfileSection
            title="Account actions"
            description="Sign out here, or on every device you've used."
          >
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={handleLogout} className="gap-2">
                <LogOut size={16} aria-hidden="true" />
                Log out
              </Button>
            </div>
          </ProfileSection>

          <div className="mt-6 border-t border-border pt-6">
            <ProfileSection
              title="Danger zone"
              description="Deleting your account removes your classes, posts, and saved items. This can't be undone."
            >
              {confirmingDelete ? (
                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
                  <p className="flex-1 text-sm font-medium text-text-heading">
                    Are you sure? This will permanently delete your account.
                  </p>
                  <Button variant="destructive" onClick={handleDeleteAccount} className="gap-2">
                    <Trash2 size={16} aria-hidden="true" />
                    Yes, delete it
                  </Button>
                  <Button variant="outline" onClick={() => setConfirmingDelete(false)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button variant="destructive" onClick={() => setConfirmingDelete(true)} className="gap-2">
                  <Trash2 size={16} aria-hidden="true" />
                  Delete account
                </Button>
              )}
            </ProfileSection>
          </div>
        </Card>
      </div>
    </div>
  );
}
