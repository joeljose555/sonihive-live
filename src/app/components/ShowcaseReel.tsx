import { useRef, useState, useCallback } from "react";
import { Link } from "react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowUpRight } from "lucide-react";
import ShowcaseSoundproofDoor from "../assets/showcase-reel/soundproof-door.png";
import ShowcasePortableAcoustics from "../assets/showcase-reel/portable-acoustics.png";
import ShowcaseAutomotive from "../assets/showcase-reel/automotive-soundproofing.png";
import ShowcaseNoiseAccessories from "../assets/showcase-reel/noise-reduction-accessories.png";

const showcaseItems = [
  {
    title: "Soundproof Door",
    category: "Products",
    image: ShowcaseSoundproofDoor,
    stat: "Structural",
    to: "/products/soundproof-door",
  },
  {
    title: "Portable Acoustics",
    category: "Products",
    image: ShowcasePortableAcoustics,
    stat: "Modular",
    to: "/products/portable-acoustics",
  },
  {
    title: "Automotive Soundproofing\nSeries",
    category: "Products",
    image: ShowcaseAutomotive,
    stat: "Automotive",
    to: "/products/automotive-series",
  },
  {
    title: "Noise Reduction\nAccessories",
    category: "Products",
    image: ShowcaseNoiseAccessories,
    stat: "Everyday",
    to: "/products/noise-accessories",
  },
] as const;

function ShowcaseCard({
  item,
  index,
}: {
  item: (typeof showcaseItems)[number];
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const mousePosRef = useRef({ x: 50, y: 50 });
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

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
    <Link to={item.to} className="contents">
      <motion.div
        className="relative shrink-0 w-[320px] md:w-[420px] lg:w-[500px] h-[450px] md:h-[550px] rounded-2xl overflow-hidden cursor-pointer group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
      {/* Image */}
      <motion.div
        className="absolute inset-0"
        animate={{ scale: isHovered ? 1.04 : 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <ImageWithFallback
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
          style={{
            filter: isHovered ? "brightness(0.8) saturate(1.1)" : "brightness(0.6) saturate(0.9)",
            transition: "filter 0.8s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      </motion.div>

      {/* Cursor glow */}
      <div
        ref={cursorGlowRef}
        className="absolute inset-0 pointer-events-none z-[1] transition-opacity duration-500 hidden dark:block"
        style={{
          background: `radial-gradient(500px circle at 50% 50%, rgba(var(--accent-rgb),0.1), transparent 50%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent z-[2]" />
      <div
        className="absolute inset-0 z-[2] transition-opacity duration-700 hidden dark:block"
        style={{
          background: "linear-gradient(135deg, rgba(var(--accent-rgb),0.05) 0%, transparent 50%)",
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Top: index + category */}
      <div className="absolute top-6 left-6 right-6 z-[5] flex items-start justify-between">
        <span
          className="text-on-surface/10 text-[60px] md:text-[80px] leading-none select-none hidden dark:block"
          style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--font-weight-display)" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <motion.span
          className="text-[#DC2626] text-[10px] tracking-[0.2em] uppercase mt-4"
          style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
          animate={{ opacity: isHovered ? 1 : 0.5 }}
        >
          {item.category}
        </motion.span>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-[5]">
        {/* Stat badge */}
        <motion.div
          className="mb-4"
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          transition={{ duration: 0.4 }}
        >
          <span
            className="inline-flex items-center px-3 py-1.5 rounded-lg text-[#DC2626] text-[13px]"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: "var(--font-weight-display)",
              background: "rgba(var(--accent-rgb),0.08)",
              border: "1px solid rgba(var(--accent-rgb),0.15)",
            }}
          >
            {item.stat}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h3
          className="text-on-surface mb-4 whitespace-pre-line"
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: "var(--font-weight-display)",
            fontSize: "clamp(22px, 3vw, 32px)",
            lineHeight: 1.15,
          }}
          animate={{ x: isHovered ? 4 : 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {item.title}
        </motion.h3>

        {/* CTA */}
        <motion.div
          className="flex items-center gap-2"
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
          transition={{ duration: 0.35, delay: 0.1 }}
        >
          <span
            className="text-[#DC2626] text-[11px] tracking-[0.15em] uppercase"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
          >
            Explore range
          </span>
          <ArrowUpRight className="w-3.5 h-3.5 text-[#DC2626]" />
        </motion.div>
      </div>

      {/* Bottom accent line */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] bg-[#DC2626] z-[6]"
        initial={{ width: "0%" }}
        animate={{ width: isHovered ? "100%" : "0%" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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

export function ShowcaseReel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const headingY = useTransform(scrollYProgress, [0, 0.3], [30, 0]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-surface py-16 md:py-24 overflow-hidden"
    >
      {/* Background animated grid */}
      <div
        className="absolute inset-0 pointer-events-none hidden dark:block"
        style={{
          backgroundImage:
            "linear-gradient(rgba(var(--accent-rgb),0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-rgb),0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Ambient glow (CSS) */}
      <div
        className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-[#DC2626]/[0.02] rounded-full blur-[200px] pointer-events-none hidden dark:block"
        style={{ animation: "gentlePulse 9s ease-in-out infinite" }}
      />

      {/* Header */}
      <motion.div
        className="max-w-[1400px] mx-auto px-6 lg:px-10 mb-12 md:mb-16"
        style={{ y: headingY, opacity: headingOpacity, willChange: "transform, opacity" }}
      >
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "0px 0px -100px 0px" }}
              transition={{ duration: 0.6 }}
              className="text-[#DC2626] text-[11px] tracking-[0.3em] uppercase mb-5 block"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
            >
              Product lines
            </motion.span>
            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="text-on-surface leading-[1.05]"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: "var(--font-weight-display)",
                  fontSize: "clamp(28px, 4.5vw, 56px)",
                }}
              >
                Showcase <span className="text-[#DC2626]">Reel</span>
              </motion.h2>
            </div>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-on-surface/50 dark:text-on-surface/25 text-[14px] max-w-[350px] leading-[1.8]"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
          >
            Flagship Sonic Hive product lines—from soundproof doors and portable acoustics to automotive deadening and everyday noise-reduction accessories.
          </motion.p>
        </div>
      </motion.div>

      {/* Horizontal scroll container */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto scrollbar-hide px-6 lg:px-10"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div className="flex gap-5 md:gap-6 pb-4" style={{ width: "max-content" }}>
          {showcaseItems.map((item, i) => (
            <ShowcaseCard key={item.to} item={item} index={i} />
          ))}
        </div>
      </div>

      {/* Scroll hint gradient edges */}
      <div className="absolute top-0 bottom-0 right-0 w-[100px] bg-gradient-to-l from-surface to-transparent pointer-events-none z-10 hidden dark:block" />

      {/* Bottom decorative line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: "linear-gradient(90deg, transparent, rgba(var(--accent-rgb),0.12), transparent)",
        }}
      />
    </section>
  );
}
