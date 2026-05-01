"use client";

import { FadeIn } from "@/components/motion/fade-in";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "We've been with SSGPharma for 3 years now. When a patient is on the bed and we're out of stock, they actually answer. Not many suppliers can say that.",
    author: "Dr. Rajesh Kumar",
    role: "Head of Pharmacy, Metro Hospital Delhi",
    rating: 5,
  },
  {
    quote: "Their oncology desk understands formularies better than most distributors. Lead times are realistic and they flag delays early.",
    author: "Priya Sharma",
    role: "Procurement, Apollo Clinics",
    rating: 5,
  },
  {
    quote: "Went from 4 suppliers to SSGPharma for 70% of our cold-chain needs. The documentation is audit-ready and their team is responsive.",
    author: "Arun Gupta",
    role: "Supply Chain, Regional Pharmacy Chain",
    rating: 5,
  },
  {
    quote: "Specialty medicines are hard to source. SSGPharma got us a molecule we'd been chasing for 2 months in 48 hours. Worth every call.",
    author: "Dr. Neha Patel",
    role: "Clinical Director, Nephrology Center",
    rating: 5,
  },
  {
    quote: "They do not overpromise. If a line is delayed, we know early enough to plan substitutions and keep our consultants informed.",
    author: "Sanjay Menon",
    role: "Purchase Manager, City Care Hospital",
    rating: 5,
  },
  {
    quote: "The biggest difference is follow-through. Batch details, invoices, dispatch status — their team keeps the procurement loop tidy.",
    author: "Farah Khan",
    role: "Operations Lead, Multi-specialty Clinic Network",
    rating: 5,
  },
];

const carouselTestimonials = [...testimonials, ...testimonials];

export function TestimonialsSection() {
  return (
    <section className="w-full py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <FadeIn className="mb-12">
          <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-foreground md:text-4xl">
            Why hospitals choose us
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            Direct feedback from the people who rely on us every day.
          </p>
        </FadeIn>

        <div className="testimonial-carousel relative -mx-4 overflow-hidden px-4 md:-mx-8 md:px-8">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-background to-transparent md:w-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-background to-transparent md:w-20" />

          <div className="testimonial-track flex w-max gap-5 py-1">
            {carouselTestimonials.map((testimonial, i) => (
              <article
                key={`${testimonial.author}-${i}`}
                aria-hidden={i >= testimonials.length}
                className="testimonial-card group flex min-h-[280px] w-[min(82vw,360px)] shrink-0 flex-col rounded-2xl border border-border/80 bg-card/50 p-6 transition-all hover:border-border hover:bg-card hover:shadow-md focus-within:border-border focus-within:bg-card focus-within:shadow-md md:w-[420px] md:p-7"
              >
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <Star key={j} className="size-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="leading-relaxed text-foreground">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="mt-auto border-t border-border/40 pt-4">
                  <p className="font-medium text-foreground">{testimonial.author}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <style>
        {`
          .testimonial-track {
            animation: testimonial-scroll 42s linear infinite;
          }

          .testimonial-carousel:hover .testimonial-track,
          .testimonial-carousel:focus-within .testimonial-track {
            animation-play-state: paused;
          }

          @keyframes testimonial-scroll {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(calc(-50% - 0.625rem));
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .testimonial-track {
              animation: none;
              flex-wrap: wrap;
              width: 100%;
            }
          }
        `}
      </style>
    </section>
  );
}
