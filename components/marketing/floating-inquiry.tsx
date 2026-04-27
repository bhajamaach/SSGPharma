"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Phone, Mail } from "lucide-react";
import { formatMailtoHref, formatPhoneHref } from "@/lib/contact-config";

type FloatingInquiryProps = {
  primaryPhone: string;
  primaryEmail: string;
};

export function FloatingInquiry({ primaryPhone, primaryEmail }: FloatingInquiryProps) {
  const [open, setOpen] = useState(false);

  const actions = [
    {
      label: "Get a Quote",
      href: "/get-a-quote",
      icon: MessageCircle,
    },
    {
      label: "Call",
      href: formatPhoneHref(primaryPhone),
      icon: Phone,
    },
    {
      label: "Email",
      href: formatMailtoHref(primaryEmail),
      icon: Mail,
    },
  ];

  return (
    <>
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-40 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:shadow-xl active:scale-95 md:size-14"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-expanded={open}
        aria-label={open ? "Close contact menu" : "Open contact menu"}
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-20 right-6 z-40 w-56 rounded-xl border border-border bg-card/95 p-2 shadow-2xl backdrop-blur md:bottom-24 md:right-8"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="space-y-1">
              {actions.map((action) => {
                const Icon = action.icon;

                if (action.href.startsWith("/")) {
                  return (
                    <Link
                      key={action.label}
                      href={action.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:bg-muted"
                    >
                      <Icon className="size-4 text-primary" />
                      <span>{action.label}</span>
                    </Link>
                  );
                }

                return (
                  <a
                    key={action.label}
                    href={action.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:bg-muted"
                  >
                    <Icon className="size-4 text-primary" />
                    <span>{action.label}</span>
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
