"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const reduce = useReducedMotion();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "same-origin",
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(
          j?.error ??
            (res.status === 500
              ? "Server error — check ADMIN_SESSION_SECRET or SESSION_SECRET (32+ chars) and restart dev server"
              : "Could not sign in"),
        );
        setLoading(false);
        return;
      }
      setPassword("");
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Network error — try again");
    }
    setLoading(false);
  }

  return (
    <motion.div
      className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-8 sm:px-6 lg:px-8"
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="grid w-full gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="hidden rounded-[2rem] border border-[#0D7377]/15 bg-gradient-to-br from-[#0D7377] via-[#0d6a6e] to-[#0a4f52] p-8 text-white shadow-2xl shadow-[#0D7377]/12 lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/90">
              <ShieldCheck className="h-3.5 w-3.5" />
              Admin Console
            </div>
            <h1 className="mt-6 max-w-md font-[family-name:var(--font-display)] text-5xl leading-[1.02] tracking-tight">
              Calm control for the catalog, contacts, and day-to-day updates.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-white/78">
              Sign in to manage products, molecule pages, contact details, and the admin password in one place.
            </p>
          </div>

          <div className="grid gap-3 text-sm text-white/78">
            <div className="rounded-2xl border border-white/14 bg-white/8 p-4 backdrop-blur">
              <p className="font-medium text-white">Premium, mobile-aware admin</p>
              <p className="mt-1">The dashboard is tuned for quick edits, cleaner lists, and smaller screens.</p>
            </div>
            <div className="rounded-2xl border border-white/14 bg-white/8 p-4 backdrop-blur">
              <p className="font-medium text-white">Bootstrap-safe local access</p>
              <p className="mt-1">After a fresh local reset, the temporary env password can mint the first admin account automatically.</p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-zinc-200 bg-white/92 p-6 shadow-xl shadow-[#0D7377]/8 backdrop-blur sm:p-8 md:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#0D7377]/15 bg-[#0D7377]/6 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0D7377]">
            <Sparkles className="h-3.5 w-3.5" />
            Secure Sign-In
          </div>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950 md:text-4xl">Welcome back</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-600">
            This area is private. Keep <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-800">ADMIN_SESSION_SECRET</code> private.
            {" "}Legacy <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-800">SESSION_SECRET</code> still works if you are on the older env setup.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="admin-pass" className="text-zinc-800">
                Password
              </Label>
              <Input
                id="admin-pass"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 border-zinc-300 bg-white text-zinc-950 placeholder:text-zinc-400 focus-visible:border-[#0D7377]/70 focus-visible:ring-[#0D7377]/15"
                required
              />
            </div>
            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">{error}</p>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="h-12 w-full bg-[#0D7377] text-white hover:bg-[#0b6669] disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Enter dashboard"}
            </Button>
          </form>

          <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50/90 p-4 text-sm text-zinc-600">
            After a fresh local database reset, sign in with the temporary password from your <code className="rounded bg-white px-1.5 py-0.5 text-xs text-zinc-800">ADMIN_PASSWORD</code> env value once.
          </div>
        </div>
      </div>
    </motion.div>
  );
}
