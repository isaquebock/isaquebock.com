"use client";

import { useEffect, useState } from "react";
import { ArrowUpIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useI18n } from "@/lib/locale-client";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const { dict } = useI18n();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          data-cuelume-tap=""
          type="button"
          aria-label={dict.scrollTop}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="group fixed bottom-4 sm:bottom-8 right-4 sm:right-8 z-50 rounded-full border border-border p-[2px] bg-background shadow-lg cursor-pointer"
        >
          <span className="flex items-center justify-center p-1.5 rounded-full bg-primary group-hover:bg-primary-hover text-primary-foreground transition-colors duration-300">
            <ArrowUpIcon className="size-4" />
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
