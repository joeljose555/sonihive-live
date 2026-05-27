import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowLeft, Plus } from "lucide-react";
import { getSolutionGroupBySlug, type SolutionItem } from "../data/solutions";
import { useInView } from "../components/useInView";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { usePageMeta } from "../hooks/usePageMeta";

export function SolutionGroupPage() {
  const { groupSlug } = useParams<{ groupSlug: string }>();
  const navigate = useNavigate();
  const group = getSolutionGroupBySlug(groupSlug || "");

  usePageMeta(
    group ? `${group.name} | Sonic Hive Acoustics` : "Solutions | Sonic Hive Acoustics",
    group?.description
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!group) {
      navigate("/solutions", { replace: true });
    }
  }, [group, navigate]);

  if (!group) {
    return null;
  }

  const Icon = group.icon;

  return (
    <section className="relative bg-surface min-h-screen overflow-hidden">
      <SolutionGroupHero group={group} Icon={Icon} />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <span
            className="text-[#DC2626] text-[11px] md:text-[12px] tracking-[0.3em] uppercase block mb-4"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
          >
            {group.items.length} applications
          </span>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {group.items.map((item, index) => (
            <SolutionItemCard
              key={item.slug + index}
              item={item}
              groupSlug={group.slug}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function SolutionGroupHero({
  group,
  Icon,
}: {
  group: NonNullable<ReturnType<typeof getSolutionGroupBySlug>>;
  Icon: React.ComponentType<{ className?: string }>;
}) {
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
      className="relative min-h-[70vh] md:min-h-[75vh] flex items-end overflow-hidden"
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

      <motion.div
        style={{ y: yText, opacity }}
        className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 pb-16 md:pb-24 w-full"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link
            to="/solutions"
            className="inline-flex items-center gap-2 text-on-surface/30 hover:text-[#DC2626] transition-all duration-300 mb-12 md:mb-16 text-[13px] group"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to all solutions
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#DC2626]/10 flex items-center justify-center mb-8 border border-[#DC2626]/20"
        >
          <Icon className="w-8 h-8 md:w-10 md:h-10 text-[#DC2626]" />
        </motion.div>

        <div className="overflow-hidden mb-4">
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.4,
            }}
          >
            <span
              className="text-[#DC2626] text-[11px] md:text-[12px] tracking-[0.3em] uppercase block mb-4 md:mb-6"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
            >
              Solution area — {group.tag}
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
              delay: 0.5,
            }}
            className="text-on-surface leading-[0.95] mb-6"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: "var(--font-weight-display)",
              fontSize: "clamp(40px, 8vw, 100px)",
            }}
          >
            {group.name}
          </motion.h1>
        </div>

        <div className="overflow-hidden mt-6 md:mt-8">
          <motion.p
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.7 }}
            className="text-on-surface/30 max-w-[600px] text-[14px] md:text-[16px] leading-[1.8]"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
          >
            {group.description}
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}

function SolutionItemCard({
  item,
  groupSlug,
  index,
}: {
  item: SolutionItem;
  groupSlug: string;
  index: number;
}) {
  const { ref, inView } = useInView(0.08);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: Math.min(index * 0.06, 0.5),
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link to={`/solutions/${groupSlug}/${item.slug}`}>
        <div
          ref={cardRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseMove={handleMouseMove}
          className="relative group cursor-pointer rounded-2xl overflow-hidden"
          style={{
            background: "var(--surface-elevated)",
            border: "1px solid rgba(var(--on-surface-rgb), 0.04)",
            height: "420px",
          }}
        >
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-[1]"
            style={{
              background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, rgba(var(--accent-rgb), 0.06), transparent 50%)`,
            }}
          />

          <div
            className="absolute -top-20 -left-20 w-60 h-60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none z-[1]"
            style={{
              background: "radial-gradient(circle, rgba(var(--accent-rgb), 0.08), transparent 70%)",
            }}
          />

          <div className="absolute inset-0 flex items-center justify-center z-[2] p-8 pt-12 pb-24">
            <div className="relative w-full h-full rounded-xl overflow-hidden">
              <ImageWithFallback
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover rounded-xl"
                style={{
                  filter: isHovered ? "brightness(1.0)" : "brightness(0.7)",
                  transition: "filter 0.5s ease",
                }}
              />
              <div
                className="absolute inset-0 rounded-xl pointer-events-none"
                style={{
                  background: "linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.65) 100%)",
                  opacity: isHovered ? 0.45 : 0.9,
                  transition: "opacity 0.5s ease",
                }}
              />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-[5] p-5 flex items-end justify-between">
            <div className="flex items-end gap-4">
              <motion.h3
                className="text-on-surface leading-[1.15]"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: "var(--font-weight-heading)",
                  fontSize: "18px",
                }}
                animate={{ y: isHovered ? -2 : 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {item.name}
              </motion.h3>
            </div>

            <div className="flex items-center gap-4">
              <motion.span
                className="text-on-surface/25 text-[13px]"
                style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
                animate={{ opacity: isHovered ? 1 : 0.4 }}
                transition={{ duration: 0.4 }}
              >
                {item.year}
              </motion.span>

              <motion.div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  border: "1px solid rgba(var(--on-surface-rgb), 0.1)",
                  background: "rgba(var(--on-surface-rgb), 0.03)",
                }}
                animate={{
                  borderColor: isHovered
                    ? "rgba(var(--accent-rgb), 0.4)"
                    : "rgba(var(--on-surface-rgb), 0.1)",
                  background: isHovered
                    ? "rgba(var(--accent-rgb), 0.1)"
                    : "rgba(var(--on-surface-rgb), 0.03)",
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
                color: isHovered ? "rgba(var(--accent-rgb), 0.5)" : "rgba(var(--on-surface-rgb),var(--text-alpha-faint))",
                transition: "color 0.5s ease",
              }}
            >
              {item.tag}
            </motion.span>
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
              className="text-on-surface/40 text-[12px] leading-[1.6] line-clamp-2"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
            >
              {item.description}
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
