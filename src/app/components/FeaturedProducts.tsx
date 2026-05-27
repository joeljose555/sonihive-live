import React, { useRef, useState, useCallback, useEffect, memo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView as useMotionInView,
} from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowUpRight, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { productCategories } from "../data/productCategories";

import Asset14 from '../assets/asset_14.jpg';

/* ───── Flagship categories (home) ───── */
const FLAGSHIP_SLUGS = [
  "soundproof-door",
  "engineering-acoustics",
  "portable-acoustics",
] as const;

const flagshipDetails: Record<
  (typeof FLAGSHIP_SLUGS)[number],
  {
    category: string;
    headline: string;
    desc: string;
    stat: string;
    statLabel: string;
    specs: { label: string; value: string }[];
  }
> = {
  "soundproof-door": {
    category: "The Entryway",
    headline: "The threshold of absolute privacy.",
    desc: "Engineered with patented magnetic sealing and a fire-rated core. G-Series doors deliver up to 43dB isolation—consumer, commercial, and engineering series for every build.",
    stat: "STC 40+",
    statLabel: "43dB reduction",
    specs: [
      { label: "Rating", value: "STC 40+ / 43dB reduction" },
      { label: "Seal", value: "4-side magnetic compression" },
      { label: "Fire", value: "30-min certified smoke protection" },
    ],
  },
  "engineering-acoustics": {
    category: "Heavy-duty infrastructure",
    headline: "Mass-loaded silence for structures.",
    desc: "Soundproofing panels, insulation felt, damping coatings, and floor systems—lab-tested barriers and vibration control for walls, machine rooms, and critical assemblies.",
    stat: "STC 28+",
    statLabel: "Single 3mm layer",
    specs: [
      { label: "Barrier", value: "STC 28+ (3mm layer)" },
      { label: "Material", value: "Non-toxic polymer core" },
      { label: "Use", value: "Walls, enclosures, engine rooms" },
    ],
  },
  "portable-acoustics": {
    category: "Mobile & modular",
    headline: "Professional treatment on the move.",
    desc: "From EQ and AQ modules to QRD diffusers and acoustic art—portable, modular solutions for studios, offices, and creative spaces that demand flexibility without sacrificing performance.",
    stat: "NRC 0.90",
    statLabel: "Broadband absorption",
    specs: [
      { label: "Formats", value: "Panels, diffusers, smart modules" },
      { label: "Fire", value: "Class A / B1 options" },
      { label: "Install", value: "Tool-free & modular systems" },
    ],
  },
};

const products = FLAGSHIP_SLUGS.map((slug, i) => {
  const cat = productCategories.find((c) => c.slug === slug);
  if (!cat) throw new Error(`Missing product category: ${slug}`);
  const d = flagshipDetails[slug];
  return {
    name: cat.name,
    categorySlug: cat.slug,
    category: d.category,
    headline: d.headline,
    desc: d.desc,
    year: cat.year,
    tag: String(i + 1).padStart(2, "0"),
    stat: d.stat,
    statLabel: d.statLabel,
    specs: d.specs,
    image: cat.image,
  };
});

/* ── Animated counter ── */
function AnimatedStat({
  value,
  inView,
}: {
  value: string;
  inView: boolean;
}) {
  const numericPart = value.replace(/[^0-9.]/g, "");
  const prefix = value.match(/^[^0-9]*/)?.[0] || "";
  const suffix = value.replace(numericPart, "").replace(prefix, "");
  const target = parseFloat(numericPart) || 0;
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let startTime: number | null = null;
    const duration = 1600;
    let animId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // easeOutQuart
      const ease = 1 - Math.pow(1 - progress, 4);
      const currentVal = target * ease;
      setCount(target < 10 ? parseFloat(currentVal.toFixed(2)) : Math.floor(currentVal));

      if (progress < 1) {
        animId = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [inView, target]);

  return (
    <span>
      {prefix}
      {target < 10 ? count : count.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ── Single product row (alternating layout) ── */
const ProductRow = memo(function ProductRow({
  product,
  index,
  reversed,
}: {
  product: (typeof products)[0];
  index: number;
  reversed: boolean;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const isInView = useMotionInView(rowRef, { once: true, margin: "-30px" });
  const [isHovered, setIsHovered] = useState(false);
  const mousePosRef = useRef({ x: 50, y: 50 });
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  const mouseRafRef = useRef<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ["start end", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], [-16, 16]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    mousePosRef.current = { x, y };

    if (mouseRafRef.current != null) return;

    mouseRafRef.current = window.requestAnimationFrame(() => {
      mouseRafRef.current = null;
      const { x: mx, y: my } = mousePosRef.current;
      if (cursorGlowRef.current) {
        cursorGlowRef.current.style.background = `radial-gradient(520px circle at ${mx}% ${my}%, rgba(var(--accent-rgb),0.12), transparent 52%)`;
      }
    });
  }, []);

  return (
    <motion.div
      ref={rowRef}
      initial={{ opacity: 0, y: 72 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <div
        className={`grid lg:grid-cols-2 gap-6 lg:gap-0 items-stretch ${reversed ? "lg:[direction:rtl]" : ""
          }`}
      >
        {/* ── Image side ── */}
        <div
          className="relative overflow-hidden group cursor-pointer rounded-2xl lg:rounded-none lg:[direction:ltr]"
          style={{ minHeight: "480px" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            mousePosRef.current = { x: 50, y: 50 };
          }}
          onMouseMove={handleMouseMove}
        >
          {/* Parallax image */}
          <motion.div
            className="absolute inset-[-8%]"
            style={{ y: imgY, willChange: "transform" }}
          >
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-[1000ms]"
              style={{
                filter: isHovered
                  ? "brightness(0.85) saturate(1.15) contrast(1.05)"
                  : "brightness(0.65) saturate(0.95)",
              }}
            />
          </motion.div>

          {/* Cursor-following glow */}
          <div
            ref={cursorGlowRef}
            className="absolute inset-0 pointer-events-none z-[2] transition-opacity duration-600 hidden dark:block"
            style={{
              background: `radial-gradient(600px circle at 50% 50%, rgba(var(--accent-rgb),0.14), transparent 50%)`,
              opacity: isHovered ? 1 : 0,
            }}
          />

          {/* Shine sweep */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-[3]"
            style={{
              background:
                "linear-gradient(105deg, transparent 40%, rgba(var(--on-surface-rgb),0.03) 45%, rgba(var(--on-surface-rgb),0.07) 50%, rgba(var(--on-surface-rgb),0.03) 55%, transparent 60%)",
              backgroundSize: "200% 100%",
            }}
            animate={{
              backgroundPosition: isHovered ? ["200% 0", "-200% 0"] : "200% 0",
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />

          {/* Overlays */}
          <div className="absolute inset-0 dark:bg-gradient-to-t dark:from-surface/70 dark:via-transparent dark:to-surface/20 z-[1]" />
          <div
            className={`absolute inset-0 z-[1] ${reversed
              ? "dark:bg-gradient-to-l dark:from-surface/50 dark:to-transparent"
              : "dark:bg-gradient-to-r dark:from-surface/50 dark:to-transparent"
              }`}
          />

          {/* Large background number (parallax) */}
          <span
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 leading-none select-none pointer-events-none z-[1] hidden dark:block"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: "var(--font-weight-display)",
              fontSize: "clamp(120px, 18vw, 260px)",
              color: isHovered
                ? "rgba(var(--accent-rgb),0.06)"
                : "rgba(var(--on-surface-rgb),0.02)",
              transition: "color 0.8s ease",
            }}
          >
            {product.tag}
          </span>

          {/* Corner accents */}
          {[
            {
              pos: "top-3 left-3",
              dims: ["w-10 h-px", "w-px h-10"],
              origins: ["left", "top"],
            },
            {
              pos: "bottom-3 right-3",
              dims: ["w-10 h-px", "w-px h-10"],
              origins: ["right", "bottom"],
            },
          ].map((corner, ci) =>
            corner.dims.map((cls, wi) => (
              <motion.div
                key={`c-${ci}-${wi}`}
                className={`absolute ${corner.pos} ${cls} bg-[#DC2626]/40 z-[6] hidden dark:block`}
                animate={{
                  [wi === 0 ? "scaleX" : "scaleY"]: isHovered ? 1 : 0.3,
                  opacity: isHovered ? 0.6 : 0.1,
                }}
                transition={{ duration: 0.3, delay: ci * 0.05 }}
                style={{ transformOrigin: corner.origins[wi] }}
              />
            ))
          )}

          {/* Stat badge — bottom left */}
          <motion.div
            className="absolute bottom-6 left-6 md:bottom-8 md:left-8 z-[7]"
            animate={{ y: isHovered ? -4 : 0 }}
            transition={{ duration: 0.4 }}
          >
            <div
              className="inline-flex items-center gap-3 px-5 py-3 rounded-xl backdrop-blur-xl transition-all duration-500"
              style={{
                background: isHovered
                  ? "rgba(var(--accent-rgb),0.12)"
                  : "rgba(var(--surface-rgb),0.5)",
                border: isHovered
                  ? "1px solid rgba(var(--accent-rgb),0.25)"
                  : "1px solid rgba(var(--on-surface-rgb),0.06)",
                boxShadow: isHovered
                  ? "0 8px 32px rgba(var(--accent-rgb),0.08)"
                  : "none",
              }}
            >
              <span
                className="text-[#DC2626] text-[20px] md:text-[24px]"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: "var(--font-weight-display)",
                }}
              >
                <AnimatedStat value={product.stat} inView={isInView} />
              </span>
              <div className="w-px h-7 bg-on-surface/[0.08]" />
              <span
                className="text-on-surface/60 dark:text-on-surface/35 text-[10px] tracking-[0.12em] uppercase max-w-[110px] leading-[1.4]"
                style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
              >
                {product.statLabel}
              </span>
            </div>
          </motion.div>

          {/* Year badge — top right */}
          <motion.div
            className="absolute top-6 right-6 md:top-8 md:right-8 z-[7]"
            animate={{ opacity: isHovered ? 1 : 0.4 }}
            transition={{ duration: 0.4 }}
          >
            <span
              className="text-on-surface/50 dark:text-on-surface/25 text-[11px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-lg"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
                background: "rgba(var(--surface-rgb),0.4)",
                border: "1px solid rgba(var(--on-surface-rgb),0.04)",
              }}
            >
              {product.year}
            </span>
          </motion.div>

          {/* Bottom red accent line */}
          <motion.div
            className="absolute bottom-0 left-0 h-[2px] bg-[#DC2626] z-[8]"
            animate={{ width: isHovered ? "100%" : "0%" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Border */}
          <div
            className="absolute inset-0 rounded-2xl lg:rounded-none z-[4] pointer-events-none transition-all duration-700"
            style={{
              border: isHovered
                ? "1px solid rgba(var(--accent-rgb),0.18)"
                : "1px solid rgba(var(--on-surface-rgb),0.03)",
            }}
          />
        </div>

        {/* ── Text side ── */}
        <motion.div
          className="relative p-8 md:p-12 lg:p-16 xl:p-20 flex flex-col justify-center lg:[direction:ltr] overflow-hidden"
          style={{
            background:
              index % 2 === 0
                ? "rgba(var(--on-surface-rgb),0.01)"
                : "rgba(var(--accent-rgb),0.01)",
            borderTop: "1px solid rgba(var(--on-surface-rgb),0.03)",
            borderBottom: "1px solid rgba(var(--on-surface-rgb),0.03)",
          }}
        >
          {/* Faint grid pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-25 hidden dark:block"
            style={{
              backgroundImage:
                "linear-gradient(rgba(var(--accent-rgb),0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-rgb),0.02) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          {/* Ambient glow in corner */}
          <div
            className="absolute pointer-events-none rounded-full blur-[120px] hidden dark:block"
            style={{
              width: "300px",
              height: "300px",
              background: "rgba(var(--accent-rgb),0.03)",
              top: reversed ? "auto" : "-50px",
              bottom: reversed ? "-50px" : "auto",
              right: reversed ? "auto" : "-80px",
              left: reversed ? "-80px" : "auto",
            }}
          />

          {/* Category + tag row */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="flex items-center gap-4 mb-6 md:mb-8 relative z-10"
          >
            <span
              className="text-[#DC2626] text-[48px] md:text-[64px] leading-none hidden dark:block"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: "var(--font-weight-display)",
                opacity: 0.12,
              }}
            >
              {product.tag}
            </span>
            <motion.div
              className="h-px flex-1 bg-on-surface/[0.06]"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{
                duration: 0.65,
                delay: 0.22,
                ease: "easeOut",
              }}
              style={{ transformOrigin: "left" }}
            />
            <span
              className="text-[#DC2626] text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
                background: "rgba(var(--accent-rgb),0.06)",
                border: "1px solid rgba(var(--accent-rgb),0.12)",
              }}
            >
              {product.category}
            </span>
          </motion.div>

          {/* Name */}
          <div className="overflow-hidden relative z-10">
            <motion.h3
              initial={{ y: "100%" }}
              animate={isInView ? { y: 0 } : {}}
              transition={{
                duration: 0.75,
                delay: 0.18,
                ease: "easeOut",
              }}
              className="text-on-surface mb-4 md:mb-5 leading-[1.08]"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: "var(--font-weight-display)",
                fontSize: "clamp(28px, 3.5vw, 48px)",
              }}
            >
              {product.name}
            </motion.h3>
          </div>

          {/* Accent line */}
          <motion.div
            className="h-[2px] bg-[#DC2626] mb-6 md:mb-8 origin-left relative z-10"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{
              duration: 0.65,
              delay: 0.28,
              ease: "easeOut",
            }}
            style={{ maxWidth: "60px" }}
          />

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.32 }}
            className="text-on-surface/75 dark:text-on-surface/55 text-[14px] md:text-[15px] leading-[1.9] mb-7 md:mb-8 max-w-[460px] relative z-10"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
          >
            {product.desc}
          </motion.p>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.38 }}
            className="flex flex-wrap gap-2 mb-8 md:mb-10 relative z-10"
          >
            {product.specs.map((spec, pi) => (
              <motion.span
                key={spec.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.28, delay: 0.12 + pi * 0.04 }}
                className="text-on-surface/65 dark:text-on-surface/40 text-[10px] tracking-[0.1em] uppercase px-3.5 py-1.5 rounded-full"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 500,
                  background: "rgba(var(--on-surface-rgb),0.03)",
                  border: "1px solid rgba(var(--on-surface-rgb),0.06)",
                }}
              >
                {spec.label}: {spec.value}
              </motion.span>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex items-center gap-5 relative z-10"
          >
            <Link
              to={`/products/${product.categorySlug}`}
              className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full text-[12px] tracking-[0.08em] uppercase transition-all duration-300 hover:shadow-lg hover:shadow-[#DC2626]/15 hover:scale-[1.02]"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: "var(--font-weight-medium)",
                background: "#DC2626",
                color: "#fff",
              }}
            >
              View Details
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </Link>
            <Link
              to={`/products/${product.categorySlug}`}
              className="group inline-flex items-center gap-2 text-on-surface/65 dark:text-on-surface/40 hover:text-on-surface/80 dark:hover:text-on-surface/65 text-[12px] tracking-[0.1em] uppercase transition-all duration-300"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
            >
              Specs
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
});

/* ── Horizontal scrolling product names marquee ── */
function ProductMarquee() {
  return (
    <div className="overflow-hidden py-6 border-y border-on-surface/[0.03] hidden dark:block">
      <div
        className="flex gap-10 items-center will-change-transform"
        style={{ animation: "marqueeScrollLeft 36s linear infinite" }}
      >
        {[...products, ...products].map(
          (product, i) => (
            <div key={i} className="flex items-center gap-10 shrink-0">
              <span
                className="text-on-surface/5 whitespace-nowrap select-none"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: "var(--font-weight-display)",
                  fontSize: "clamp(36px, 5vw, 60px)",
                }}
              >
                {product.name}
              </span>
              <div className="w-2 h-2 rounded-full bg-[#DC2626]/15 shrink-0" />
            </div>
          )
        )}
      </div>
    </div>
  );
}

/* ══════════ Main Section ══════════ */
export function FeaturedProducts() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Watermark is now static for perf

  return (
    <section
      id="products"
      ref={sectionRef}
      className="relative bg-surface py-16 md:py-24 overflow-hidden"
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none hidden dark:block"
        style={{
          backgroundImage:
            "linear-gradient(rgba(var(--accent-rgb),0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-rgb),0.012) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Ambient glows — CSS animations for GPU compositing */}
      <div
        className="absolute top-[15%] left-[5%] w-[600px] h-[600px] bg-[#DC2626]/[0.02] rounded-full blur-[200px] pointer-events-none z-[2] hidden dark:block"
        style={{ animation: 'gentlePulse 10s ease-in-out infinite' }}
      />
      <div
        className="absolute bottom-[10%] right-[8%] w-[500px] h-[500px] bg-[#DC2626]/[0.025] rounded-full blur-[180px] pointer-events-none z-[2] hidden dark:block"
        style={{ animation: 'gentlePulse2 12s ease-in-out 3s infinite' }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#DC2626]/[0.012] rounded-full blur-[250px] pointer-events-none z-[2] hidden dark:block"
        style={{ animation: 'ambientPulse1 14s ease-in-out 1s infinite' }}
      />

      {/* Static watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[2] overflow-hidden opacity-[0.022] hidden dark:flex">
        <span
          className="text-on-surface whitespace-nowrap select-none"
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: "var(--font-weight-display)",
            fontSize: "clamp(120px, 18vw, 280px)",
            lineHeight: 1,
          }}
        >
          SONIC HIVE
        </span>
      </div>

      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.01] pointer-events-none z-[3] hidden dark:block"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ══ HEADER ══ */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 mb-16 md:mb-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -30px 0px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[#DC2626] text-[11px] tracking-[0.3em] uppercase mb-4 md:mb-5 block flex items-center gap-2"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Featured Products
            </motion.span>
            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, margin: "0px 0px -30px 0px" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="text-on-surface leading-[1.05]"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: "var(--font-weight-display)",
                  fontSize: "clamp(30px, 5vw, 64px)",
                }}
              >
                Flagship <span className="text-[#DC2626]">Products</span>
              </motion.h2>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -30px 0px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-start md:items-end gap-4"
          >
            <p
              className="text-on-surface/55 dark:text-on-surface/30 text-[14px] max-w-[340px] leading-[1.8] md:text-right"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
            >
              Engineered for perfection. Each product represents thousands of
              hours of acoustic research and testing.
            </p>
            <Link
              to="/products"
              className="group inline-flex items-center gap-3 text-[#DC2626] text-[13px] tracking-[0.1em] uppercase hover:gap-4 transition-all duration-300"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
            >
              View All Products
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ══ PRODUCT MARQUEE ══ */}
      <div className="relative z-10 mb-16 md:mb-24">
        <ProductMarquee />
      </div>

      {/* ══ PRODUCT ROWS ══ */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col gap-6 md:gap-8">
          {products.map((product, i) => (
            <ProductRow
              key={product.name}
              product={product}
              index={i}
              reversed={i % 2 !== 0}
            />
          ))}
        </div>
      </div>

      {/* ══ BOTTOM CTA BANNER ══ */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 mt-16 md:mt-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -30px 0px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            to="/products"
            aria-label="Explore the full product catalog"
            className="relative block rounded-2xl overflow-hidden group no-underline text-inherit outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#DC2626]/60"
            style={{ minHeight: "200px" }}
          >
            {/* Background image with parallax */}
            <motion.div className="absolute inset-[-10%]">
              <ImageWithFallback
                src={Asset14}
                alt=""
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1200ms]"
                style={{ filter: "brightness(0.45) saturate(0.85)" }}
              />
            </motion.div>

            <div className="absolute inset-0 dark:bg-gradient-to-r dark:from-surface/60 dark:via-transparent dark:to-surface/60 z-[1] pointer-events-none" />

            {/* Content */}
            <div className="relative z-[2] flex flex-col md:flex-row items-center justify-between gap-6 p-8 md:p-12 lg:p-16">
              <div>
                <h4
                  className="text-white text-[20px] md:text-[26px] mb-2"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: "var(--font-weight-heading)",
                  }}
                >
                  Explore the full catalog
                </h4>
                <p
                  className="text-white/70 text-[13px] max-w-[400px]"
                  style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
                >
                  Browse 50+ acoustic products across isolation, absorption,
                  diffusion, and soundproofing categories.
                </p>
              </div>
              <span
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-[13px] tracking-[0.08em] uppercase transition-all duration-300 group-hover:shadow-xl group-hover:shadow-[#DC2626]/15 group-hover:scale-[1.02] shrink-0"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: "var(--font-weight-medium)",
                  background: "rgba(var(--accent-rgb),0.9)",
                  color: "#fff",
                  border: "1px solid rgba(var(--accent-rgb),0.4)",
                }}
              >
                All Products
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </div>

            {/* Border */}
            <div className="absolute inset-0 rounded-2xl border border-on-surface/[0.04] group-hover:border-[#DC2626]/15 transition-colors duration-700 z-[3] pointer-events-none" />
          </Link>
        </motion.div>
      </div>

      {/* Bottom decorative line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px z-10"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "0px 0px -30px 0px" }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(var(--accent-rgb),0.12), transparent)",
        }}
      />
    </section>
  );
}
