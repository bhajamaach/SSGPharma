import type { Metadata } from "next";

// Keep admin out of search indexes — still use a strong password; security through obscurity is not enough.
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="admin-theme min-h-screen bg-[radial-gradient(circle_at_top,color-mix(in_oklch,var(--primary)_14%,transparent),transparent_32%),linear-gradient(180deg,color-mix(in_oklch,var(--background)_80%,white)_0%,var(--background)_100%)] text-foreground"
      suppressHydrationWarning
    >
      {children}
    </div>
  );
}
