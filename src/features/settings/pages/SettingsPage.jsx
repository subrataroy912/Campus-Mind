import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { LogOut, Moon, Sun, UserRound } from "lucide-react";

import { useAuth } from "@/context/AuthContext.jsx";
import { Card } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Switch } from "@/components/ui/switch.jsx";
import ProfileSection from "@/features/profile/components/ProfileSection.jsx";
import { useSettings } from "../hooks/useSettings.js";
import { fetchSettings, updateSettings } from "../api/settingsService.js";
import { initials } from "@/utils/initials.js";
import { setNotifications, toggleNotification } from "../settingsSlice.js";

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
  const { user, logout } = useAuth();
  const { notifications } = useSelector((state) => state.settings);
  const dispatch = useDispatch();
  const {
    theme,
    isLoading: isThemeLoading,
    isSaving: isThemeSaving,
    error: themeError,
    updateTheme,
  } = useSettings();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    fetchSettings()
      .then((savedSettings) => {
        if (!active) return;
        dispatch(setNotifications(savedSettings.notifications));
      })
      .catch(() => {
        // leave defaults in place when settings cannot be loaded
      });

    return () => {
      active = false;
    };
  }, [dispatch]);

  const handleToggleNotification = async (key) => {
    const nextNotifications = {
      ...notifications,
      [key]: !notifications[key],
    };

    dispatch(toggleNotification(key));

    try {
      await updateSettings({ notifications: nextNotifications });
    } catch {
      dispatch(setNotifications(notifications));
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
