import { useRef, useEffect, useState } from "react";
import { 
  useParams, 
  useNavigate, 
  Link 
} from "react-router";
import { 
  motion, 
  useScroll, 
  useTransform, 
  useInView as useMotionInView 
} from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  Download,
  Package,
  Weight,
  Shield,
  Layers,
  Wrench,
  CheckCircle2,
  Building2,
  Zap,
} from "lucide-react";
import {
  getProductBySlug,
  getAdjacentProducts,
  type Product,
} from "../data/products";
import { getCatalogProductBySlug, getCatalogProductsForSeriesPage } from "../data/catalog";
import { formatCatalogProductTitle } from "../data/catalogDisplay";
import { CatalogProductDetailView } from "../components/product/CatalogProductDetailView";
import { RelatedProductsSection } from "../components/product/RelatedProductsSection";
import { ContactSection } from "../components/ContactSection";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { usePageMeta } from "../hooks/usePageMeta";

/* ────────────────────────────────────────────
   HERO SECTION
   ──────────────────────────────────────────── */
function DetailHero({ product }: { product: Product }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const [imgHovered, setImgHovered] = useState(false);

  return (
    <div
      ref={heroRef}
      className="relative min-h-screen flex items-end overflow-hidden"
      style={{ background: "var(--surface)" }}
    >
      {/* Ambient glows */}
      <div className="absolute top-[8%] right-[10%] w-[600px] h-[600px] bg-[#DC2626]/[0.03] rounded-full blur-[200px]" />
      <div className="absolute bottom-[15%] left-[5%] w-[500px] h-[500px] bg-[#DC2626]/[0.02] rounded-full blur-[150px]" />

      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-[1]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(var(--accent-rgb),0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-rgb),0.01) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 w-full pb-16 md:pb-24 pt-32">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ opacity, y: textY }}
        >
          <div className="flex items-center gap-2 mb-10 md:mb-14">
            <Link
              to="/"
              className="text-on-surface/25 hover:text-[#DC2626] transition-colors duration-300 text-[12px]"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
            >
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-on-surface/15" />
            <Link
              to="/products"
              className="text-on-surface/25 hover:text-[#DC2626] transition-colors duration-300 text-[12px]"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
            >
              Products
            </Link>
            <ChevronRight className="w-3 h-3 text-on-surface/15" />
            <span
              className="text-on-surface/50 text-[12px]"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
            >
              {product.name}
            </span>
          </div>
        </motion.div>

        {/* Hero grid */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Image — tile hugs aspect ratio (no side letterboxing); max height only */}
          <div className="flex justify-center lg:justify-start w-full">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-2xl overflow-hidden w-fit max-w-full bg-[rgba(var(--on-surface-rgb),0.02)]"
              onMouseEnter={() => setImgHovered(true)}
              onMouseLeave={() => setImgHovered(false)}
            >
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="block max-w-full h-auto max-h-[min(550px,78vh)]"
                style={{
                  filter: "brightness(0.88) saturate(0.95)",
                }}
              />

            {/* Light bottom fade for badge legibility only */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-surface/20 to-transparent z-[1] pointer-events-none" />

            {/* Model badge */}
            <div className="absolute top-5 left-5 z-[5]">
              <span
                className="text-[#DC2626] text-[11px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-lg"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: "var(--font-weight-heading)",
                  background: "rgba(var(--accent-rgb),0.08)",
                  border: "1px solid rgba(var(--accent-rgb),0.15)",
                }}
              >
                {product.model}
              </span>
            </div>

            {/* Year badge */}
            <div className="absolute top-5 right-5 z-[5]">
              <span
                className="text-on-surface/30 text-[11px] tracking-[0.15em] px-3 py-1.5 rounded-lg"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 400,
                  background: "rgba(var(--surface-rgb),0.5)",
                  border: "1px solid rgba(var(--on-surface-rgb),0.04)",
                }}
              >
                {product.year}
              </span>
            </div>

            {/* Border + bottom line */}
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
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
            </motion.div>
          </div>

          {/* Text side */}
          <motion.div style={{ opacity, y: textY }}>
            {/* Category tag */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center gap-3 mb-5"
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
                {product.tag}
              </span>
              <span
                className="text-on-surface/20 text-[11px] tracking-[0.15em] uppercase"
                style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
              >
                {product.category}
              </span>
            </motion.div>

            {/* Product name */}
            <div className="overflow-hidden mb-4">
              <motion.h1
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 1,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.5,
                }}
                className="text-on-surface leading-[1.05]"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: "var(--font-weight-display)",
                  fontSize: "clamp(32px, 5vw, 64px)",
                }}
              >
                {product.name}
              </motion.h1>
            </div>

            {/* Headline */}
            <div className="overflow-hidden mb-6">
              <motion.p
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.9,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.6,
                }}
                className="text-[#DC2626]/70 leading-[1.4]"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 500,
                  fontSize: "clamp(16px, 2vw, 22px)",
                }}
              >
                {product.headline}
              </motion.p>
            </div>

            {/* Red accent line */}
            <motion.div
              className="h-[2px] bg-[#DC2626] mb-6 origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ maxWidth: "60px" }}
            />

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="text-on-surface/45 text-[14px] md:text-[15px] leading-[1.9] mb-8 max-w-[520px]"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
            >
              {product.longDescription}
            </motion.p>

            {/* Quick specs pills */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex flex-wrap gap-2 mb-8"
            >
              {product.specs.slice(0, 3).map((spec, i) => (
                <motion.span
                  key={spec.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.95 + i * 0.08 }}
                  className="text-on-surface/40 text-[10px] tracking-[0.1em] uppercase px-3.5 py-1.5 rounded-full"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 500,
                    background: "rgba(var(--on-surface-rgb),0.03)",
                    border: "1px solid rgba(var(--on-surface-rgb),0.06)",
                  }}
                >
                  <span className="text-[#DC2626]/60">{spec.label}:</span>{" "}
                  {spec.value}
                </motion.span>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="flex items-center gap-4"
            >
              <Link
                to="/products"
                className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full text-[12px] tracking-[0.08em] uppercase transition-all duration-300 hover:shadow-lg hover:shadow-[#DC2626]/15 hover:scale-[1.02]"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: "var(--font-weight-medium)",
                  background: "#DC2626",
                  color: "#fff",
                }}
              >
                Request Quote
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </Link>
              <button
                className="group inline-flex items-center gap-2 px-5 py-3.5 rounded-full text-[12px] tracking-[0.08em] uppercase transition-all duration-300 cursor-pointer"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 500,
                  color: "rgba(var(--on-surface-rgb),var(--text-alpha-secondary))",
                  background: "rgba(var(--on-surface-rgb),0.03)",
                  border: "1px solid rgba(var(--on-surface-rgb),0.06)",
                }}
              >
                <Download className="w-3.5 h-3.5" />
                Datasheet
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border border-on-surface/10 flex items-start justify-center p-1.5"
        >
          <div className="w-1 h-1.5 rounded-full bg-[#DC2626]" />
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ────────────────────────────────────────────
   SPECIFICATIONS TABLE
   ──────────────────────────────────────────── */
function SpecificationsSection({ product }: { product: Product }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useMotionInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-32 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, var(--surface) 0%, var(--surface) 50%, var(--surface) 100%)",
      }}
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(var(--accent-rgb),0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-rgb),0.015) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 md:mb-20"
        >
          <span
            className="text-[#DC2626] text-[11px] tracking-[0.3em] uppercase mb-4 block"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
          >
            Technical Specifications
          </span>
          <h2
            className="text-on-surface leading-[1.05]"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: "var(--font-weight-display)",
              fontSize: "clamp(26px, 4vw, 48px)",
            }}
          >
            Product <span className="text-[#DC2626]">Details</span>
          </h2>
        </motion.div>

        {/* Specs table */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left: main specs */}
          <div>
            {/* Basic info rows */}
            {[
              { label: "Product Name", value: product.name },
              { label: "Model", value: product.model },
              ...product.specs,
            ].map((spec, i) => (
              <motion.div
                key={spec.label}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: Math.min(i * 0.08, 0.8),
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="py-5 border-b border-on-surface/[0.04] flex flex-col md:flex-row md:items-baseline gap-1 md:gap-8 group"
              >
                <span
                  className="text-on-surface/30 text-[12px] md:text-[13px] md:w-[200px] shrink-0 tracking-wide group-hover:text-[#DC2626]/60 transition-colors duration-300"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: "var(--font-weight-heading)",
                  }}
                >
                  {spec.label}:
                </span>
                <span
                  className="text-on-surface/60 text-[13px] md:text-[14px] leading-[1.7] group-hover:text-on-surface/80 transition-colors duration-300"
                  style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
                >
                  {spec.value}
                </span>
              </motion.div>
            ))}

            {/* Packaging info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="mt-8 grid grid-cols-3 gap-4"
            >
              {[
                {
                  icon: Package,
                  label: "Packaging",
                  value: product.packaging,
                },
                {
                  icon: Weight,
                  label: "Gross Weight",
                  value: product.grossWeight,
                },
                {
                  icon: Weight,
                  label: "Net Weight",
                  value: product.netWeight,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-4 rounded-xl transition-all duration-300 hover:border-[rgba(220,38,38,0.15)]"
                  style={{
                    background: "rgba(var(--on-surface-rgb),0.02)",
                    border: "1px solid rgba(var(--on-surface-rgb),0.04)",
                  }}
                >
                  <item.icon className="w-4 h-4 text-[#DC2626]/40 mb-2" />
                  <p
                    className="text-on-surface/20 text-[10px] tracking-[0.15em] uppercase mb-1"
                    style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
                  >
                    {item.label}
                  </p>
                  <p
                    className="text-on-surface/60 text-[13px]"
                    style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: gallery images */}
          <div className="flex flex-col gap-6">
            {product.galleryImages.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.7,
                  delay: 0.3 + i * 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative rounded-xl overflow-hidden group w-full bg-[rgba(var(--on-surface-rgb),0.02)]"
                style={{ border: "1px solid rgba(var(--on-surface-rgb),0.04)" }}
              >
                <ImageWithFallback
                  src={img}
                  alt={`${product.name} detail ${i + 1}`}
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
                    duration: 1.2,
                    delay: 0.5 + i * 0.2,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────
   MATERIALS & TECHNOLOGY
   ──────────────────────────────────────────── */
function MaterialsSection({ product }: { product: Product }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useMotionInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-32 overflow-hidden"
      style={{ background: "var(--surface)" }}
    >
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#DC2626]/[0.015] rounded-full blur-[250px] pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 md:mb-20"
        >
          <span
            className="text-[#DC2626] text-[11px] tracking-[0.3em] uppercase mb-4 block"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
          >
            Materials & Technology
          </span>
          <h2
            className="text-on-surface leading-[1.05]"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: "var(--font-weight-display)",
              fontSize: "clamp(26px, 4vw, 48px)",
            }}
          >
            Construction <span className="text-[#DC2626]">Breakdown</span>
          </h2>
        </motion.div>

        {/* Material cards */}
        <div className="flex flex-col gap-8">
          {product.materials.map((mat, i) => (
            <motion.div
              key={mat.name}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: i * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="grid md:grid-cols-[280px_1fr] gap-6 md:gap-10 py-8 border-b border-on-surface/[0.04] group"
            >
              {/* Label */}
              <div className="flex items-start gap-4">
                <motion.div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: "rgba(var(--accent-rgb),0.06)",
                    border: "1px solid rgba(var(--accent-rgb),0.1)",
                  }}
                  whileHover={{
                    background: "rgba(var(--accent-rgb),0.12)",
                    borderColor: "rgba(var(--accent-rgb),0.25)",
                  }}
                >
                  <Layers className="w-4 h-4 text-[#DC2626]/50" />
                </motion.div>
                <div>
                  <h3
                    className="text-on-surface/80 text-[15px] md:text-[16px] leading-[1.4] group-hover:text-on-surface transition-colors duration-300"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: "var(--font-weight-heading)",
                    }}
                  >
                    {mat.name}
                  </h3>
                  <span
                    className="text-[#DC2626]/40 text-[10px] tracking-[0.2em] uppercase mt-1 block"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 500,
                    }}
                  >
                    Layer {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p
                className="text-on-surface/40 text-[13px] md:text-[14px] leading-[1.9] group-hover:text-on-surface/55 transition-colors duration-300"
                style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
              >
                {mat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────
   FEATURES, APPLICATIONS, CERTIFICATIONS
   ──────────────────────────────────────────── */
function FeaturesGrid({ product }: { product: Product }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useMotionInView(sectionRef, { once: true, margin: "-80px" });

  const sections = [
    {
      icon: Zap,
      title: "Key Features",
      items: product.features,
      color: "#DC2626",
    },
    {
      icon: Building2,
      title: "Applications",
      items: product.applications,
      color: "#DC2626",
    },
    {
      icon: Shield,
      title: "Certifications",
      items: product.certifications,
      color: "#DC2626",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-32 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, var(--surface) 0%, var(--surface-elevated) 50%, var(--surface) 100%)",
      }}
    >
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid md:grid-cols-3 gap-8">
          {sections.map((section, si) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: si * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="p-8 rounded-2xl group hover:border-[rgba(220,38,38,0.12)] transition-all duration-500"
              style={{
                background: "rgba(var(--on-surface-rgb),0.015)",
                border: "1px solid rgba(var(--on-surface-rgb),0.04)",
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: "rgba(var(--accent-rgb),0.06)",
                    border: "1px solid rgba(var(--accent-rgb),0.1)",
                  }}
                >
                  <section.icon className="w-4 h-4 text-[#DC2626]/50" />
                </div>
                <h3
                  className="text-on-surface/70 text-[14px] tracking-wide"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: "var(--font-weight-heading)",
                  }}
                >
                  {section.title}
                </h3>
              </div>

              <div className="flex flex-col gap-3">
                {section.items.map((item, ii) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{
                      duration: 0.4,
                      delay: si * 0.15 + ii * 0.06 + 0.3,
                    }}
                    className="flex items-start gap-3 group/item"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#DC2626]/30 mt-0.5 shrink-0 group-hover/item:text-[#DC2626]/60 transition-colors duration-300" />
                    <span
                      className="text-on-surface/40 text-[13px] leading-[1.6] group-hover/item:text-on-surface/60 transition-colors duration-300"
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontWeight: 300,
                      }}
                    >
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────
   PREV / NEXT NAVIGATION
   ──────────────────────────────────────────── */
function ProductNavigation({ slug }: { slug: string }) {
  const { prev, next } = getAdjacentProducts(slug);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useMotionInView(sectionRef, { once: true, margin: "-50px" });

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-24 overflow-hidden"
      style={{ background: "var(--surface)" }}
    >
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-10"
        >
          <span
            className="text-on-surface/20 text-[11px] tracking-[0.2em] uppercase"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
          >
            Continue Exploring
          </span>
          <Link
            to="/products"
            className="text-[#DC2626] text-[12px] tracking-[0.1em] uppercase hover:underline transition-all duration-300"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
          >
            All Products →
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            { product: prev, direction: "Previous", icon: ArrowLeft },
            { product: next, direction: "Next", icon: ArrowRight },
          ].map(
            ({ product: navProduct, direction, icon: Icon }, i) =>
              navProduct && (
                <motion.div
                  key={direction}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.7,
                    delay: i * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link
                    to={`/product/${navProduct.slug}`}
                    className="group relative flex items-center gap-6 p-6 md:p-8 rounded-2xl overflow-hidden transition-all duration-500 hover:border-[rgba(220,38,38,0.15)]"
                    style={{
                      background: "rgba(var(--on-surface-rgb),0.015)",
                      border: "1px solid rgba(var(--on-surface-rgb),0.04)",
                    }}
                  >
                    {/* Bg image */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center bg-[rgba(var(--on-surface-rgb),0.92)] dark:bg-black/85">
                      <ImageWithFallback
                        src={navProduct.image}
                        alt={navProduct.name}
                        className="w-full h-full max-h-full object-contain object-center p-4 md:p-6"
                        style={{
                          filter: "brightness(0.2) saturate(0.55)",
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex items-center gap-5 w-full">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[rgba(220,38,38,0.12)] group-hover:border-[rgba(220,38,38,0.2)] transition-all duration-300"
                        style={{
                          background: "rgba(var(--on-surface-rgb),0.03)",
                          border: "1px solid rgba(var(--on-surface-rgb),0.06)",
                        }}
                      >
                        <Icon className="w-5 h-5 text-on-surface/30 group-hover:text-[#DC2626] transition-colors duration-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-on-surface/20 text-[10px] tracking-[0.2em] uppercase mb-1"
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontWeight: 500,
                          }}
                        >
                          {direction} Product
                        </p>
                        <h4
                          className="text-on-surface/70 group-hover:text-on-surface transition-colors duration-300 truncate"
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontWeight: "var(--font-weight-heading)",
                            fontSize: "clamp(16px, 2vw, 22px)",
                          }}
                        >
                          {navProduct.name}
                        </h4>
                      </div>
                    </div>

                    {/* Bottom accent */}
                    <motion.div
                      className="absolute bottom-0 left-0 h-[2px] bg-[#DC2626]"
                      initial={{ width: "0%" }}
                      whileHover={{ width: "100%" }}
                      transition={{
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    />
                  </Link>
                </motion.div>
              )
          )}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ════════════════════════════════════════════ */
export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const catalogEntry = slug ? getCatalogProductBySlug(slug) : undefined;
  const product =
    slug && !catalogEntry ? getProductBySlug(slug) : undefined;

  const seriesCatalogModels =
    product && slug ? getCatalogProductsForSeriesPage(slug) : [];

  const metaTitle = catalogEntry
    ? `${formatCatalogProductTitle(catalogEntry.product.title)} | Sonic Hive Acoustics`
    : product
      ? `${product.name} | Sonic Hive Acoustics`
      : "Product | Sonic Hive Acoustics";

  const metaDesc = catalogEntry
    ? catalogEntry.product.sections.find(
        (s): s is { type: "p"; text: string } =>
          s.type === "p" && Boolean(s.text?.trim())
      )?.text
    : product?.description;

  usePageMeta(metaTitle, metaDesc);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!catalogEntry && !product) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <h1
            className="text-on-surface text-[32px] mb-4"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: "var(--font-weight-display)",
            }}
          >
            Product Not Found
          </h1>
          <p
            className="text-on-surface/40 text-[14px] mb-8"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
          >
            The product you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="px-6 py-3 bg-[#DC2626] text-white rounded-full text-[13px] cursor-pointer"
            style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--font-weight-medium)" }}
          >
            View All Products
          </button>
        </div>
      </div>
    );
  }

  if (catalogEntry) {
    return (
      <>
        <CatalogProductDetailView
          group={catalogEntry.group}
          product={catalogEntry.product}
        />
        <RelatedProductsSection
          items={catalogEntry.group.relatedproducts}
          currentSlug={slug}
        />
        <ContactSection />
      </>
    );
  }

  return (
    <div className="bg-surface">
      <DetailHero product={product!} />
      <SpecificationsSection product={product!} />
      <MaterialsSection product={product!} />
      <FeaturesGrid product={product!} />
      {seriesCatalogModels.length > 0 ? (
        <RelatedProductsSection items={seriesCatalogModels} />
      ) : null}
      <ProductNavigation slug={product!.slug} />
      <ContactSection />
    </div>
  );
}