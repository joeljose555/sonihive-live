import { useEffect, useRef, useCallback, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { getSolutionItem, getSolutionGalleryEntries } from "../data/solutions";
import { getProductBySlug, type Product } from "../data/products";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ProductCard } from "../components/ProductCard";
import { ContactSection } from "../components/ContactSection";
import { usePageMeta } from "../hooks/usePageMeta";

export function SolutionDetailPage() {
  const { groupSlug, itemSlug } = useParams<{ groupSlug: string; itemSlug: string }>();
  const navigate = useNavigate();
  const resolved = getSolutionItem(groupSlug || "", itemSlug || "");

  usePageMeta(
    resolved
      ? `${resolved.item.name} | ${resolved.group.name} | Sonic Hive Acoustics`
      : "Solutions | Sonic Hive Acoustics",
    resolved?.item.description
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!resolved) {
      navigate("/solutions", { replace: true });
    }
  }, [resolved, navigate]);

  const relatedCatalogProducts = useMemo((): Product[] => {
    if (!resolved) return [];
    const slugs = resolved.item.relatedProductSlugs ?? [];
    const out: Product[] = [];
    for (const slug of slugs) {
      const p = getProductBySlug(slug);
      if (p) out.push(p);
    }
    return out;
  }, [resolved]);

  if (!resolved) {
    return null;
  }

  const { group, item } = resolved;
  const galleryEntries = getSolutionGalleryEntries(item.slug, item.name);

  return (
    <section className="relative bg-surface min-h-screen overflow-hidden">
      <SolutionDetailHero group={group} item={item} />

      <div className="max-w-[800px] mx-auto px-6 lg:px-10 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {item.paragraphs.map((p, i) => (
            <p
              key={i}
              className="text-on-surface/70 dark:text-on-surface/50 text-[15px] md:text-[16px] leading-[1.85]"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
            >
              {p}
            </p>
          ))}
        </motion.div>

        {item.sectionTitles && item.sectionTitles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.04 }}
            className="mt-12 pt-10 border-t border-on-surface/[0.06]"
          >
            <p
              className="text-on-surface/45 dark:text-on-surface/25 text-[12px] tracking-[0.2em] uppercase mb-4"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
            >
              Featured in this solution
            </p>
            <ul
              className="list-disc pl-5 space-y-2 text-on-surface/70 dark:text-on-surface/50 text-[15px] md:text-[16px] leading-[1.6]"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
            >
              {item.sectionTitles.map((title, i) => (
                <li key={`${item.slug}-sec-${i}`}>{title}</li>
              ))}
            </ul>
          </motion.div>
        )}

        {galleryEntries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mt-14 pt-10 border-t border-on-surface/[0.06]"
          >
            <p
              className="text-on-surface/45 dark:text-on-surface/25 text-[12px] tracking-[0.2em] uppercase mb-6"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
            >
              Project gallery
            </p>
            <div className="w-screen max-w-none ml-[calc(50%-50vw)] px-6 lg:px-10">
              <div className="mx-auto w-full max-w-[900px] grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                {galleryEntries.map(({ src, alt }, i) => (
                  <motion.div
                    key={`${item.slug}-g-${i}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.05 * i }}
                    className="relative aspect-[4/3] rounded-xl overflow-hidden border border-on-surface/[0.06] bg-on-surface/[0.02]"
                  >
                    <ImageWithFallback
                      src={src}
                      alt={alt}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {relatedCatalogProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-14 pt-10 border-t border-on-surface/[0.06]"
          >
            <p
              className="text-on-surface/45 dark:text-on-surface/25 text-[12px] tracking-[0.2em] uppercase mb-2"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
            >
              Related products
            </p>
            <p
              className="text-on-surface/55 dark:text-on-surface/35 text-[14px] mb-8 max-w-[560px] leading-[1.6]"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
            >
              From the Sonic Hive catalogue — open a product page for specifications and
              purchasing options.
            </p>
            <div className="w-screen max-w-none ml-[calc(50%-50vw)] px-6 lg:px-10">
              <div className="mx-auto w-full max-w-[1400px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {relatedCatalogProducts.map((p, index) => (
                  <ProductCard
                    key={p.slug}
                    slug={p.slug}
                    name={p.name}
                    image={p.image}
                    tag={p.tag}
                    year={p.year}
                    description={p.headline}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <ContactSection />
    </section>
  );
}

function SolutionDetailHero({
  group,
  item,
}: {
  group: NonNullable<ReturnType<typeof getSolutionItem>>["group"];
  item: NonNullable<ReturnType<typeof getSolutionItem>>["item"];
}) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const opacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const [imgHovered, setImgHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  return (
    <div
      ref={heroRef}
      className="relative min-h-[85vh] md:min-h-[90vh] flex flex-col overflow-hidden"
      style={{ background: "var(--surface)" }}
    >
      <div className="absolute top-[8%] right-[10%] w-[500px] h-[500px] bg-[#DC2626]/[0.03] rounded-full blur-[180px]" />
      <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-[#DC2626]/[0.02] rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 w-full pt-28 md:pt-32 pb-8 flex-1 flex flex-col">
        <motion.div style={{ opacity, y: textY }} className="mb-8">
          <div className="flex items-center gap-2 mb-8 flex-wrap text-[12px] text-on-surface/35">
            <Link to="/" className="hover:text-[#DC2626] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            <Link to="/solutions" className="hover:text-[#DC2626] transition-colors">
              Solutions
            </Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            <Link
              to={`/solutions/${group.slug}`}
              className="hover:text-[#DC2626] transition-colors"
            >
              {group.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            <span className="text-on-surface/55">{item.name}</span>
          </div>

          <Link
            to={`/solutions/${group.slug}`}
            className="inline-flex items-center gap-2 text-on-surface/35 hover:text-[#DC2626] transition-colors text-[13px] group mb-6"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to {group.name}
          </Link>

          <span
            className="text-[#DC2626] text-[11px] md:text-[12px] tracking-[0.3em] uppercase block mb-4"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
          >
            {group.tag}
          </span>
          <h1
            className="text-on-surface leading-[1.05] max-w-[900px]"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: "var(--font-weight-display)",
              fontSize: "clamp(32px, 6vw, 72px)",
            }}
          >
            {item.name}
          </h1>
          <p
            className="mt-6 text-on-surface/45 dark:text-on-surface/30 max-w-[640px] text-[15px] md:text-[17px] leading-[1.7]"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
          >
            {item.description}
          </p>
        </motion.div>

        <motion.div
          className="relative flex-1 min-h-[280px] md:min-h-[380px] rounded-2xl overflow-hidden mt-auto"
          style={{ border: "1px solid rgba(var(--on-surface-rgb),0.06)" }}
          onMouseEnter={() => setImgHovered(true)}
          onMouseLeave={() => setImgHovered(false)}
          onMouseMove={handleMouseMove}
        >
          <div
            className="absolute inset-0 opacity-0 pointer-events-none z-[1] transition-opacity duration-500"
            style={{
              opacity: imgHovered ? 1 : 0,
              background: `radial-gradient(700px circle at ${mousePos.x}% ${mousePos.y}%, rgba(var(--accent-rgb),0.08), transparent 55%)`,
            }}
          />
          <div className="absolute inset-0 z-0">
            <ImageWithFallback
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
              style={{
                filter: "brightness(0.92)",
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.45) 100%)",
              }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
