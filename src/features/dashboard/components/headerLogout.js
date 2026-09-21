import { routes } from "@/routes/paths.js";

export async function logoutFromHeader(logout, navigate) {
  await logout();
  navigate(routes.auth.login, { replace: true });
}
