import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, LogOut, Monitor, Moon, Sun, UserRound } from "lucide-react";

import { useAuth } from "@/context/AuthContext.jsx";
import { routes } from "@/routes/paths.js";
import { Card } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Switch } from "@/components/ui/switch.jsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.jsx";
import ProfileSection from "@/features/profile/components/ProfileSection.jsx";
import { useSettings } from "../hooks/useSettings.js";
import {
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
} from "@/features/notifications/api/notificationsApi.js";
import { initials } from "@/utils/initials.js";
import { toast } from "@/components/ui/toast.jsx";
import { parseApiError } from "@/lib/errorUtils.js";

function SettingRow({ title, description, checked, onChange }) {
  return (
    <label className="flex items-center justify-between gap-4 py-2 first:pt-0 last:pb-0 cursor-pointer">
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-medium text-text-heading">
          {title}
        </span>
        <span className="mt-0.5 block text-[11px] text-text-muted">
          {description}
        </span>
      </span>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        className="shrink-0 scale-90"
      />
    </label>
  );
}

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
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
    } catch (err) {
      toast.add({
        title: "Setting update failed",
        description: parseApiError(err, "Unable to save notification preference.").message,
        type: "error",
      });
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate(routes.auth.login, { replace: true });
    } catch (err) {
      toast.add({
        title: "Logout failed",
        description: parseApiError(err, "Failed to sign out cleanly.").message,
        type: "error",
      });
      setShowLogoutConfirm(false);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleThemeChange = async (nextTheme) => {
    try {
      await updateTheme(nextTheme);
    } catch {
      // The hook exposes the save error for the page to render.
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-3 sm:p-4 space-y-3.5">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="h-7 gap-1.5 text-xs text-text-muted hover:text-text-heading -ml-1.5 px-2"
        >
          <ArrowLeft size={14} /> Back
        </Button>
      </div>

      <header className="space-y-0.5">
        <h1 className="text-base font-semibold tracking-tight text-text-heading">
          Settings
        </h1>
        <p className="text-xs text-text-muted">
          Manage your profile, appearance, notifications, and account credentials.
        </p>
      </header>

      <div className="space-y-3">
        <Card className="rounded-lg border border-border/80 bg-surface p-3.5 sm:p-4 shadow-xs">
          <div className="space-y-4">
            <ProfileSection
              title="Profile"
              description="This is how you appear across CampusMind."
              action={
                <Button variant="outline" size="sm" to={routes.profile.root} className="h-7 px-2.5 text-xs">
                  Edit profile
                </Button>
              }
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-primary text-xs font-bold text-primary-foreground">
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
                      <UserRound size={18} aria-hidden="true" />
                    )
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-text-heading">
                    {user?.name || "CampusMind member"}
                  </p>
                  <p className="truncate text-[11px] text-text-muted">
                    {user?.email || "no email on file"}
                  </p>
                </div>
              </div>
            </ProfileSection>

            <ProfileSection
              title="Notifications"
              description="Choose what CampusMind should notify you about."
            >
              <div className="divide-y divide-border/60 rounded-md border border-border/70 px-3 py-1 bg-canvas/30">
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
        <Card className="rounded-lg border border-border/80 bg-surface p-3.5 sm:p-4 shadow-xs">
          <ProfileSection
            title="Appearance"
            description="Customize your interface theme."
          >
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant={theme === "light" ? "default" : "outline"}
                size="sm"
                onClick={() => handleThemeChange("light")}
                disabled={isThemeSaving || isThemeLoading}
                className="h-7 px-3 text-xs gap-1.5 font-medium"
              >
                <Sun size={13} aria-hidden="true" />
                Light
              </Button>
              <Button
                type="button"
                variant={theme === "dark" ? "default" : "outline"}
                size="sm"
                onClick={() => handleThemeChange("dark")}
                disabled={isThemeSaving || isThemeLoading}
                className="h-7 px-3 text-xs gap-1.5 font-medium"
              >
                <Moon size={13} aria-hidden="true" />
                Dark
              </Button>
              <Button
                type="button"
                variant={theme === "system" ? "default" : "outline"}
                size="sm"
                onClick={() => handleThemeChange("system")}
                disabled={isThemeSaving || isThemeLoading}
                className="h-7 px-3 text-xs gap-1.5 font-medium"
              >
                <Monitor size={13} aria-hidden="true" />
                System
              </Button>
            </div>
            {themeError && (
              <p className="mt-1.5 text-xs font-medium text-destructive">
                {themeError}
              </p>
            )}
            <p className="mt-2 text-[11px] text-text-muted">
              Theme preference is saved on this device.
            </p>
          </ProfileSection>
        </Card>

        <Card className="rounded-lg border border-border/80 bg-surface p-3.5 sm:p-4 shadow-xs">
          <ProfileSection
            title="Account actions"
            description="Sign out here, or on every device you've used."
          >
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLogoutConfirm(true)}
                className="h-7 px-3 text-xs gap-1.5 font-medium text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
              >
                <LogOut size={13} aria-hidden="true" />
                Log out
              </Button>
            </div>
          </ProfileSection>
        </Card>
      </div>

      {/* Confirmation Dialog for Logout */}
      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent className="max-w-md bg-surface p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-text-heading">
              Confirm Log Out
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-text-muted">
              Are you sure you want to log out of your CampusMind account? You will need your credentials to log back in.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="outline"
              size="sm"
              disabled={isLoggingOut}
              onClick={() => setShowLogoutConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={isLoggingOut}
              onClick={handleLogout}
            >
              {isLoggingOut ? "Logging out…" : "Yes, Log Out"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
