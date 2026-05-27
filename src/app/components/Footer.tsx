import { motion } from "motion/react";
import {
  ArrowUpRight,
  Facebook,
  Instagram,
  Linkedin,
  Music2,
  Youtube,
} from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import logo from "../assets/logo.png";
import { useTheme } from "../context/ThemeContext";

export function Footer() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { theme } = useTheme();

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socialLinks = [
    {
      label: "Facebook",
      href: "https://www.facebook.com/profile.php?id=61587796043471",
      Icon: Facebook,
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/sonichive_acoustics/",
      Icon: Instagram,
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/112030752/",
      Icon: Linkedin,
    },
    {
      label: "TikTok",
      href: "https://www.tiktok.com/@sonichiveacoustic",
      Icon: Music2,
    },
    {
      label: "YouTube",
      href: "https://www.youtube.com/@SonichiveAcoustics",
      Icon: Youtube,
    },
  ] as const;

  return (
    <footer className="relative bg-muted dark:bg-surface overflow-hidden" onMouseMove={handleMouseMove}>
      {/* Cursor-following glow */}
      <div
        className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-1000 hidden dark:block"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, rgba(var(--accent-rgb),0.03), transparent 50%)`,
        }}
      />

      {/* Animated background grid */}
      <div
        className="absolute inset-0 pointer-events-none z-0 hidden dark:block"
        style={{
          backgroundImage:
            "linear-gradient(rgba(var(--accent-rgb),0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-rgb),0.015) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Ambient glow */}
      <motion.div
        className="absolute bottom-[20%] left-[20%] w-[400px] h-[400px] bg-[#DC2626]/[0.015] rounded-full blur-[200px] pointer-events-none hidden dark:block"
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
      />

      {/* Large decorative text */}
      <div className="border-t border-on-surface/[0.04]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 md:py-24">
          {/* Top row: large brand text + back to top */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12 mb-20 md:mb-28">
            <div>
              <Link to="/" className="flex items-center gap-3 mb-6 group">
                <img
                  src={logo}
                  alt="Sonic Hive Acoustics"
                  className={`h-[54px] w-auto object-contain group-hover:opacity-90 transition-all duration-300 ${
                    theme === "dark" ? "[filter:brightness(2.2)_contrast(1.05)]" : "[filter:brightness(0.2)_contrast(1.2)]"
                  }`}
                />
              </Link>
              <p
                className="text-on-surface/75 dark:text-on-surface/55 text-[14px] leading-[1.8] max-w-[320px]"
                style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
              >
                Engineering silence, perfecting sound since 2008. Premium
                acoustic solutions for every environment.
              </p>
            </div>

            {/* Back to top */}
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center gap-3 cursor-pointer"
            >
              <span
                className="text-on-surface/70 dark:text-on-surface/50 text-[11px] tracking-[0.2em] uppercase group-hover:text-on-surface/90 dark:group-hover:text-on-surface/75 transition-colors duration-300"
                style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
              >
                Back to top
              </span>
              <div className="w-10 h-10 rounded-full border border-on-surface/10 flex items-center justify-center group-hover:border-[#DC2626]/40 group-hover:bg-[#DC2626]/5 transition-all duration-300">
                <ArrowUpRight
                  className="w-4 h-4 text-on-surface/70 dark:text-on-surface/45 group-hover:text-[#DC2626] transition-colors duration-300 -rotate-45"
                />
              </div>
            </motion.button>
          </div>

          {/* Links grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16 mb-20">
            {/* Navigate */}
            <div>
              <h4
                className="text-on-surface/70 dark:text-on-surface/45 text-[10px] tracking-[0.25em] uppercase mb-6"
                style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--font-weight-heading)" }}
              >
                Navigate
              </h4>
              <div className="flex flex-col gap-3">
                {[
                  { label: "About", to: "/about" },
                  { label: "Industries", to: "/industries" },
                  { label: "Why Us", to: "/why" },
                  { label: "Contact", to: "/contact" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="text-on-surface/80 dark:text-on-surface/60 hover:text-on-surface transition-colors text-left text-[13px] hover:translate-x-1 transition-transform duration-300"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 400,
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Products */}
            <div>
              <h4
                className="text-on-surface/70 dark:text-on-surface/45 text-[10px] tracking-[0.25em] uppercase mb-6"
                style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--font-weight-heading)" }}
              >
                Products
              </h4>
              <div className="flex flex-col gap-3">
                {[
                  { label: "EQ Series Panels", to: "/products/portable-acoustics" },
                  { label: "AQ Smart Module", to: "/products/portable-acoustics" },
                  { label: "QRD Diffuser", to: "/products/portable-acoustics" },
                  { label: "Soundproof Door", to: "/products/soundproof-door" },
                ].map((p) => (
                  <Link
                    key={p.label}
                    to={p.to}
                    className="text-on-surface/80 dark:text-on-surface/60 hover:text-on-surface transition-all text-left text-[13px] hover:translate-x-1 duration-300"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 400,
                    }}
                  >
                    {p.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4
                className="text-on-surface/70 dark:text-on-surface/45 text-[10px] tracking-[0.25em] uppercase mb-6"
                style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--font-weight-heading)" }}
              >
                Contact
              </h4>
              <div
                className="flex flex-col gap-3 text-on-surface/80 dark:text-on-surface/60 text-[13px] leading-relaxed"
                style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
              >
                <span>
                  Sonic Hive Furniture Trading, Ground Floor, Al Wasl Building,
                  Next to Dubai Mall / Burj Khalifa Metro Station, Exit 2,
                  Sheikh Zayed Road, Dubai, United Arab Emirates
                </span>
                <a
                  href="mailto:info@thesonichive.com"
                  className="hover:text-on-surface transition-colors w-fit"
                >
                  info@thesonichive.com
                </a>
                <a
                  href="tel:+971585550099"
                  className="hover:text-on-surface transition-colors w-fit"
                >
                  +971585550099
                </a>
              </div>
            </div>

            {/* Socials */}
            <div>
              <h4
                className="text-on-surface/70 dark:text-on-surface/45 text-[10px] tracking-[0.25em] uppercase mb-6"
                style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--font-weight-heading)" }}
              >
                Follow
              </h4>
              <div className="flex flex-col gap-3">
                {socialLinks.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 text-on-surface/80 dark:text-on-surface/60 hover:text-on-surface transition-all text-[13px] hover:translate-x-1 duration-300 w-fit"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 400,
                    }}
                  >
                    <Icon className="w-4 h-4 shrink-0 opacity-80" aria-hidden />
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-on-surface/[0.04] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span
              className="text-on-surface/70 dark:text-on-surface/45 text-[12px]"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
            >
              &copy; 2026 Sonic Hive Acoustics. All rights reserved.
            </span>
            <div className="flex items-center gap-6">
              {["Privacy Policy", "Terms of Service", "Cookies"].map(
                (link) => (
                  <button
                    key={link}
                    className="text-on-surface/70 dark:text-on-surface/45 hover:text-on-surface/95 dark:hover:text-on-surface/80 transition-colors text-[12px] cursor-pointer"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 400,
                    }}
                  >
                    {link}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}