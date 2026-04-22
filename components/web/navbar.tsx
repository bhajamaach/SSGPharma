import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { productDivisions, serviceLines } from "@/lib/divisions";
import { cn } from "@/lib/utils";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-lg supports-[backdrop-filter]:bg-background/75">
      <nav className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-4 px-4 py-3 md:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center">
          <Image
            src="/tlogo.png"
            alt="SSG Pharma Logo"
            width={120}
            height={40}
            priority
            style={{ height: "auto", width: "auto" }}
            className="transition-opacity group-hover:opacity-80"
          />
        </Link>

        <div className="hidden items-center gap-0.5 lg:flex">
          <Link href="/" className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground">
            Home
          </Link>
          <Link href="/about-us" className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground">
            About
          </Link>

          <div className="group/products relative">
            <div className="flex cursor-default items-center gap-0.5 rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground">
              <Link href="/products" className="px-1">
                Products
              </Link>
              <ChevronDown className="size-3.5 opacity-60" aria-hidden />
            </div>
            <div className="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition-all duration-200 group-hover/products:visible group-hover/products:opacity-100">
              <div className="w-[min(90vw,640px)] rounded-xl border-2 border-border bg-popover p-4 shadow-lg">
                <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
                  {productDivisions.map((division) => (
                    <Link
                      key={division.slug}
                      href={`/divisions/${division.slug}`}
                      className="rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted"
                    >
                      <span className="font-medium text-foreground">{division.title}</span>
                      <span className="mt-0.5 block text-xs leading-snug text-muted-foreground line-clamp-2">
                        {division.blurb}
                      </span>
                    </Link>
                  ))}
                </div>
                <Link href="/products" className="mt-3 block border-t border-border pt-3 text-center text-sm font-medium text-primary hover:underline">
                  View full catalog →
                </Link>
              </div>
            </div>
          </div>

          <div className="group/services relative">
            <div className="flex cursor-default items-center gap-0.5 rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground">
              <Link href="/services" className="px-1">
                Services
              </Link>
              <ChevronDown className="size-3.5 opacity-60" aria-hidden />
            </div>
            <div className="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition-all duration-200 group-hover/services:visible group-hover/services:opacity-100">
              <div className="w-[min(90vw,400px)] rounded-xl border-2 border-border bg-popover p-3 shadow-lg">
                {serviceLines.map((service) => (
                  <Link
                    key={service.slug}
                    href={service.href}
                    className="block rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted"
                  >
                    <span className="font-medium text-foreground">{service.title}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{service.blurb}</span>
                  </Link>
                ))}
                <Link href="/services" className="mt-2 block border-t border-border pt-2 text-center text-xs font-medium text-primary hover:underline">
                  Services overview
                </Link>
              </div>
            </div>
          </div>

          <Link href="/molecules" className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground">
            Molecules
          </Link>
          <Link href="/patient-assistance-programs" className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground">
            Assistance
          </Link>

          <Link className={cn(buttonVariants(), "ml-2")} href="/contact-us">
            Contact
          </Link>
          <Link className={cn(buttonVariants({ variant: "outline" }), "ml-1")} href="/get-a-quote">
            Quote
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Link className={cn(buttonVariants({ size: "sm" }))} href="/contact-us">
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
}
