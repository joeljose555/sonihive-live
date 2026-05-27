import { useRef, useState } from "react";
import { Link } from "react-router";
import {
  motion,
  useScroll,
  useTransform,
  useInView as useMotionInView,
} from "motion/react";
import { ChevronRight } from "lucide-react";
import type { CatalogGroup, CatalogProduct, CatalogSection } from "../../data/catalog";
import {
  filterCatalogSections,
  getCatalogContextForSubcategory,
  getCatalogGalleryImages,
  getHeroImageUrl,
} from "../../data/catalog";
import {
  catalogCategoryLabel,
  catalogHeadlineFromSections,
  catalogTaglineFromSections,
  formatCatalogProductTitle,
} from "../../data/catalogDisplay";
import { ImageWithFallback } from "../figma/ImageWithFallback";

function CatalogSectionsBody({ sections }: { sections: CatalogSection[] }) {
  const filtered = filterCatalogSections(sections);
  return (
    <div className="space-y-5 md:space-y-6 max-w-[820px]">
      {filtered.map((s, i) => {
        if (s.type === "h2") {
          return (
            <h2
              key={i}
              className="text-on-surface/90 leading-[1.15] pt-4 first:pt-0"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: "var(--font-weight-heading)",
                fontSize: "clamp(20px, 2.5vw, 28px)",
              }}
            >
              {s.text}
            </h2>
          );
        }
        if (s.type === "p") {
          return (
            <p
              key={i}
              className="text-on-surface/45 text-[14px] md:text-[15px] leading-[1.85]"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
            >
              {s.text}
            </p>
          );
        }
        if (s.type === "ul") {
          return (
            <ul
              key={i}
              className="list-disc pl-5 space-y-2 text-on-surface/45 text-[14px] md:text-[15px] leading-[1.75]"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
            >
              {s.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          );
        }
        return null;
      })}
    </div>
  );
}

export function CatalogProductDetailView({
  group,
  product,
}: {
  group: CatalogGroup;
  product: CatalogProduct;
}) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const opacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const [imgHovered, setImgHovered] = useState(false);

  const ctx = getCatalogContextForSubcategory(group.subcategory);
  const heroUrl = getHeroImageUrl(product);
  const displayName = formatCatalogProductTitle(product.title);
  const headline = catalogHeadlineFromSections(product);
  const tagline = catalogTaglineFromSections(product);
  const categoryLabel = catalogCategoryLabel(group);
  const gallery = getCatalogGalleryImages(product);
  const specRows = product.specs.filter((r) => {
    const v = String((r as { value?: string }).value ?? "").trim();
    return v.length > 0;
  });

  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useMotionInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <div className="bg-surface">
      <div
        ref={heroRef}
        className="relative min-h-screen flex items-end overflow-hidden"
        style={{ background: "var(--surface)" }}
      >
        <div className="absolute top-[8%] right-[10%] w-[600px] h-[600px] bg-[#DC2626]/[0.03] rounded-full blur-[200px]" />
        <div className="absolute bottom-[15%] left-[5%] w-[500px] h-[500px] bg-[#DC2626]/[0.02] rounded-full blur-[150px]" />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none z-[1]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(var(--accent-rgb),0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-rgb),0.01) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 w-full pb-16 md:pb-24 pt-32">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            style={{ opacity, y: textY }}
          >
            <div className="flex flex-wrap items-center gap-2 mb-10 md:mb-14">
              <Link
                to="/"
                className="text-on-surface/25 hover:text-[#DC2626] transition-colors duration-300 text-[12px]"
                style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
              >
                Home
              </Link>
              <ChevronRight className="w-3 h-3 text-on-surface/15 shrink-0" />
              <Link
                to="/products"
                className="text-on-surface/25 hover:text-[#DC2626] transition-colors duration-300 text-[12px]"
                style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
              >
                Products
              </Link>
              {ctx ? (
                <>
                  <ChevronRight className="w-3 h-3 text-on-surface/15 shrink-0" />
                  <Link
                    to={`/products/${ctx.parent}`}
                    className="text-on-surface/25 hover:text-[#DC2626] transition-colors duration-300 text-[12px]"
                    style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
                  >
                    {ctx.parent.replace(/-/g, " ")}
                  </Link>
                  <ChevronRight className="w-3 h-3 text-on-surface/15 shrink-0" />
                  <Link
                    to={`/product/${ctx.sub}`}
                    className="text-on-surface/25 hover:text-[#DC2626] transition-colors duration-300 text-[12px]"
                    style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
                  >
                    {ctx.sub.replace(/-/g, " ")}
                  </Link>
                </>
              ) : null}
              <ChevronRight className="w-3 h-3 text-on-surface/15 shrink-0" />
              <span
                className="text-on-surface/50 text-[12px]"
                style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
              >
                {displayName}
              </span>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div className="flex justify-center lg:justify-start w-full">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="relative rounded-2xl overflow-hidden w-fit max-w-full bg-[rgba(var(--on-surface-rgb),0.02)] min-h-[120px]"
                onMouseEnter={() => setImgHovered(true)}
                onMouseLeave={() => setImgHovered(false)}
              >
                {heroUrl ? (
                  <ImageWithFallback
                    src={heroUrl}
                    alt={displayName}
                    className="block max-w-full h-auto max-h-[min(560px,78vh)]"
                    style={{
                      filter: "brightness(0.88) saturate(0.95)",
                    }}
                  />
                ) : null}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-surface/20 to-transparent z-[1] pointer-events-none" />
                <div
                  className="absolute inset-0 rounded-2xl z-[3] pointer-events-none transition-all duration-700"
                  style={{
                    border: imgHovered
                      ? "1px solid rgba(var(--accent-rgb),0.2)"
                      : "1px solid rgba(var(--on-surface-rgb),0.04)",
                  }}
                />
                <motion.div
                  className="absolute bottom-0 left-0 h-[2px] bg-[#DC2626] z-[6]"
                  animate={{ width: imgHovered ? "100%" : "0%" }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                />
              </motion.div>
            </div>

            <motion.div style={{ opacity, y: textY }}>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.35 }}
                className="flex flex-wrap items-center gap-3 mb-5"
              >
                <span
                  className="text-[#DC2626] text-[10px] tracking-[0.25em] uppercase px-3 py-1.5 rounded-full"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 500,
                    background: "rgba(var(--accent-rgb),0.06)",
                    border: "1px solid rgba(var(--accent-rgb),0.12)",
                  }}
                >
                  {group.subcategory.replace(/-/g, " ")}
                </span>
                <span
                  className="text-on-surface/20 text-[11px] tracking-[0.15em] uppercase"
                  style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
                >
                  {categoryLabel}
                </span>
              </motion.div>

              <div className="overflow-hidden mb-4">
                <motion.h1
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.95,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.45,
                  }}
                  className="text-on-surface leading-[1.05]"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: "var(--font-weight-display)",
                    fontSize: "clamp(32px, 5vw, 56px)",
                  }}
                >
                  {displayName}
                </motion.h1>
              </div>

              {headline !== displayName ? (
                <div className="overflow-hidden mb-6">
                  <motion.p
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 0.85,
                      ease: [0.22, 1, 0.36, 1],
                      delay: 0.52,
                    }}
                    className="text-[#DC2626]/75 leading-[1.35]"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 500,
                      fontSize: "clamp(15px, 1.8vw, 20px)",
                    }}
                  >
                    {headline}
                  </motion.p>
                </div>
              ) : null}

              <motion.div
                className="h-[2px] bg-[#DC2626] mb-6 origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: 0.75,
                  delay: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ maxWidth: "56px" }}
              />

              {tagline ? (
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.68 }}
                  className="text-on-surface/45 text-[14px] md:text-[15px] leading-[1.9] mb-8 max-w-[540px]"
                  style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
                >
                  {tagline}
                </motion.p>
              ) : null}

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.78 }}
              >
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full text-[12px] tracking-[0.08em] uppercase transition-all duration-300 hover:shadow-lg hover:shadow-[#DC2626]/15 hover:scale-[1.02]"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: "var(--font-weight-medium)",
                    background: "#DC2626",
                    color: "#fff",
                  }}
                >
                  Request quote
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      <section
        ref={sectionRef}
        className="relative py-20 md:py-32 overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, var(--surface) 0%, var(--surface) 50%, var(--surface) 100%)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(var(--accent-rgb),0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-rgb),0.015) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12 md:mb-16"
          >
            <span
              className="text-[#DC2626] text-[11px] tracking-[0.3em] uppercase mb-4 block"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
            >
              Product overview
            </span>
            <h2
              className="text-on-surface leading-[1.05]"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: "var(--font-weight-display)",
                fontSize: "clamp(24px, 3.5vw, 42px)",
              }}
            >
              Details <span className="text-[#DC2626]">&amp; gallery</span>
            </h2>
          </motion.div>

          <div
            className={
              specRows.length > 0
                ? "grid lg:grid-cols-2 gap-12 lg:gap-20"
                : "grid grid-cols-1"
            }
          >
            <div>
              <CatalogSectionsBody sections={product.sections} />
              {specRows.length > 0 ? (
                <div className="mt-12 pt-10 border-t border-on-surface/[0.06]">
                  <h3
                    className="text-on-surface/80 text-[14px] mb-6"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: "var(--font-weight-heading)",
                    }}
                  >
                    Specifications
                  </h3>
                  {specRows.map((row, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{
                        duration: 0.5,
                        delay: Math.min(i * 0.06, 0.5),
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="py-4 border-b border-on-surface/[0.04] flex flex-col md:flex-row md:items-baseline gap-1 md:gap-8"
                    >
                      {row.label ? (
                        <span
                          className="text-on-surface/30 text-[12px] md:w-[180px] shrink-0 tracking-wide"
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontWeight: "var(--font-weight-heading)",
                          }}
                        >
                          {row.label}:
                        </span>
                      ) : null}
                      <span
                        className="text-on-surface/60 text-[13px] md:text-[14px] leading-[1.65]"
                        style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
                      >
                        {String((row as { value?: string }).value ?? "")}
                      </span>
                    </motion.div>
                  ))}
                </div>
              ) : null}
            </div>

            {gallery.length > 0 ? (
              <div className="flex flex-col gap-6">
                {gallery.map((img, i) => (
                  <motion.div
                    key={`${img.url}-${i}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{
                      duration: 0.7,
                      delay: 0.2 + i * 0.12,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="relative rounded-xl overflow-hidden group w-full bg-[rgba(var(--on-surface-rgb),0.02)]"
                    style={{ border: "1px solid rgba(var(--on-surface-rgb),0.04)" }}
                  >
                    <ImageWithFallback
                      src={img.url}
                      alt={img.alt}
                      className="block w-full h-auto max-h-[min(480px,72vh)]"
                      style={{ filter: "brightness(0.88) saturate(0.95)" }}
                    />
                    <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-surface/20 to-transparent pointer-events-none" />
                    <motion.div
                      className="absolute bottom-0 left-0 h-[2px] bg-[#DC2626]"
                      initial={{ width: "0%" }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 1,
                        delay: 0.35 + i * 0.15,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
