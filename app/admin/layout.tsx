import type { Metadata } from "next";

// Keep admin out of search indexes — still use a strong password; security through obscurity is not enough.
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(13,115,119,0.10),transparent_30%),linear-gradient(180deg,#f7fbfb_0%,#f3f7f7_100%)] text-gray-900">
      {children}
    </div>
  );
}
