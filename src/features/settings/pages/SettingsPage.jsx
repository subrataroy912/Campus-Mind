import { useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Moon, Sun, UserRound } from "lucide-react";

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

import LogoutButton from "@/components/common/LogoutButton.jsx";

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
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: serverSettings } = useGetNotificationSettingsQuery();
  const [updateNotificationSettings] = useUpdateNotificationSettingsMutation();
  const {
    theme,
    isLoading: isThemeLoading,
    isSaving: isThemeSaving,
    error: themeError,
    updateTheme,
  } = useSettings();

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
            >
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={`${user?.name || "User"}'s avatar`}
                      loading="lazy"
                      decoding="async"
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
          </div>
        </Card>

        {/* Theme Settings Card */}
        <Card className="p-5 sm:p-6">
          <div className="space-y-6">
            <ProfileSection
              title="Appearance"
              description="Customize your interface theme."
            >
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  variant={theme === "light" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleThemeChange("light")}
                  disabled={isThemeSaving || isThemeLoading}
                  className="gap-2"
                >
                  <Sun size={16} aria-hidden="true" />
                  Light
                </Button>
                <Button
                  type="button"
                  variant={theme === "dark" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleThemeChange("dark")}
                  disabled={isThemeSaving || isThemeLoading}
                  className="gap-2"
                >
                  <Moon size={16} aria-hidden="true" />
                  Dark
                </Button>
              </div>
              {themeError && (
                <p className="mt-2 text-xs font-medium text-destructive">
                  {themeError}
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
              {/* Simply drop the component here */}
              <LogoutButton />
            </div>
          </ProfileSection>
        </Card>
      </div>
    </div>
  );
}
