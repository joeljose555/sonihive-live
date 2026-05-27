import { useState, useRef, useCallback, useEffect } from "react";
import { motion, useScroll, useTransform, useInView as useMotionInView } from "motion/react";
import { useInView } from "./useInView";
import { ImageWithFallback } from "./figma/ImageWithFallback";

import Asset26 from '../assets/asset_26.jpg';
import Asset27 from '../assets/asset_27.jpg';
import Asset28 from '../assets/asset_28.jpg';
import Asset29 from '../assets/asset_29.jpg';
import Asset30 from '../assets/asset_30.jpg';
import Asset64 from '../assets/asset_64.jpeg';
  
import { Link } from "react-router";
import {
  Brain,
  Layers,
  PenTool,
  FlaskConical,
  ArrowUpRight,
  Zap,
  Award,
  Target,
} from "lucide-react";

/* ── Four pillars (lab-verified advantage) ── */
const reasons = [
  {
    icon: Brain,
    title: "Advanced Psychoacoustics",
    desc: "We don't just use generic foam. Our R&D team utilizes proprietary algorithms and physics-based modeling to simulate sound behavior before a single panel is installed.",
    image: Asset26,
    stat: "99.2%",
    statLabel: "Prediction accuracy",
    tag: "01",
  },
  {
    icon: Layers,
    title: "Aerospace-Grade Materiality",
    desc: "Every component, from our non-toxic sound insulation felts to our carbon polymer booth shells, undergoes 47 individual quality checks to ensure fire safety and zero-odor emissions.",
    image: Asset27,
    stat: "47",
    statLabel: "Quality gates",
    tag: "02",
  },
  {
    icon: PenTool,
    title: "Bespoke Structural Integration",
    desc: "We provide the invisible architecture. Our products are designed to integrate seamlessly into modern BIM/Revit workflows, ensuring acoustic integrity without sacrificing design.",
    image: Asset28,
    stat: "2400+",
    statLabel: "Custom projects",
    tag: "03",
  },
  {
    icon: FlaskConical,
    title: "Laboratory-Verified Performance",
    desc: "Unlike competitors, our ratings aren't estimates. We are one of the few global firms with a private, full-scale sound laboratory testing to ASTM and ISO standards.",
    image: Asset29,
    stat: "72",
    statLabel: "Max STC rating achieved",
    tag: "04",
  },
];

/* ── Animated stat counter ── */
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
    const duration = 1800;
    let animId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      const currentVal = target * ease;
      setCount(target < 10 ? parseFloat(currentVal.toFixed(1)) : Math.floor(currentVal));

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
      {target < 10 ? count.toFixed(1) : count.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ── Animated progress ring (SVG) ── */
function ProgressRing({
  progress,
  size = 80,
  inView,
}: {
  progress: number;
  size?: number;
  inView: boolean;
}) {
  const stroke = 2;
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(var(--on-surface-rgb),0.04)"
        strokeWidth={stroke}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#DC2626"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{
          strokeDashoffset: inView
            ? circumference - (progress / 100) * circumference
            : circumference,
        }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
      />
    </svg>
  );
}

/* ── Full-width image+text reason row ── */
function ReasonRow({
  reason,
  index,
  reversed,
}: {
  reason: (typeof reasons)[0];
  index: number;
  reversed: boolean;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const isInView = useMotionInView(rowRef, { once: true, margin: "-30px" });
  const [isHovered, setIsHovered] = useState(false);
  const mousePosRef = useRef({ x: 50, y: 50 });
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [-14, 14]);

  const Icon = reason.icon;

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
        cursorGlowRef.current.style.background = `radial-gradient(500px circle at ${x}% ${y}%, rgba(var(--accent-rgb),0.12), transparent 50%)`;
      }
    });
  }, []);

  const progressValue =
    index === 0 ? 99.2 : index === 1 ? 100 : index === 2 ? 95 : 100;

  return (
    <motion.div
      ref={rowRef}
      initial={{ opacity: 0, y: 80 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: 0.05,
        ease: "easeOut",
      }}
      className={`grid lg:grid-cols-2 gap-0 lg:gap-0 items-stretch ${
        reversed ? "lg:[direction:rtl]" : ""
      }`}
    >
      {/* ── Image side ── */}
      <div
        className="relative overflow-hidden group cursor-pointer lg:[direction:ltr]"
        style={{ minHeight: "420px" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
            mousePosRef.current = { x: 50, y: 50 };
        }}
        onMouseMove={handleMouseMove}
      >
        {/* Parallax image */}
        <motion.div
          className="absolute inset-[-5%]"
          style={{ y: imgY, willChange: "transform" }}
        >
          <ImageWithFallback
            src={reason.image}
            alt={reason.title}
            className="w-full h-full object-cover transition-all duration-700"
            style={{
              filter: isHovered
                ? "brightness(0.8) saturate(1.15)"
                : "brightness(0.6) saturate(0.9)",
            }}
          />
        </motion.div>

        {/* Cursor-following glow */}
        <div
          ref={cursorGlowRef}
          className="absolute inset-0 pointer-events-none z-[2] transition-opacity duration-500 hidden dark:block"
          style={{
            background: `radial-gradient(500px circle at 50% 50%, rgba(var(--accent-rgb),0.12), transparent 50%)`,
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Shine sweep */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-[3]"
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, rgba(var(--on-surface-rgb),0.04) 45%, rgba(var(--on-surface-rgb),0.08) 50%, rgba(var(--on-surface-rgb),0.04) 55%, transparent 60%)",
            backgroundSize: "200% 100%",
          }}
          animate={{
            backgroundPosition: isHovered
              ? ["200% 0", "-200% 0"]
              : "200% 0",
          }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface/60 via-transparent to-transparent z-[1]" />
        <div
          className={`absolute inset-0 z-[1] ${
            reversed
              ? "bg-gradient-to-l from-surface/70 to-transparent"
              : "bg-gradient-to-r from-surface/70 to-transparent"
          }`}
          style={{ [reversed ? "left" : "right"]: 0 }}
        />

        {/* Large background number */}
        <motion.span
          className="absolute bottom-6 right-8 leading-none select-none pointer-events-none z-[4] hidden dark:block"
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: "var(--font-weight-display)",
            fontSize: "clamp(100px, 14vw, 200px)",
            color: isHovered
              ? "rgba(var(--accent-rgb),0.08)"
              : "rgba(var(--on-surface-rgb),0.03)",
            transition: "color 0.7s ease",
          }}
          animate={{
            scale: isHovered ? 1.05 : 1,
            y: isHovered ? -5 : 0,
          }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {reason.tag}
        </motion.span>

        {/* Stat badge overlay */}
        <motion.div
          className="absolute top-6 left-6 md:top-8 md:left-8 z-[5]"
          animate={{ y: isHovered ? -4 : 0, opacity: isHovered ? 1 : 0.7 }}
          transition={{ duration: 0.4 }}
        >
          <div
            className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl backdrop-blur-xl transition-all duration-500"
            style={{
              background: isHovered
                ? "rgba(var(--accent-rgb),0.12)"
                : "rgba(var(--surface-rgb),0.5)",
              border: isHovered
                ? "1px solid rgba(var(--accent-rgb),0.25)"
                : "1px solid rgba(var(--on-surface-rgb),0.06)",
            }}
          >
            <span
              className="text-[#DC2626] text-[18px] md:text-[22px]"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: "var(--font-weight-display)",
              }}
            >
              <AnimatedStat value={reason.stat} inView={isInView} />
            </span>
            <div className="w-px h-6 bg-on-surface/[0.08]" />
            <span
              className="text-on-surface/65 dark:text-on-surface/40 text-[10px] tracking-[0.12em] uppercase"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
            >
              {reason.statLabel}
            </span>
          </div>
        </motion.div>

        {/* Corner accents (CSS transitions) */}
        <div
          className="absolute top-3 left-3 w-8 h-px bg-[#DC2626]/40 z-[5] transition-all duration-500 origin-left hidden dark:block"
          style={{ transform: `scaleX(${isHovered ? 1 : 0.4})`, opacity: isHovered ? 0.6 : 0.15 }}
        />
        <div
          className="absolute top-3 left-3 w-px h-8 bg-[#DC2626]/40 z-[5] transition-all duration-500 origin-top hidden dark:block"
          style={{ transform: `scaleY(${isHovered ? 1 : 0.4})`, opacity: isHovered ? 0.6 : 0.15 }}
        />
        <div
          className="absolute bottom-3 right-3 w-8 h-px bg-[#DC2626]/40 z-[5] transition-all duration-500 origin-right hidden dark:block"
          style={{ transform: `scaleX(${isHovered ? 1 : 0.4})`, opacity: isHovered ? 0.6 : 0.15 }}
        />
        <div
          className="absolute bottom-3 right-3 w-px h-8 bg-[#DC2626]/40 z-[5] transition-all duration-500 origin-bottom hidden dark:block"
          style={{ transform: `scaleY(${isHovered ? 1 : 0.4})`, opacity: isHovered ? 0.6 : 0.15 }}
        />

        <div
          className="absolute bottom-0 left-0 h-[2px] bg-[#DC2626] z-[6] transition-all duration-500 ease-out"
          style={{ width: isHovered ? "100%" : "0%" }}
        />
      </div>

      {/* ── Text side ── */}
      <motion.div
        className="relative p-8 md:p-12 lg:p-16 flex flex-col justify-center lg:[direction:ltr] overflow-hidden"
        style={{
          background:
            index % 2 === 0
              ? "rgba(var(--on-surface-rgb),0.01)"
              : "rgba(var(--accent-rgb),0.015)",
          borderTop: "1px solid rgba(var(--on-surface-rgb),0.03)",
          borderBottom: "1px solid rgba(var(--on-surface-rgb),0.03)",
        }}
      >
        {/* Background decorative ring */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 pointer-events-none opacity-[0.03] hidden dark:block">
          <ProgressRing
            progress={progressValue}
            size={320}
            inView={isInView}
          />
        </div>

        {/* Grid pattern inside */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30 hidden dark:block"
          style={{
            backgroundImage:
              "linear-gradient(rgba(var(--accent-rgb),0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-rgb),0.02) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Icon + label row */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="flex items-center gap-4 mb-6 relative z-10"
        >
          <motion.div
            className="w-12 h-12 rounded-xl flex items-center justify-center relative overflow-hidden"
            style={{
              background: "rgba(var(--accent-rgb),0.08)",
              border: "1px solid rgba(var(--accent-rgb),0.18)",
            }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.4 }}
          >
            <Icon className="w-5 h-5 text-[#DC2626] relative z-10" />
            <div
              className="absolute inset-0 rounded-xl"
              style={{
                boxShadow:
                  "0 0 20px rgba(var(--accent-rgb),0.1), inset 0 0 15px rgba(var(--accent-rgb),0.03)",
              }}
            />
          </motion.div>

          <div className="h-px flex-1 bg-on-surface/[0.04]" />

          <span
            className="text-[#DC2626] text-[11px] tracking-[0.2em] uppercase"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
          >
            {reason.tag}
          </span>
        </motion.div>

        {/* Title */}
        <div className="overflow-hidden relative z-10">
          <motion.h3
            initial={{ y: "100%" }}
            animate={isInView ? { y: 0 } : {}}
            transition={{
              duration: 0.75,
              delay: 0.18,
              ease: "easeOut",
            }}
            className="text-on-surface mb-4 leading-[1.1]"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: "var(--font-weight-display)",
              fontSize: "clamp(24px, 3vw, 40px)",
            }}
          >
            {reason.title}
          </motion.h3>
        </div>

        {/* Animated accent line */}
        <motion.div
          className="h-[2px] bg-[#DC2626] mb-6 origin-left relative z-10"
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
          className="text-on-surface/70 dark:text-on-surface/50 text-[14px] md:text-[15px] leading-[1.9] mb-8 max-w-[460px] relative z-10"
          style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
        >
          {reason.desc}
        </motion.p>

        {/* Stat + progress ring */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.4 }}
          className="flex items-center gap-5 mb-8 relative z-10"
        >
          <div className="relative">
            <ProgressRing
              progress={progressValue}
              size={72}
              inView={isInView}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="text-[#DC2626] text-[14px]"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: "var(--font-weight-display)",
                }}
              >
                <AnimatedStat value={reason.stat} inView={isInView} />
              </span>
            </div>
          </div>
          <div>
            <span
              className="text-on-surface/60 text-[13px] block"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
            >
              {reason.statLabel}
            </span>
            <span
              className="text-on-surface/50 dark:text-on-surface/25 text-[11px] tracking-[0.1em] uppercase"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
            >
              Verified Performance
            </span>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="relative z-10"
        >
          <Link
            to="/products"
            className="group inline-flex items-center gap-2 text-[#DC2626] text-[12px] tracking-[0.15em] uppercase transition-all duration-300 hover:gap-3"
          >
            <span
              style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
            >
              Learn more
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ── Horizontal scrolling stat badges ── */
const scrollStats = [
  { icon: Zap, value: "99.2%", label: "Prediction accuracy" },
  { icon: Award, value: "ISO 9001", label: "Certified" },
  { icon: Target, value: "STC 72", label: "Max rating achieved" },
  { icon: Layers, value: "47", label: "Quality gates" },
  { icon: Zap, value: "2400+", label: "Custom projects" },
  { icon: Award, value: "5+", label: "Year performance guarantee" },
];

function ScrollingStats() {
  return (
    <div className="overflow-hidden py-8 border-y border-on-surface/[0.03]">
      <div
        className="flex gap-12 items-center will-change-transform"
        style={{ animation: "marqueeScrollLeft 30s linear infinite" }}
      >
        {[...scrollStats, ...scrollStats].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="flex items-center gap-4 shrink-0"
            >
              <div className="w-10 h-10 rounded-lg bg-on-surface/[0.02] border border-on-surface/[0.04] flex items-center justify-center">
                <Icon className="w-4 h-4 text-[#DC2626]/60" />
              </div>
              <div>
                <span
                  className="text-on-surface/70 text-[16px] block leading-none"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: "var(--font-weight-display)",
                  }}
                >
                  {stat.value}
                </span>
                <span
                  className="text-on-surface/50 dark:text-on-surface/25 text-[10px] tracking-[0.1em] uppercase"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 400,
                  }}
                >
                  {stat.label}
                </span>
              </div>
              {/* Separator dot */}
              <div className="w-1 h-1 rounded-full bg-[#DC2626]/20 ml-4" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Main section ── */
export function WhySonicBox() {
  const sectionRef = useRef<HTMLDivElement>(null);
  // Removed scroll-driven bgY transform for perf

  return (
    <section
      id="why"
      ref={sectionRef}
      className="relative bg-surface overflow-hidden"
    >
      {/* Ambient glows — CSS animations for GPU compositing */}
      <div
        className="absolute top-[20%] left-[5%] w-[500px] h-[500px] bg-[#DC2626]/[0.02] rounded-full blur-[200px] pointer-events-none z-[1] hidden dark:block"
        style={{ animation: 'gentlePulse 10s ease-in-out infinite' }}
      />
      <div
        className="absolute bottom-[20%] right-[5%] w-[500px] h-[500px] bg-[#DC2626]/[0.015] rounded-full blur-[180px] pointer-events-none z-[1] hidden dark:block"
        style={{ animation: 'gentlePulse2 12s ease-in-out 4s infinite' }}
      />

      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none z-[2] hidden dark:block"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ════════════ HEADER ════════════ */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 pt-24 md:pt-40 pb-16 md:pb-24">
        <div className="grid lg:grid-cols-2 gap-8 items-end">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -30px 0px" }}
              transition={{ duration: 0.6 }}
              className="text-[#DC2626] text-[11px] tracking-[0.3em] uppercase mb-5 block"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
            >
              Why Choose Us
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
                Four Pillars of{" "}
                <span className="text-[#DC2626]">Engineering Excellence</span>
              </motion.h2>
            </div>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -30px 0px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-on-surface/65 dark:text-on-surface/40 text-[14px] md:text-[15px] max-w-[420px] leading-[1.9] lg:text-right lg:ml-auto"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
          >
            Our commitment to precision is verified by science and backed by
            years of global industry leadership at Sonic Hive Acoustics.
          </motion.p>
        </div>
      </div>

      {/* ════════════ SCROLLING STATS BAR ════════════ */}
      <div className="relative z-10">
        <ScrollingStats />
      </div>

      {/* ════════════ ALTERNATING IMAGE+TEXT ROWS ════════════ */}
      <div className="relative z-10">
        {reasons.map((reason, i) => (
          <ReasonRow
            key={reason.title}
            reason={reason}
            index={i}
            reversed={i % 2 !== 0}
          />
        ))}
      </div>

      {/* ════════════ BOTTOM CINEMATIC BANNER ════════════ */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -30px 0px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-2xl overflow-hidden group"
          style={{ aspectRatio: "21/7" }}
        >
          <div
            className="absolute inset-[-5%]"
          >
            <ImageWithFallback
              src={Asset64}
              alt="Acoustic engineering"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1200ms] ease-out"
              style={{ filter: "brightness(0.55) saturate(0.9)" }}
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-r from-surface/70 via-transparent to-surface/70 z-[1]" />

          {/* Scrolling text */}
          <div className="absolute inset-0 flex items-center justify-center z-[2] hidden dark:flex">
            <div
              className="flex gap-20 whitespace-nowrap will-change-transform"
              style={{ animation: "marqueeScrollLeft 20s linear infinite" }}
            >
              {[...Array(2)].map((_, i) => (
                <span
                  key={i}
                  className="text-on-surface/[0.06] select-none pointer-events-none"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: "var(--font-weight-display)",
                    fontSize: "clamp(50px, 8vw, 120px)",
                    lineHeight: 1,
                  }}
                >
                  ENGINEERING SILENCE — PERFECTING SOUND —
                </span>
              ))}
            </div>
          </div>

          {/* CTA overlay centered */}
          <div className="absolute inset-0 flex items-center justify-center z-[3]">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/contact"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full text-[13px] tracking-wide transition-all duration-300 hover:shadow-xl hover:shadow-[#DC2626]/15 hover:scale-[1.02] backdrop-blur-sm"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: "var(--font-weight-medium)",
                  background: "rgba(var(--accent-rgb),0.9)",
                  color: "#fff",
                  border: "1px solid rgba(var(--accent-rgb),0.4)",
                }}
              >
                Start Your Project
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </Link>
            </motion.div>
          </div>

          {/* Border */}
          <div className="absolute inset-0 rounded-2xl border border-on-surface/[0.04] group-hover:border-[#DC2626]/15 transition-colors duration-700 z-[4]" />
        </motion.div>
      </div>

      {/* Bottom section line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px z-10"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "0px 0px -30px 0px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(var(--accent-rgb),0.15), transparent)",
        }}
      />
    </section>
  );
}
