import { useRef } from "react";
import { motion, useInView as useMotionInView } from "motion/react";
import { ProductCard } from "../ProductCard";
import type { CatalogProduct } from "../../data/catalog";
import {
  formatCatalogProductTitle,
  getCatalogCardDescription,
  getCatalogCardImage,
} from "../../data/catalogDisplay";

export function RelatedProductsSection({
  items,
  currentSlug,
}: {
  items: CatalogProduct[];
  currentSlug?: string;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useMotionInView(sectionRef, { once: true, margin: "-60px" });

  const list = currentSlug
    ? items.filter((p) => p.slug !== currentSlug)
    : items;

  if (list.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-28 overflow-hidden"
      style={{ background: "var(--surface)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(var(--accent-rgb),0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-rgb),0.012) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 md:mb-16"
        >
          <span
            className="text-[#DC2626] text-[11px] tracking-[0.3em] uppercase mb-4 block"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
          >
            Explore more
          </span>
          <h2
            className="text-on-surface leading-[1.05]"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: "var(--font-weight-display)",
              fontSize: "clamp(26px, 4vw, 48px)",
            }}
          >
            Related <span className="text-[#DC2626]">products</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((p, index) => (
            <ProductCard
              key={p.slug}
              slug={p.slug}
              name={formatCatalogProductTitle(p.title)}
              image={getCatalogCardImage(p)}
              tag="Model"
              description={getCatalogCardDescription(p)}
              index={index}
              imageObjectFit="contain"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
