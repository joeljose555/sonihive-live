import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useInView } from "./useInView";
import { Link } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowLeft, Plus, ArrowUpRight } from "lucide-react";
import { solutionGroups } from "../data/solutions";

const SOLUTION_FILTER_TABS: { label: string; slug: string | null }[] = [
  { label: "All", slug: null },
  { label: "Architectural acoustics", slug: "architectural-acoustics" },
  { label: "Industrial facilities", slug: "industrial-facilities" },
  { label: "Environmental noise control", slug: "environmental-noise-control" },
];

/** Wide tiles on large breakpoints — slug-based only */
const LARGE_TILE_SLUGS = new Set<string>([
  "architectural-acoustics",
  "environmental-noise-control",
]);

function SolutionGroupCard({
  cat,
  index,
  isLarge,
}: {
  cat: (typeof solutionGroups)[0];
  index: number;
  isLarge: boolean;
}) {
  const { ref, inView } = useInView(0.08);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = cat.icon;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const linkPath = `/solutions/${cat.slug}`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.7,
        delay: Math.min(index * 0.06, 0.5),
        ease: [0.22, 1, 0.36, 1],
      }}
      className={isLarge ? "md:col-span-2" : ""}
    >
      <Link to={linkPath}>
        <div
          ref={cardRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseMove={handleMouseMove}
          className="relative group cursor-pointer rounded-2xl overflow-hidden"
          style={{
            background: "var(--surface-elevated)",
            border: "1px solid rgba(var(--on-surface-rgb),0.04)",
            height: isLarge ? "480px" : "420px",
          }}
        >
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-[1]"
            style={{
              background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, rgba(var(--accent-rgb),0.06), transparent 50%)`,
            }}
          />

          <div
            className="absolute -top-20 -left-20 w-60 h-60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none z-[1]"
            style={{
              background: "radial-gradient(circle, rgba(var(--accent-rgb),0.08), transparent 70%)",
            }}
          />

          <div className="absolute inset-0 flex items-center justify-center z-[2] p-8 pt-12 pb-24">
            <motion.div
              className="relative w-full h-full rounded-xl overflow-hidden"
              animate={{
                scale: isHovered ? 1.04 : 1,
                y: isHovered ? -6 : 0,
              }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <ImageWithFallback
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover rounded-xl"
                style={{
                  filter: isHovered ? "brightness(1.1)" : "brightness(0.7)",
                  transition: "filter 0.6s ease",
                }}
              />
              <div
                className="absolute inset-0 rounded-xl transition-opacity duration-600"
                style={{
                  background: "linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.7) 100%)",
                  opacity: isHovered ? 0.4 : 0.8,
                }}
              />

              <motion.div
                className="absolute inset-0 rounded-xl pointer-events-none"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 40%, rgba(var(--on-surface-rgb),0.04) 45%, rgba(var(--on-surface-rgb),0.08) 50%, rgba(var(--on-surface-rgb),0.04) 55%, transparent 60%)",
                }}
                animate={{ x: isHovered ? "120%" : "-120%" }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
            </motion.div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-[5] p-5 flex items-end justify-between">
            <div className="flex items-end gap-4">
              <motion.h3
                className="text-on-surface leading-[1.15]"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: "var(--font-weight-heading)",
                  fontSize: isLarge ? "22px" : "18px",
                }}
                animate={{ y: isHovered ? -2 : 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {cat.name}
              </motion.h3>
            </div>

            <div className="flex items-center gap-4">
              <motion.span
                className="text-on-surface/50 dark:text-on-surface/25 text-[13px]"
                style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
                animate={{ opacity: isHovered ? 1 : 0.4 }}
                transition={{ duration: 0.4 }}
              >
                {cat.items.length} solutions
              </motion.span>

              <motion.div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  border: "1px solid rgba(var(--on-surface-rgb),0.1)",
                  background: "rgba(var(--on-surface-rgb),0.03)",
                }}
                animate={{
                  borderColor: isHovered
                    ? "rgba(var(--accent-rgb),0.4)"
                    : "rgba(var(--on-surface-rgb),0.1)",
                  background: isHovered
                    ? "rgba(var(--accent-rgb),0.1)"
                    : "rgba(var(--on-surface-rgb),0.03)",
                  rotate: isHovered ? 90 : 0,
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <Plus
                  className="w-3.5 h-3.5 transition-colors duration-400"
                  style={{
                    color: isHovered ? "#DC2626" : "rgba(var(--on-surface-rgb),var(--text-alpha-muted))",
                  }}
                />
              </motion.div>
            </div>
          </div>

          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-[5]">
            <motion.span
              className="block text-[10px] tracking-[0.2em] uppercase whitespace-nowrap"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
                writingMode: "vertical-rl",
                textOrientation: "mixed",
                color: isHovered ? "rgba(var(--accent-rgb),0.5)" : "rgba(var(--on-surface-rgb),var(--text-alpha-faint))",
                transition: "color 0.5s ease",
              }}
            >
              {cat.tag}
            </motion.span>
          </div>

          <div className="absolute top-5 left-5 z-[5]">
            <motion.div
              className="w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md"
              style={{
                background: "rgba(var(--on-surface-rgb),0.04)",
                border: "1px solid rgba(var(--on-surface-rgb),0.06)",
              }}
              animate={{
                background: isHovered
                  ? "rgba(var(--accent-rgb),0.12)"
                  : "rgba(var(--on-surface-rgb),0.04)",
                borderColor: isHovered
                  ? "rgba(var(--accent-rgb),0.2)"
                  : "rgba(var(--on-surface-rgb),0.06)",
              }}
              transition={{ duration: 0.4 }}
            >
              <Icon
                className="w-4 h-4 transition-colors duration-400"
                style={{
                  color: isHovered ? "#DC2626" : "rgba(var(--on-surface-rgb),var(--text-alpha-subtle))",
                }}
              />
            </motion.div>
          </div>

          <motion.div
            className="absolute bottom-14 left-5 right-16 z-[5]"
            initial={false}
            animate={{
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 10,
            }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <p
              className="text-on-surface/65 dark:text-on-surface/40 text-[12px] leading-[1.6] line-clamp-2"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
            >
              {cat.description}
            </p>
          </motion.div>

          <motion.div
            className="absolute bottom-0 left-0 h-[2px] bg-[#DC2626] z-[6]"
            initial={{ width: "0%" }}
            animate={{ width: isHovered ? "100%" : "0%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </Link>
    </motion.div>
  );
}

function SolutionsHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const yText = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div
      ref={heroRef}
      className="relative min-h-[70vh] md:min-h-[80vh] flex items-end overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] bg-[#DC2626]/[0.03] rounded-full blur-[200px]" />
      <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-[#DC2626]/[0.02] rounded-full blur-[150px]" />

      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[#DC2626]/20"
          style={{
            left: `${15 + i * 18}%`,
            top: `${20 + i * 12}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        />
      ))}

      <motion.div
        style={{ y: yText, opacity, willChange: "transform, opacity" }}
        className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 pb-16 md:pb-24 w-full"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-on-surface/55 dark:text-on-surface/30 hover:text-[#DC2626] transition-all duration-300 mb-12 md:mb-16 text-[13px] group"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Home
          </Link>
        </motion.div>

        <div className="overflow-hidden mb-4">
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.3,
            }}
          >
            <span
              className="text-[#DC2626] text-[11px] md:text-[12px] tracking-[0.3em] uppercase block mb-4 md:mb-6"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
            >
              Application solutions — 3 focus areas
            </span>
          </motion.div>
        </div>

        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{
              duration: 1,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.4,
            }}
            className="text-on-surface leading-[0.95] mb-3"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: "var(--font-weight-display)",
              fontSize: "clamp(40px, 8vw, 100px)",
            }}
          >
            Solution
          </motion.h1>
        </div>

        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{
              duration: 1,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.5,
            }}
            className="leading-[0.95]"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: "var(--font-weight-display)",
              fontSize: "clamp(40px, 8vw, 100px)",
              color: "#DC2626",
            }}
          >
            Areas
          </motion.h1>
        </div>

        <div className="overflow-hidden mt-6 md:mt-8">
          <motion.p
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.7 }}
            className="text-on-surface/55 dark:text-on-surface/30 max-w-[500px] text-[14px] md:text-[16px] leading-[1.8]"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
          >
            Architectural, industrial, and environmental acoustic programs — explore where our engineering makes the biggest impact.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-12 md:mt-16 flex items-center gap-3"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{
              repeat: Infinity,
              duration: 1.8,
              ease: "easeInOut",
            }}
            className="w-5 h-8 rounded-full border border-on-surface/10 flex items-start justify-center p-1.5"
          >
            <div className="w-1 h-1.5 rounded-full bg-[#DC2626]" />
          </motion.div>
          <span
            className="text-on-surface/45 dark:text-on-surface/20 text-[11px] tracking-[0.2em] uppercase"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
          >
            Scroll to explore
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}

function SolutionStatsStrip() {
  const { ref, inView } = useInView(0.3);
  const stats = [
    { value: "3", label: "Solution areas" },
    { value: "22", label: "Applications" },
    { value: "Global", label: "Project reach" },
    { value: "STC 60+", label: "Max rating" },
  ];

  return (
    <div ref={ref} className="border-y border-on-surface/[0.04] py-8 md:py-0">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="md:py-8 py-4 md:border-r last:border-r-0 border-on-surface/[0.04] text-center"
            >
              <div
                className="text-[24px] md:text-[32px] text-on-surface mb-1"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: "var(--font-weight-display)",
                }}
              >
                {stat.value}
              </div>
              <div
                className="text-on-surface/50 dark:text-on-surface/25 text-[11px] tracking-[0.15em] uppercase"
                style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterTabs({
  activeSlug,
  onFilter,
}: {
  activeSlug: string | null;
  onFilter: (slug: string | null) => void;
}) {
  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8 md:py-12">
      <div className="flex flex-wrap gap-2 md:gap-3">
        {SOLUTION_FILTER_TABS.map(({ label, slug }) => (
          <motion.button
            key={label}
            onClick={() => onFilter(slug)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="px-4 md:px-5 py-2 md:py-2.5 rounded-full text-[11px] md:text-[12px] tracking-[0.1em] uppercase cursor-pointer transition-all duration-400"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 500,
              background:
                activeSlug === slug
                  ? "rgba(var(--accent-rgb),0.12)"
                  : "rgba(var(--on-surface-rgb),0.03)",
              border:
                activeSlug === slug
                  ? "1px solid rgba(var(--accent-rgb),0.3)"
                  : "1px solid rgba(var(--on-surface-rgb),0.06)",
              color:
                activeSlug === slug ? "#DC2626" : "rgba(var(--on-surface-rgb),0.35)",
            }}
          >
            {label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export function SolutionCategories() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const filtered =
    activeSlug === null
      ? solutionGroups
      : solutionGroups.filter((c) => c.slug === activeSlug);

  return (
    <section className="relative bg-surface min-h-screen overflow-hidden">
      <SolutionsHero />
      <SolutionStatsStrip />
      <FilterTabs activeSlug={activeSlug} onFilter={setActiveSlug} />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-32">
        <div className="flex items-center justify-between py-4 mb-6">
          <span
            className="text-on-surface/30 dark:text-on-surface/15 text-[11px] tracking-[0.2em] uppercase"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
          >
            {filtered.length} areas
          </span>
          <div
            className="flex items-center gap-2 text-on-surface/30 dark:text-on-surface/15 text-[11px] tracking-[0.1em] uppercase"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
          >
            <Plus className="w-3 h-3" /> Hover to explore
          </div>
        </div>

        <motion.div
          key={activeSlug ?? "all"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filtered.map((cat, i) => (
            <SolutionGroupCard
              key={cat.slug}
              cat={cat}
              index={i}
              isLarge={LARGE_TILE_SLUGS.has(cat.slug)}
            />
          ))}
        </motion.div>
      </div>

      <div className="border-t border-on-surface/[0.04]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 md:py-24 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: " 0px 0px -100px 0px" }}
              transition={{ duration: 0.6 }}
              className="text-on-surface text-[24px] md:text-[32px] leading-[1.2] mb-3"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: "var(--font-weight-heading)",
              }}
            >
              Need a custom acoustic program?
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: " 0px 0px -100px 0px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-on-surface/55 dark:text-on-surface/30 text-[14px] max-w-[400px] leading-[1.7]"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
            >
              Our engineering team creates bespoke acoustic solutions tailored to your site, budget, and performance targets.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: " 0px 0px -100px 0px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              to="/contact"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#DC2626] text-white text-[14px] tracking-wide hover:bg-[#b91c1c] transition-all duration-300 hover:shadow-xl hover:shadow-[#DC2626]/20"
              style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--font-weight-medium)" }}
            >
              Contact us
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
