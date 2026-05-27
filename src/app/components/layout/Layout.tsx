import { motion, AnimatePresence } from "motion/react";
import { Outlet } from "react-router";
import { Navbar } from "../Navbar";
import { Footer } from "../Footer";
import { LoadingScreen } from "../LoadingScreen";
import { useState, useEffect, useCallback, useRef } from "react";

export function Layout() {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const cursorGlowRef = useRef<HTMLDivElement>(null);

  // Track mouse via direct DOM manipulation — NO React re-renders
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (cursorGlowRef.current) {
        cursorGlowRef.current.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(220,38,38,0.015), transparent 50%)`;
      }
    };
    window.addEventListener("mousemove", handleMouse, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  // Prevent scrolling during loading
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoading]);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
    // Small delay so the loader exit animation plays first, then content reveals
    setTimeout(() => setShowContent(true), 100);
  }, []);

  return (
    <div
      className="relative min-h-screen bg-surface overflow-x-hidden"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      {/* Loading screen */}
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      {/* Global subtle cursor glow — updated via ref, no re-renders */}
      <div
        ref={cursorGlowRef}
        className="fixed inset-0 pointer-events-none z-[9999]"
        style={{
          background: `radial-gradient(600px circle at 50% 50%, rgba(220,38,38,0.015), transparent 50%)`,
        }}
      />

      {/* ═══ SITE CONTENT with staggered entrance ═══ */}

      {/* Navbar — slides down from top */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      >
        <Navbar />
      </motion.div>

      {/* Main content — pt-20 = header height so hero fits in one viewport below header */}
      <motion.main
        className="relative pt-20"
        initial={{ opacity: 0, y: 40 }}
        animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
      >
        <Outlet />
      </motion.main>

      {/* Footer — fades in last */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={showContent ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
      >
        <Footer />
      </motion.div>

      {/* Red accent line that sweeps across on reveal */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            className="fixed top-0 left-0 right-0 h-[2px] z-[10000] pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent, #DC2626, transparent)",
            }}
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{ scaleX: 1, opacity: 0 }}
            transition={{
              scaleX: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 1.2, delay: 0.6, ease: "easeOut" },
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}