export function getAdminSessionSecret(): string {
  return (process.env.ADMIN_SESSION_SECRET ?? process.env.SESSION_SECRET ?? "").trim();
}

export function getBootstrapAdminPassword(): string {
  return (process.env.ADMIN_PASSWORD ?? "").trim();
}
