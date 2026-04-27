"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";
import { productDivisions, serviceLines } from "@/lib/divisions";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<null | "products" | "services">(null);
  const [desktopPanel, setDesktopPanel] = useState<null | "products" | "services">(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setMobilePanel(null);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open]);
  const closeMobileMenu = () => {
    setOpen(false);
    setMobilePanel(null);
  };

  return (
    <header ref={headerRef} className="sticky top-0 z-50 w-full border-b border-border bg-background/70 backdrop-blur-lg supports-backdrop-filter:bg-background/60 transition-all duration-300">
      <nav className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-4 px-4 py-3 md:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center">
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/tlogo.png"
              alt="SSG Pharma Logo"
              width={120}
              height={40}
              className="w-[120px] transition-opacity group-hover:opacity-80 dark:hidden"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/tlogo-white.png"
              alt="SSG Pharma Logo"
              width={120}
              height={40}
              className="hidden w-[120px] transition-opacity group-hover:opacity-80 dark:block"
            />
          </>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-0.5 lg:flex">
          <Link
            href="/"
            className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
          >
            Home
          </Link>
          <Link
            href="/about-us"
            className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
          >
            About
          </Link>

          {/* Products mega — hover reveals therapy divisions (same pattern as reference sites) */}
          <div
            className="relative"
            onMouseEnter={() => setDesktopPanel("products")}
            onMouseLeave={() => setDesktopPanel(null)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                setDesktopPanel(null);
              }
            }}
          >
            <div className="flex items-center rounded-md text-sm text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground">
              <Link href="/products" className="rounded-l-md px-3 py-2 transition-colors hover:text-foreground">
                Products
              </Link>
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={desktopPanel === "products"}
                aria-controls="desktop-products-menu"
                onClick={() => setDesktopPanel((current) => (current === "products" ? null : "products"))}
                onKeyDown={(event) => {
                  if (event.key === "Escape") setDesktopPanel(null);
                  if (event.key === "ArrowDown") setDesktopPanel("products");
                }}
                className="inline-flex h-8 w-8 items-center justify-center rounded-r-md transition-colors hover:bg-muted hover:text-foreground"
              >
                <ChevronDown className="size-3.5 opacity-60" aria-hidden />
              </button>
            </div>
            <div
              id="desktop-products-menu"
              role="menu"
              className={cn(
                "invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition-all duration-200",
                desktopPanel === "products" && "visible opacity-100",
              )}
            >
              <div className="w-[min(90vw,640px)] rounded-xl border-2 border-border bg-popover p-4 shadow-lg">
                <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
                  {productDivisions.map((d) => (
                    <Link
                      key={d.slug}
                      href={`/divisions/${d.slug}`}
                      className="rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted"
                    >
                      <span className="font-medium text-foreground">{d.title}</span>
                      <span className="mt-0.5 block text-xs leading-snug text-muted-foreground line-clamp-2">
                        {d.blurb}
                      </span>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/products"
                  className="mt-3 block border-t border-border pt-3 text-center text-sm font-medium text-primary hover:underline"
                >
                  View full catalog →
                </Link>
              </div>
            </div>
          </div>

          <div
            className="relative"
            onMouseEnter={() => setDesktopPanel("services")}
            onMouseLeave={() => setDesktopPanel(null)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                setDesktopPanel(null);
              }
            }}
          >
            <div className="flex items-center rounded-md text-sm text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground">
              <Link href="/services" className="rounded-l-md px-3 py-2 transition-colors hover:text-foreground">
                Services
              </Link>
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={desktopPanel === "services"}
                aria-controls="desktop-services-menu"
                onClick={() => setDesktopPanel((current) => (current === "services" ? null : "services"))}
                onKeyDown={(event) => {
                  if (event.key === "Escape") setDesktopPanel(null);
                  if (event.key === "ArrowDown") setDesktopPanel("services");
                }}
                className="inline-flex h-8 w-8 items-center justify-center rounded-r-md transition-colors hover:bg-muted hover:text-foreground"
              >
                <ChevronDown className="size-3.5 opacity-60" aria-hidden />
              </button>
            </div>
            <div
              id="desktop-services-menu"
              role="menu"
              className={cn(
                "invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition-all duration-200",
                desktopPanel === "services" && "visible opacity-100",
              )}
            >
              <div className="w-[min(90vw,400px)] rounded-xl border-2 border-border bg-popover p-3 shadow-lg">
                {serviceLines.map((s) => (
                  <Link
                    key={s.slug}
                    href={s.href}
                    className="block rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted"
                  >
                    <span className="font-medium text-foreground">{s.title}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{s.blurb}</span>
                  </Link>
                ))}
                <Link
                  href="/services"
                  className="mt-2 block border-t border-border pt-2 text-center text-xs font-medium text-primary hover:underline"
                >
                  Services overview
                </Link>
              </div>
            </div>
          </div>

          <Link
            href="/molecules"
            className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
          >
            Molecules
          </Link>
          <Link
            href="/patient-assistance-programs"
            className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
          >
            Assistance
          </Link>

          <Link className={cn(buttonVariants(), "ml-2")} href="/contact-us">
            Contact
          </Link>
          <Link className={cn(buttonVariants({ variant: "outline" }), "ml-1")} href="/get-a-quote">
            Quote
          </Link>
          <div className="ml-2 border-l border-border pl-2">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-md border border-border bg-background text-foreground shadow-xs"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => {
              setOpen((v) => !v);
              setMobilePanel(null);
            }}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="border-b border-border bg-background lg:hidden"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={reduce ? undefined : { height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-col gap-1 px-4 pb-5 pt-1">
              <Link href="/" className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-muted" onClick={closeMobileMenu}>
                Home
              </Link>
              <Link href="/about-us" className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-muted" onClick={closeMobileMenu}>
                About
              </Link>

              <div className="rounded-lg transition-colors hover:bg-muted focus-within:bg-muted">
                <div className="flex items-center">
                  <Link href="/products" className="flex-1 px-3 py-3 text-sm font-medium" onClick={closeMobileMenu}>
                    Products
                  </Link>
                  <button
                    type="button"
                    aria-expanded={mobilePanel === "products"}
                    aria-controls="mobile-products-menu"
                    className="mr-1 inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
                    onClick={() => setMobilePanel((p) => (p === "products" ? null : "products"))}
                  >
                    <ChevronDown className={cn("size-4 transition-transform", mobilePanel === "products" && "rotate-180")} />
                  </button>
                </div>
              </div>
              {mobilePanel === "products" && (
                <div id="mobile-products-menu" className="ml-2 flex flex-col border-l border-border pl-3">
                  {productDivisions.map((d) => (
                    <Link
                      key={d.slug}
                      href={`/divisions/${d.slug}`}
                      className="py-2 text-sm text-muted-foreground hover:text-foreground"
                      onClick={closeMobileMenu}
                    >
                      {d.title}
                    </Link>
                  ))}
                  <Link href="/products" className="py-2 text-sm font-medium text-primary" onClick={closeMobileMenu}>
                    All products →
                  </Link>
                </div>
              )}

              <div className="rounded-lg transition-colors hover:bg-muted focus-within:bg-muted">
                <div className="flex items-center">
                  <Link href="/services" className="flex-1 px-3 py-3 text-sm font-medium" onClick={closeMobileMenu}>
                    Services
                  </Link>
                  <button
                    type="button"
                    aria-expanded={mobilePanel === "services"}
                    aria-controls="mobile-services-menu"
                    className="mr-1 inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
                    onClick={() => setMobilePanel((p) => (p === "services" ? null : "services"))}
                  >
                    <ChevronDown className={cn("size-4 transition-transform", mobilePanel === "services" && "rotate-180")} />
                  </button>
                </div>
              </div>
              {mobilePanel === "services" && (
                <div id="mobile-services-menu" className="ml-2 flex flex-col border-l border-border pl-3">
                  {serviceLines.map((s) => (
                    <Link
                      key={s.slug}
                      href={s.href}
                      className="py-2 text-sm text-muted-foreground hover:text-foreground"
                      onClick={closeMobileMenu}
                    >
                      {s.title}
                    </Link>
                  ))}
                  <Link href="/services" className="py-2 text-sm font-medium text-primary" onClick={closeMobileMenu}>
                    Overview →
                  </Link>
                </div>
              )}

              <Link href="/molecules" className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-muted" onClick={closeMobileMenu}>
                Molecules
              </Link>
              <Link
                href="/patient-assistance-programs"
                className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-muted"
                onClick={closeMobileMenu}
              >
                Assistance
              </Link>

              <Link className={cn(buttonVariants(), "mt-2 justify-center")} href="/contact-us" onClick={closeMobileMenu}>
                Contact
              </Link>
              <Link
                className={cn(buttonVariants({ variant: "outline" }), "justify-center")}
                href="/get-a-quote"
                onClick={closeMobileMenu}
              >
                Request quote
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
