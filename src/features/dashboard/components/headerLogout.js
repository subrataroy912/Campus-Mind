import { routes } from "@/routes/paths.js";

export async function logoutFromHeader(logout, navigate) {
  try {
    await logout();
  } catch {
    // Best-effort logout cleanup
  } finally {
    navigate(routes.auth.login, { replace: true });
  }
}
