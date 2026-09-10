export async function logoutFromHeader(logout, navigate) {
  await logout();
  navigate("/", { replace: true });
}
