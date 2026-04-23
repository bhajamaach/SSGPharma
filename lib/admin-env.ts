export function getAdminSessionSecret(): string {
  return (process.env.ADMIN_SESSION_SECRET ?? "").trim();
}
