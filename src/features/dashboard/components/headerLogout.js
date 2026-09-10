export async function logoutFromHeader(logout, navigate) {
  await logout();
  navigate("/auth/login", { replace: true });
}
