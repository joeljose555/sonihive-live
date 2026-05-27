import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import Asset15 from '../assets/sonichives accostics web video_1.mp4';
import { HeroSoundVisualizer } from "./HeroSoundVisualizer";

/* ── Word-level reveal (was per-character) ── */
function WordReveal({
  text,
  delay = 0,
  className = "",
  style = {},
}: {
  text: string;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span className={`inline-flex flex-wrap ${className}`} style={style}>
      {text.split(" ").map((word, i) => (
        <span key={i} className="overflow-hidden inline-block mr-[0.3em] pb-[0.12em] align-bottom">
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
              delay: delay + i * 0.08,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ── Animated reveal line ── */
function RevealLine({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <div className="overflow-hidden">
      <motion.div
        initial={{ y: "120%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ── EQ bars via CSS animation ── */
function HeroEqBars() {
  return (
    <div className="flex items-end gap-[2px] h-5">
      {[...Array(24)].map((_, i) => (
        <div
          key={i}
          className="w-[2px] rounded-full bg-[#DC2626]/60"
          style={{
            animation: `eqBar ${0.6 + (i % 5) * 0.1}s ease-in-out ${i * 0.03}s infinite`,
            height: "4px",
          }}
        />
      ))}
    </div>
  );
}

/* ── Frequency meter via CSS ── */
function FrequencyMeter() {
  return (
    <div className="relative w-[140px] h-[140px] hidden xl:flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 140 140">
        <circle
          cx="70"
          cy="70"
          r="65"
          fill="none"
          stroke="rgba(var(--accent-rgb),0.08)"
          strokeWidth="0.5"
          strokeDasharray="4 4"
          style={{
            animation: "freqRingSpin 30s linear infinite",
            transformOrigin: "70px 70px",
          }}
        />
        <circle
          cx="70"
          cy="70"
          r="55"
          fill="none"
          stroke="rgba(var(--accent-rgb),0.15)"
          strokeWidth="1"
          strokeDasharray="408"
          strokeDashoffset="102"
          strokeLinecap="round"
          style={{
            animation: "freqRingPulse 6s ease-in-out infinite",
            transformOrigin: "70px 70px",
          }}
        />
        <circle
          cx="70"
          cy="70"
          r="45"
          fill="none"
          stroke="rgba(var(--accent-rgb),0.06)"
          strokeWidth="0.5"
        />
      </svg>
      <div className="relative z-10 text-center">
        <div
          className="text-[#DC2626] leading-none"
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: "var(--font-weight-display)",
            fontSize: "22px",
            animation: "freqNumPulse 3s ease-in-out infinite",
          }}
        >
          60+
        </div>
        <div
          className="text-on-surface/45 dark:text-on-surface/20 text-[8px] tracking-[0.2em] uppercase mt-1"
          style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
        >
          STC Rating
        </div>
      </div>
    </div>
  );
}

/* ── Marquee via CSS animation ── */
function HeroMarquee() {
  const items = [
    "60+ International Patents",
    "ISO 9001 & 14001 Certified",
    "NRC 0.95 Lab Tested",
    "30dB+ Speech Level Reduction",
    "Carbon Polymer Technology",
  ];

  return (
    <div className="absolute bottom-12 left-0 right-0 z-[8] pointer-events-none overflow-hidden opacity-[0.07]">
      <div
        className="flex gap-8 items-center whitespace-nowrap will-change-transform"
        style={{ animation: "marqueeScrollLeft 25s linear infinite" }}
      >
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-8 shrink-0">
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: "var(--font-weight-display)",
                fontSize: "clamp(20px, 3vw, 36px)",
              }}
              className="text-on-surface"
            >
              {item}
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#DC2626] shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ */

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const opacityContent = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const yContent = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  const scaleBg = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  const [bgReady, setBgReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setBgReady(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {});
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-[calc(100vh-5rem)] overflow-hidden "
    >
      {/* Video background */}
      <motion.div
        className="absolute inset-0 z-0 overflow-hidden"
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{ opacity: bgReady ? 1 : 0, scale: 1 }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
        style={{ scale: scaleBg }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          onCanPlay={() => setBgReady(true)}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ filter: "brightness(0.45) saturate(0.75) contrast(1.1)" }}
        >
          <source src={Asset15} type="video/mp4" />
        </video>
      </motion.div>

      {/* Neutral vignette for text contrast — no color tint on the video */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 h-[45%] bg-gradient-to-t from-surface via-surface/30 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-[20%] bg-gradient-to-b from-surface/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-surface/20 via-transparent to-surface/15" />
      </div>

      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none z-[5] hidden dark:block"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Canvas waveform — dark mode only */}
      <div className="absolute inset-0 z-[4] pointer-events-none hidden dark:block">
        <HeroSoundVisualizer />
      </div>

      {/* Marquee */}
      <HeroMarquee />

      {/* Main content — pt keeps heading below transparent header; fits in one viewport */}
      <motion.div
        style={{ opacity: opacityContent, y: yContent, willChange: "transform, opacity" }}
        className="relative z-10 flex flex-col min-h-[calc(100vh-5rem)] max-w-[1400px] mx-auto px-6 lg:px-10 pt-16 sm:pt-20 md:pt-24 lg:pt-20 pb-20 md:pb-28"
      >
        {/* Top-left EQ */}
        {/* <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="absolute top-28 left-6 lg:left-10 flex items-center gap-4"
        >
          <HeroEqBars />
          <span
            className="text-on-surface/20 text-[10px] tracking-[0.2em] uppercase"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
          >
            Live Waveform
          </span>
        </motion.div> */}

        {/* Top-right frequency meter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-20 right-6 lg:right-10"
        >
          <FrequencyMeter />
        </motion.div>

        {/* Mobile live badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="absolute top-28 right-6 lg:right-10 flex items-center gap-3 xl:hidden"
        >
          {/* <div className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse" />
          <span
            className="text-on-surface/50 dark:text-on-surface/25 text-[10px] tracking-[0.2em] uppercase"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
          >
            Sound Propagation Active
          </span> */}
        </motion.div>

        {/* Spacer — pushes content to bottom without justify-end overflow risk */}
        {/* <div className="flex-1 min-h-0" /> */}
        {/* Heading with word reveal */}
        <div className="mb-1">
          <h1
            className="leading-[1.05]"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: "var(--font-weight-display)",
              fontSize: "clamp(36px, 7.5vw, 115px)",
              color: "#ffffff",
            }}
          >
            <WordReveal text="Mastering the" delay={0.4} />
          </h1>
        </div>
        <div className="mb-1">
          <h1
            className="leading-[1.05]"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: "var(--font-weight-display)",
              fontSize: "clamp(36px, 7.5vw, 115px)",
              color: "#ffffff",
            }}
          >
            <WordReveal text="Science of" delay={0.6} />
          </h1>
        </div>
        <div>
          <h1
            className="leading-[1.05]"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: "var(--font-weight-display)",
              fontSize: "clamp(36px, 7.5vw, 115px)",
              color: "#DC2626",
            }}
          >
            <WordReveal text="Silence." delay={0.8} />
          </h1>
        </div>

        {/* Animated red underline */}
        <motion.div
          className="h-[3px] bg-[#DC2626] mt-4 mb-8 md:mb-10 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{ maxWidth: "120px" }}
        />

        {/* Subtitle + CTA + stats */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="flex flex-col gap-6">
            <RevealLine delay={0.9}>
              <p
                className="text-on-surface/80 dark:text-on-surface/55 max-w-[520px] text-[19px] md:text-[18px] leading-[1.9]"
                style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
              >
                Engineering the world's most advanced acoustic environments.
                From high-tech office pods to professional recording
                sanctuaries — where precision meets tranquility.
              </p>
            </RevealLine>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-4 flex-wrap"
            >
              <Link
                to="/products"
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full text-[13px] tracking-wide transition-all duration-300 hover:shadow-2xl hover:shadow-[#DC2626]/20 hover:scale-[1.03] overflow-hidden"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: "var(--font-weight-medium)",
                  background: "#DC2626",
                  color: "#fff",
                }}
              >
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: "linear-gradient(105deg, transparent 30%, rgba(var(--on-surface-rgb),0.15) 45%, rgba(var(--on-surface-rgb),0.2) 50%, rgba(var(--on-surface-rgb),0.15) 55%, transparent 70%)",
                  }}
                />
                <span className="relative z-10 flex items-center gap-3">
                  Explore Products
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                </span>
              </Link>
            </motion.div>
          </div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-6 md:gap-8"
          >
            {[
              { value: "2002", label: "Founded in HK" },
              { value: "60+", label: "Acoustic Patents" },
              { value: "Top 5%", label: "Global Leader" },
            ].map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-3">
                {i > 0 && <div className="w-px h-8 bg-on-surface/[0.06]" />}
                <div className={i > 0 ? "pl-3" : ""}>
                  <span
                    className="text-[#DC2626] text-[22px] md:text-[26px] block leading-none"
                    style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--font-weight-display)" }}
                  >
                    {stat.value}
                  </span>
                  <span
                    className="text-on-surface/60 dark:text-on-surface/35 text-[9px] tracking-[0.15em] uppercase"
                    style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
                  >
                    {stat.label}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <div
          className="w-[1px] h-10 bg-gradient-to-b from-[#DC2626] to-transparent"
          style={{ animation: "scrollBounce 2s ease-in-out infinite" }}
        />
        <span
          className="text-on-surface/12 text-[8px] tracking-[0.3em] uppercase"
          style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
        >
          Scroll
        </span>
      </motion.div>

      {/* Bottom line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px z-10"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 1, ease: [0.22, 1, 0.36, 1] }}
        style={{ background: "linear-gradient(90deg, transparent, rgba(var(--accent-rgb),0.25), transparent)" }}
      />

      {/* Side accents */}
      <motion.div
        className="absolute top-[15%] bottom-[15%] left-0 w-px z-[6] pointer-events-none"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 1.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(var(--accent-rgb),0.1), transparent)",
          transformOrigin: "top",
        }}
      />
      <motion.div
        className="absolute top-[25%] bottom-[25%] right-0 w-px z-[6] pointer-events-none"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 1.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(var(--accent-rgb),0.06), transparent)",
          transformOrigin: "bottom",
        }}
      />
    </section>
  );
}
