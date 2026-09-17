import { useState } from "react";
import { useNavigate } from "react-router";
import { LogOut } from "lucide-react";

import { useAuth } from "@/context/AuthContext.jsx";
import { routes } from "@/routes/paths.js";
import { Button } from "@/components/ui/button.jsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.jsx";

export default function LogoutButton({
  variant = "outline",
  className = "",
  showIcon = true,
  label = "Log out",
}) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate(routes.auth.login, { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        onClick={() => setShowLogoutConfirm(true)}
        className={`gap-2 ${className}`}
      >
        {showIcon && <LogOut size={16} aria-hidden="true" />}
        {label && <span>{label}</span>}
      </Button>

      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent className="max-w-md bg-surface p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-text-heading">
              Confirm Log Out
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-text-muted">
              Are you sure you want to log out of your CampusMind account? You
              will need your credentials to log back in.
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
    </>
  );
}
