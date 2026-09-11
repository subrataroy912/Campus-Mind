import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, LogOut, Moon, Sparkles, Sun, UserRound } from "lucide-react";

import { useAuth } from "@/context/AuthContext.jsx";
import { Card } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Switch } from "@/components/ui/switch.jsx";
import ProfileSection from "@/features/profile/components/ProfileSection.jsx";
import { useSettings } from "../hooks/useSettings.js";
import {
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
} from "@/features/notifications/api/notificationsApi.js";
import { initials } from "@/utils/initials.js";

function SettingRow({ title, description, checked, onChange }) {
  return (
    <label className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <span>
        <span className="block text-sm font-semibold text-text-heading">
          {title}
        </span>
        <span className="mt-0.5 block text-sm text-text-muted">
          {description}
        </span>
      </span>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        className="mt-0.5 shrink-0"
      />
    </label>
  );
}

export default function SettingsPage() {
  const { user, logout, unlockCreator } = useAuth();
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockMessage, setUnlockMessage] = useState("");
  const [unlockError, setUnlockError] = useState("");
  const { data: serverSettings } = useGetNotificationSettingsQuery();
  const [updateNotificationSettings] = useUpdateNotificationSettingsMutation();
  const {
    theme,
    isLoading: isThemeLoading,
    isSaving: isThemeSaving,
    error: themeError,
    updateTheme,
  } = useSettings();
  const navigate = useNavigate();

  const handleUnlockCreator = async () => {
    setIsUnlocking(true);
    setUnlockError("");
    setUnlockMessage("");
    try {
      await unlockCreator();
      setUnlockMessage("Course-creation privileges unlocked successfully!");
    } catch (err) {
      setUnlockError(
        err?.data?.error || err?.message || "Failed to unlock course creation privileges."
      );
    } finally {
      setIsUnlocking(false);
    }
  };

  const notifications = {
    emailEnabled: true,
    pushEnabled: true,
    inAppEnabled: true,
    ...serverSettings,
  };

  const handleToggleNotification = async (key) => {
    const nextNotifications = {
      ...notifications,
      [key]: !notifications[key],
    };

    try {
      await updateNotificationSettings(nextNotifications).unwrap();
    } catch {
      // RTK Query handles query cache invalidation on mutation
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/auth/login", { replace: true });
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const handleThemeChange = async (nextTheme) => {
    try {
      await updateTheme(nextTheme);
    } catch {
      // The hook exposes the save error for the page to render.
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-3 sm:p-6">
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="gap-2 text-text-muted hover:text-text-heading -ml-2"
        >
          <ArrowLeft size={16} /> Back
        </Button>
      </div>

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
                    initials(user?.name || "") || (
                      <UserRound size={22} aria-hidden="true" />
                    )
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

            {user?.accountType === "STUDENT" && (
              <ProfileSection
                title="Course Creation Privileges"
                description="Manage your creator permissions to set up classes and study groups."
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-border bg-canvas/50 p-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-text-heading">
                        Creator Status
                      </span>
                      {user?.canCreateCourses ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                          <Sparkles size={12} className="fill-amber-500 text-amber-500 shrink-0" />
                          Unlocked
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-secondary/10 px-2 py-0.5 text-xs font-medium text-secondary">
                          Standard Student
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-text-muted sm:text-sm">
                      {user?.canCreateCourses
                        ? "You have full privileges to create and manage courses and study groups."
                        : "Unlock course-creation privileges to build classes and host learning groups."}
                    </p>
                  </div>
                  {!user?.canCreateCourses && (
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleUnlockCreator}
                      disabled={isUnlocking}
                      className="shrink-0 bg-primary hover:bg-primary-hover text-surface font-medium"
                    >
                      {isUnlocking ? "Unlocking…" : "Unlock privileges"}
                    </Button>
                  )}
                </div>
                {unlockMessage && (
                  <p className="mt-2 text-xs font-medium text-success">
                    {unlockMessage}
                  </p>
                )}
                {unlockError && (
                  <p className="mt-2 text-xs font-medium text-destructive">
                    {unlockError}
                  </p>
                )}
              </ProfileSection>
            )}

            <ProfileSection
              title="Notifications"
              description="Choose what CampusMind should notify you about."
            >
              <div className="divide-y divide-border rounded-xl border border-border px-4">
                <SettingRow
                  title="Email notifications"
                  description="Receive account and learning updates by email."
                  checked={notifications.emailEnabled}
                  onChange={() => handleToggleNotification("emailEnabled")}
                />
                <SettingRow
                  title="Push notifications"
                  description="Allow browser or device push notifications."
                  checked={notifications.pushEnabled}
                  onChange={() => handleToggleNotification("pushEnabled")}
                />
                <SettingRow
                  title="In-app notifications"
                  description="Show activity updates inside CampusMind."
                  checked={notifications.inAppEnabled}
                  onChange={() => handleToggleNotification("inAppEnabled")}
                />
              </div>
            </ProfileSection>

            <ProfileSection
              title="Appearance"
              description="Pick how CampusMind looks on this device."
            >
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleThemeChange("light")}
                  disabled={isThemeLoading || isThemeSaving}
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
                  onClick={() => handleThemeChange("dark")}
                  disabled={isThemeLoading || isThemeSaving}
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
              {themeError && (
                <p className="mt-3 text-xs text-destructive" role="alert">
                  Unable to save your theme preference.
                </p>
              )}
              <p className="mt-3 text-xs text-text-muted">
                Theme preference is saved on this device.
              </p>
            </ProfileSection>
          </div>
        </Card>

        <Card className="border-primary/20 p-5 sm:p-6">
          <ProfileSection
            title="Account actions"
            description="Sign out here, or on every device you've used."
          >
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut size={16} aria-hidden="true" />
                Log out
              </Button>
            </div>
          </ProfileSection>
        </Card>
      </div>
    </div>
  );
}
