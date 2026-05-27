import { useRef, useState, useCallback, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView as useMotionInView,
} from "motion/react";
import { Link } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";

import Asset22 from '../assets/asset_22.jpg';
import Asset24 from '../assets/asset_24.jpg';
import Asset25 from '../assets/asset_25.jpg';
import Asset6 from '../assets/asset_06.jpg';
import Asset63 from '../assets/asset_63.jpeg';
import IndustryAcousticPanels from "../assets/industries/acoustic-panels-grid.png";
import IndustryFeaturedCorporate from "../assets/industries/featured-corporate-open-plan.png";
  
import {
  Music,
  Building,
  Factory,
  Car,
  Home,
  GraduationCap,
  Store,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";

/* ── Data ── */
const industries = [
  {
    name: "Corporate",
    icon: Building,
    desc: "Hyper-focus zones for Fortune 500 offices.",
    longDesc:
      "From open-plan acoustic zoning to executive privacy pods, we engineer workplaces where concentration thrives and confidential conversations stay confidential.",
    image: IndustryFeaturedCorporate,
    stat: "500+",
    statLabel: "Fortune 500 offices treated",
    featured: true,
  },
  {
    name: "Residential",
    icon: Home,
    desc: "Professional-grade HiFi rooms and private cinema acoustics.",
    longDesc:
      "Bespoke acoustic design for luxury residences — from dedicated listening rooms and home cinemas to whole-home sound isolation for discerning audiophiles.",
    image: Asset63,
    stat: "600+",
    statLabel: "Homes transformed",
    featured: false,
  },
  {
    name: "Industrial",
    icon: Factory,
    desc: "Advanced NVH solutions for high-speed rail and marine vessels.",
    longDesc:
      "Cutting-edge noise, vibration and harshness engineering for heavy industry — from rail carriages and ship cabins to factory floors requiring OSHA compliance.",
    image: IndustryAcousticPanels,
    stat: "200+",
    statLabel: "Industrial projects",
    featured: false,
  },
  {
    name: "Education",
    icon: GraduationCap,
    desc: "Optimizing the speech-to-noise ratio for the next generation of thinkers.",
    longDesc:
      "Purpose-built acoustic environments for lecture halls, libraries, and examination rooms — maximizing speech intelligibility where learning matters most.",
    image:
      Asset24,
    stat: "350+",
    statLabel: "Campuses equipped",
    featured: false,
  },
];

/* Full industries page (6 sectors) — content from marketing brief */
const industriesPage = [
  {
    name: "Studio & Media",
    icon: Music,
    desc: "Where every decibel is critical.",
    longDesc:
      "We deliver STC 60+ isolation with precise RT60 tuning for Grammy-winning control rooms and elite podcasting suites.",
    image: Asset6,
    stat: "400+",
    statLabel: "Studios built worldwide",
    featured: true,
  },
  {
    name: "Corporate & Enterprise",
    icon: Building,
    desc: "Restoring focus to the open-plan office.",
    longDesc:
      "Our solutions mitigate background chatter and acoustic fatigue, turning high-traffic zones into collaborative, productive sanctuaries.",
    image: IndustryFeaturedCorporate,
    stat: "243+",
    statLabel: "Offices optimized",
    featured: false,
  },
  {
    name: "Industrial & Manufacturing",
    icon: Factory,
    desc: "Containing the mechanical roar.",
    longDesc:
      "Industrial-grade noise barriers and vibration-dampening systems protect health and maintain operational efficiency.",
    image: IndustryAcousticPanels,
    stat: "28+",
    statLabel: "Factories insulated",
    featured: false,
  },
  {
    name: "Automotive & Transit",
    icon: Car,
    desc: "Silence in motion.",
    longDesc:
      "We partner with OEMs to engineer cabin quietness, reducing road vibration and external noise for a premium driving experience.",
    image: Asset25,
    stat: "50+",
    statLabel: "OEM & transit programs",
    featured: false,
  },
  {
    name: "Residential & Audiophile",
    icon: Home,
    desc: "The home sanctuary.",
    longDesc:
      "Dedicated home theaters, HiFi listening rooms, and quiet retreats — immersive, sound-controlled living spaces.",
    image: Asset22,
    stat: "134+",
    statLabel: "Homes transformed",
    featured: false,
  },
  {
    name: "Commercial & Hospitality",
    icon: Store,
    desc: "Elevating the guest experience.",
    longDesc:
      "Retail, restaurant, and hotel acoustics with the perfect balance between lively ambiance and conversational clarity.",
    image: Asset24,
    stat: "232+",
    statLabel: "Venues completed",
    featured: false,
  },
];

/* ── Animated counter ── */
function AnimatedCounter({
  value,
  inView,
}: {
  value: string;
  inView: boolean;
}) {
  const numericPart = value.replace(/[^0-9]/g, "");
  const suffix = value.replace(numericPart, "");
  const target = parseInt(numericPart) || 0;
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let startTime: number | null = null;
    const duration = 2000;
    let animId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      const currentVal = Math.floor(target * ease);
      setCount(currentVal);

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
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ── Featured hero industry card (large, cinematic) ── */
function FeaturedIndustryCard({
  industry,
}: {
  industry: (typeof industries)[0];
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useMotionInView(cardRef, { once: true, margin: "-30px" });
  const [isHovered, setIsHovered] = useState(false);
  const mousePosRef = useRef({ x: 50, y: 50 });
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [-18, 18]);

  const Icon = industry.icon;

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    mousePosRef.current = {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    };
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const { x, y } = mousePosRef.current;
      if (cursorGlowRef.current) {
        cursorGlowRef.current.style.background = `radial-gradient(700px circle at ${x}% ${y}%, rgba(var(--accent-rgb),0.12), transparent 50%)`;
      }
    });
  }, []);

  return (
    <Link to="/products" className="block">
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 80 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-2xl overflow-hidden group cursor-pointer"
      style={{ minHeight: "520px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mousePosRef.current = { x: 50, y: 50 };
      }}
      onMouseMove={handleMouseMove}
    >
      {/* Parallax background image */}
      <motion.div
        className="absolute inset-[-8%]"
        style={{ y: imgY, willChange: "transform" }}
      >
        <ImageWithFallback
          src={industry.image}
          alt={industry.name}
          className="w-full h-full object-cover transition-all duration-[1200ms]"
          style={{
            filter: isHovered
              ? "brightness(0.7) saturate(1.15)"
              : "brightness(0.5) saturate(0.85)",
          }}
        />
      </motion.div>

      {/* Cursor-following glow */}
      <div
        ref={cursorGlowRef}
        className="absolute inset-0 pointer-events-none z-[2] transition-opacity duration-700 hidden dark:block"
        style={{
          background: `radial-gradient(700px circle at 50% 50%, rgba(var(--accent-rgb),0.12), transparent 50%)`,
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
        transition={{ duration: 1.8, ease: "easeInOut" }}
      />

      {/* Overlays */}
      <div className="absolute inset-0 dark:bg-gradient-to-t dark:from-surface dark:via-surface/40 dark:to-transparent z-[1]" />
      <div className="absolute inset-0 dark:bg-gradient-to-r dark:from-surface/60 dark:to-transparent z-[1]" />

      {/* Corner accents (CSS transitions) */}
      {[
        { pos: "top-3 left-3", wh: ["w-10 h-px", "w-px h-10"], origins: ["left", "top"] },
        { pos: "top-3 right-3", wh: ["w-10 h-px", "w-px h-10"], origins: ["right", "top"] },
        { pos: "bottom-3 left-3", wh: ["w-10 h-px", "w-px h-10"], origins: ["left", "bottom"] },
        { pos: "bottom-3 right-3", wh: ["w-10 h-px", "w-px h-10"], origins: ["right", "bottom"] },
      ].map((corner, ci) =>
        corner.wh.map((cls, wi) => (
          <div
            key={`corner-${ci}-${wi}`}
            className={`absolute ${corner.pos} ${cls} bg-[#DC2626]/40 z-[6] transition-all duration-500 hidden dark:block`}
            style={{
              transform: `${wi === 0 ? "scaleX" : "scaleY"}(${isHovered ? 1 : 0.3})`,
              opacity: isHovered ? 0.6 : 0.1,
              transformOrigin: corner.origins[wi],
            }}
          />
        ))
      )}

      {/* Content overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 p-8 md:p-12 lg:p-16 z-[5]"
      >
        <div className="grid lg:grid-cols-2 gap-8 items-end">
          <div>
            {/* Tag + Icon */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex items-center gap-4 mb-6"
            >
              <motion.div
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500"
                style={{
                  background: isHovered
                    ? "rgba(var(--accent-rgb),0.15)"
                    : "rgba(var(--on-surface-rgb),0.04)",
                  border: isHovered
                    ? "1px solid rgba(var(--accent-rgb),0.3)"
                    : "1px solid rgba(var(--on-surface-rgb),0.06)",
                }}
                animate={{
                  scale: isHovered ? 1.1 : 1,
                  rotate: isHovered ? 5 : 0,
                }}
                transition={{ duration: 0.5 }}
              >
                <Icon
                  className="w-5 h-5 transition-colors duration-500"
                  style={{
                    color: isHovered ? "#DC2626" : "rgba(var(--on-surface-rgb),var(--text-alpha-muted))",
                  }}
                />
              </motion.div>
              <div className="h-px flex-1 bg-on-surface/[0.06]" />
              <span
                className="text-[#DC2626] text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 500,
                  background: "rgba(var(--accent-rgb),0.06)",
                  border: "1px solid rgba(var(--accent-rgb),0.12)",
                }}
              >
                Featured
              </span>
            </motion.div>

            {/* Name */}
            <div className="overflow-hidden mb-3">
              <motion.h3
                initial={{ y: "100%" }}
                animate={isInView ? { y: 0 } : {}}
                transition={{
                  duration: 0.9,
                  delay: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="text-white leading-[1.05]"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: "var(--font-weight-display)",
                  fontSize: "clamp(32px, 4vw, 56px)",
                }}
              >
                {industry.name}
              </motion.h3>
            </div>

            {/* Accent line */}
            <motion.div
              className="h-[2px] bg-[#DC2626] mb-5 origin-left"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{
                duration: 0.8,
                delay: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ maxWidth: "60px" }}
            />

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="text-white/75 text-[14px] md:text-[15px] leading-[1.9] mb-6 max-w-[420px]"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
            >
              {industry.longDesc}
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.65 }}
            >
              <span
                className="group inline-flex items-center gap-3 px-6 py-3 rounded-full text-[12px] tracking-[0.1em] uppercase transition-all duration-300 group-hover:gap-4 group-hover:shadow-lg group-hover:shadow-[#DC2626]/10"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: "var(--font-weight-medium)",
                  background: "rgba(var(--accent-rgb),0.9)",
                  color: "#fff",
                  border: "1px solid rgba(var(--accent-rgb),0.4)",
                }}
              >
                Explore products
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </span>
            </motion.div>
          </div>

          {/* Right: Stat */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col items-end text-right"
          >
            <span
              className="text-[#DC2626] leading-none mb-2"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: "var(--font-weight-display)",
                fontSize: "clamp(48px, 8vw, 96px)",
              }}
            >
              <AnimatedCounter value={industry.stat} inView={isInView} />
            </span>
            <span
              className="text-on-surface/55 dark:text-on-surface/30 text-[11px] tracking-[0.2em] uppercase"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
            >
              {industry.statLabel}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Bottom red accent line */}
      <div
        className="absolute bottom-0 left-0 h-[2px] bg-[#DC2626] z-[7] transition-all duration-700 ease-out"
        style={{ width: isHovered ? "100%" : "0%" }}
      />

      {/* Border */}
      <div
        className="absolute inset-0 rounded-2xl z-[4] pointer-events-none transition-all duration-700"
        style={{
          border: isHovered
            ? "1px solid rgba(var(--accent-rgb),0.2)"
            : "1px solid rgba(var(--on-surface-rgb),0.04)",
        }}
      />
    </motion.div>
    </Link>
  );
}

/* ── Standard industry card ── */
function IndustryCard({
  industry,
  index,
}: {
  industry: (typeof industries)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useMotionInView(cardRef, { once: true, margin: "-30px" });
  const [isHovered, setIsHovered] = useState(false);
  const mousePosRef = useRef({ x: 50, y: 50 });
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const speeds = [12, -9, 15, -12, 9];
  const imgY = useTransform(
    scrollYProgress,
    [0, 1],
    [-speeds[index % 5], speeds[index % 5]]
  );

  const Icon = industry.icon;
  const num = String(index + 2).padStart(2, "0");

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    mousePosRef.current = {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    };
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const { x, y } = mousePosRef.current;
      if (cursorGlowRef.current) {
        cursorGlowRef.current.style.background = `radial-gradient(500px circle at ${x}% ${y}%, rgba(var(--accent-rgb),0.1), transparent 50%)`;
      }
    });
  }, []);

  return (
    <Link to="/products" className="block">
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.65,
        delay: Math.min(index * 0.05, 0.28),
        ease: "easeOut",
      }}
      className="relative rounded-2xl overflow-hidden group cursor-pointer"
      style={{ minHeight: "380px" }}
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
          src={industry.image}
          alt={industry.name}
          className="w-full h-full object-cover transition-all duration-[1000ms]"
          style={{
            filter: isHovered
              ? "brightness(0.65) saturate(1.15)"
              : "brightness(0.4) saturate(0.8)",
          }}
        />
      </motion.div>

      {/* Cursor glow */}
      <div
        ref={cursorGlowRef}
        className="absolute inset-0 pointer-events-none z-[2] transition-opacity duration-600 hidden dark:block"
        style={{
          background: `radial-gradient(500px circle at 50% 50%, rgba(var(--accent-rgb),0.1), transparent 50%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Shine sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-[3]"
        style={{
          background:
            "linear-gradient(105deg, transparent 40%, rgba(var(--on-surface-rgb),0.03) 45%, rgba(var(--on-surface-rgb),0.06) 50%, rgba(var(--on-surface-rgb),0.03) 55%, transparent 60%)",
          backgroundSize: "200% 100%",
        }}
        animate={{
          backgroundPosition: isHovered ? ["200% 0", "-200% 0"] : "200% 0",
        }}
        transition={{ duration: 1.3, ease: "easeInOut" }}
      />

      {/* Overlays */}
      <div className="absolute inset-0 dark:bg-gradient-to-t dark:from-surface dark:via-surface/30 dark:to-transparent z-[1]" />

      {/* Grain */}
      <div
        className="absolute inset-0 z-[3] opacity-[0.025] pointer-events-none hidden dark:block"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Top: number + icon */}
      <div className="absolute top-0 left-0 right-0 p-5 md:p-6 z-[5] flex items-start justify-between">
        <motion.span
          className="text-on-surface/10 text-[11px] tracking-[0.2em] uppercase transition-colors duration-500"
          animate={{ color: isHovered ? "rgba(var(--accent-rgb),0.5)" : "rgba(var(--on-surface-rgb),var(--text-alpha-faint))" }}
          style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
        >
          {num}
        </motion.span>
        <motion.div
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500"
          style={{
            background: isHovered
              ? "rgba(var(--accent-rgb),0.12)"
              : "rgba(var(--on-surface-rgb),0.03)",
            border: isHovered
              ? "1px solid rgba(var(--accent-rgb),0.25)"
              : "1px solid rgba(var(--on-surface-rgb),0.05)",
          }}
          animate={{
            scale: isHovered ? 1.1 : 1,
            rotate: isHovered ? 5 : 0,
          }}
          transition={{ duration: 0.5 }}
        >
          <Icon
            className="w-4.5 h-4.5 transition-colors duration-500"
            style={{
              color: isHovered ? "#DC2626" : "rgba(var(--on-surface-rgb),var(--text-alpha-subtle))",
            }}
          />
        </motion.div>
      </div>

      {/* Large background number */}
      <motion.span
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 leading-none select-none pointer-events-none z-[1] hidden dark:block"
        style={{
          fontFamily: "var(--font-sans)",
          fontWeight: "var(--font-weight-display)",
          fontSize: "clamp(80px, 12vw, 160px)",
          color: isHovered
            ? "rgba(var(--accent-rgb),0.05)"
            : "rgba(var(--on-surface-rgb),0.015)",
          transition: "color 0.8s ease",
        }}
        animate={{
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ duration: 0.7 }}
      >
        {num}
      </motion.span>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 z-[5]">
        {/* Stat reveal */}
        <motion.div
          className="mb-3 flex items-baseline gap-2"
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 12,
          }}
          transition={{ duration: 0.4 }}
        >
          <span
            className="text-[#DC2626] text-[28px] leading-none"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: "var(--font-weight-display)",
            }}
          >
            <AnimatedCounter value={industry.stat} inView={isInView && isHovered} />
          </span>
          <span
            className="text-white/50 text-[10px] tracking-[0.12em] uppercase"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
          >
            {industry.statLabel}
          </span>
        </motion.div>

        {/* Name */}
        <motion.h3
          className="text-white mb-2 leading-[1.1]"
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: "var(--font-weight-display)",
            fontSize: "clamp(22px, 2.5vw, 30px)",
          }}
          animate={{ x: isHovered ? 6 : 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {industry.name}
        </motion.h3>

        {/* Description */}
        <motion.p
          className="text-white/70 text-[13px] leading-[1.7] max-w-[320px] mb-3"
          style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
          animate={{
            opacity: isHovered ? 1 : 0.35,
            y: isHovered ? 0 : 6,
          }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          {industry.desc}
        </motion.p>

        {/* CTA */}
        <motion.div
          className="flex items-center gap-2"
          animate={{
            opacity: isHovered ? 1 : 0,
            x: isHovered ? 0 : -12,
          }}
          transition={{ duration: 0.35, delay: 0.1 }}
        >
          <span
            className="text-[#DC2626] text-[11px] tracking-[0.15em] uppercase"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
          >
            Explore
          </span>
          <ArrowUpRight className="w-3.5 h-3.5 text-[#DC2626]" />
        </motion.div>
      </div>

      {/* Bottom red accent line */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] bg-[#DC2626] z-[7]"
        animate={{ width: isHovered ? "100%" : "0%" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Side accent (left) */}
      <motion.div
        className="absolute top-0 left-0 w-[2px] bg-[#DC2626] z-[7]"
        animate={{ height: isHovered ? "100%" : "0%" }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Border */}
      <div
        className="absolute inset-0 rounded-2xl z-[4] pointer-events-none transition-all duration-700"
        style={{
          border: isHovered
            ? "1px solid rgba(var(--accent-rgb),0.18)"
            : "1px solid rgba(var(--on-surface-rgb),0.04)",
        }}
      />
    </motion.div>
    </Link>
  );
}

/* ── Horizontal scrolling industry marquee ── */
function IndustryMarquee() {
  const items = [
    "Recording Studios",
    "Corporate Offices",
    "Manufacturing Plants",
    "Automotive OEM",
    "Luxury Residences",
    "Hospitality Venues",
    "Broadcast Facilities",
    "Concert Halls",
    "Healthcare",
    "Education",
  ];
  return (
    <div className="overflow-hidden py-6 border-y border-on-surface/[0.03] hidden dark:block">
      <div
        className="flex gap-8 items-center will-change-transform"
        style={{ animation: "marqueeScrollLeft 35s linear infinite" }}
      >
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-8 shrink-0">
            <span
              className="text-on-surface/[0.06] whitespace-nowrap select-none"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: "var(--font-weight-display)",
                fontSize: "clamp(32px, 4vw, 52px)",
              }}
            >
              {item}
            </span>
            <div className="w-2 h-2 rounded-full bg-[#DC2626]/15 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════ Main Section ══════════ */
export function IndustriesSection({
  variant = "home",
}: {
  variant?: "home" | "page";
} = {}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const list = variant === "page" ? industriesPage : industries;
  const nonFeatured = list.filter((i) => !i.featured);

  return (
    <section
      id="industries"
      ref={sectionRef}
      className="relative bg-surface py-16 md:py-24 overflow-hidden"
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none hidden dark:block"
        style={{
          backgroundImage:
            "linear-gradient(rgba(var(--accent-rgb),0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-rgb),0.015) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Ambient glows — CSS animations for GPU compositing */}
      <div
        className="absolute top-[25%] left-[5%] w-[500px] h-[500px] bg-[#DC2626]/[0.02] rounded-full blur-[200px] pointer-events-none z-[2] hidden dark:block"
        style={{ animation: 'gentlePulse 9s ease-in-out infinite' }}
      />
      <div
        className="absolute bottom-[15%] right-[8%] w-[450px] h-[450px] bg-[#DC2626]/[0.025] rounded-full blur-[180px] pointer-events-none z-[2] hidden dark:block"
        style={{ animation: 'gentlePulse2 11s ease-in-out 3s infinite' }}
      />

      {/* Static watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[2] overflow-hidden opacity-[0.025] hidden dark:flex">
        <span
          className="text-on-surface whitespace-nowrap select-none"
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: "var(--font-weight-display)",
            fontSize: "clamp(150px, 20vw, 320px)",
            lineHeight: 1,
          }}
        >
          INDUSTRIES
        </span>
      </div>

      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none z-[3] hidden dark:block"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 relative z-10">
        {/* ══ Header ══ */}
        <motion.div
          className="mb-16 md:mb-24"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -30px 0px" }}
            transition={{ duration: 0.6 }}
            className="text-[#DC2626] text-[11px] tracking-[0.3em] uppercase mb-5 block"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
          >
            Industries
          </motion.span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="text-on-surface leading-[1.05]"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: "var(--font-weight-display)",
                  fontSize: "clamp(30px, 5vw, 64px)",
                }}
              >
                {variant === "page" ? (
                  <>
                    Engineering silence for{" "}
                    <span className="text-[#DC2626]">every environment</span>
                  </>
                ) : (
                  <>
                    Sound solutions for{" "}
                    <span className="text-[#DC2626]">every sector</span>
                  </>
                )}
              </motion.h2>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -30px 0px" }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-on-surface/70 dark:text-on-surface/45 text-[14px] max-w-[420px] leading-[1.8]"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
            >
              {variant === "page"
                ? "From high-fidelity acoustic sanctuaries to heavy-duty industrial isolation, we calibrate environments where precision is the only standard."
                : "From Grammy-winning studios to Fortune 500 offices — Sonic Hive Acoustics engineers acoustic perfection for every environment."}
            </motion.p>
          </div>
        </motion.div>

        {/* ══ Featured hero card ══ */}
        <div className="mb-5">
          <FeaturedIndustryCard industry={list.find((i) => i.featured) ?? list[0]} />
        </div>

        {/* ══ Grid of remaining cards ══ */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16 md:mb-24">
          {nonFeatured.map((industry, i) => (
            <IndustryCard key={industry.name} industry={industry} index={i} />
          ))}
        </div>

        {/* ══ Scrolling marquee ══ */}
        <IndustryMarquee />

        {/* ══ Bottom CTA strip ══ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -30px 0px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 md:mt-20 relative flex flex-col md:flex-row items-center justify-between gap-8 py-12 px-8 md:px-14 rounded-2xl overflow-hidden"
          style={{
            background: "rgba(var(--on-surface-rgb),0.01)",
            border: "1px solid rgba(var(--on-surface-rgb),0.04)",
          }}
        >
          {/* Background image */}
          <div className="absolute inset-0 z-0">
            <ImageWithFallback
              src={Asset25}
              alt=""
              className="w-full h-full object-cover"
              style={{ filter: "brightness(0.18) saturate(0.6)" }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/70 dark:from-white/10 dark:via-white/5 dark:to-white/10 z-[1]" />

          {/* Floating animated accent — CSS animation */}
          <div
            className="absolute top-0 left-0 right-0 h-px z-[2] hidden dark:block"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(var(--accent-rgb),0.2), transparent)",
              animation: 'gentlePulse 4s ease-in-out infinite',
            }}
          />

          <div className="relative z-[3]">
            <h4
              className="text-white text-[20px] md:text-[24px] mb-2"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: "var(--font-weight-heading)",
              }}
            >
              Don't see your industry?
            </h4>
            <p
              className="text-white/70 text-[13px] md:text-[14px] max-w-[420px] leading-[1.7]"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
            >
              We design custom acoustic solutions for any environment — from
              healthcare facilities to concert halls. Let's talk.
            </p>
          </div>

          <div className="relative z-[3] flex items-center gap-4">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full text-[12px] tracking-[0.1em] uppercase cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-[#DC2626]/15 hover:scale-[1.02] shrink-0"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: "var(--font-weight-medium)",
                background: "rgba(var(--accent-rgb),0.9)",
                color: "#fff",
                border: "1px solid rgba(var(--accent-rgb),0.4)",
              }}
            >
              Get a Consultation
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>

          {/* Bottom accent line animation */}
          <motion.div
            className="absolute bottom-0 left-0 h-[2px] bg-[#DC2626] z-[3]"
            initial={{ width: "0%" }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true, margin: "0px 0px -30px 0px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>

        {/* ══ Bottom trust / stats strip ══ */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "0px 0px -30px 0px" }}
          transition={{ duration: 0.8 }}
          className="relative z-10 mt-16 md:mt-20 border-t border-on-surface/[0.03] pt-12 md:pt-16"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { value: "35+", label: "Industries Served" },
              { value: "2,400+", label: "Projects Delivered" },
              { value: "18", label: "Countries" },
              { value: "99.2%", label: "Client Satisfaction" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -30px 0px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="text-center"
              >
                <span
                  className="text-[#DC2626] block mb-1"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: "var(--font-weight-display)",
                    fontSize: "clamp(28px, 3.5vw, 42px)",
                  }}
                >
                  {stat.value}
                </span>
                <span
                  className="text-on-surface/50 dark:text-on-surface/25 text-[10px] md:text-[11px] tracking-[0.15em] uppercase"
                  style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
                >
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
