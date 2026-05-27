import { useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { getCategoryBySlug } from "../data/productCategories";
import { ProductCard } from "../components/ProductCard";
import { usePageMeta } from "../hooks/usePageMeta";

export function CategorySubProducts() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const navigate = useNavigate();
  const category = getCategoryBySlug(categorySlug || "");

  usePageMeta(
    category
      ? `${category.name} | Sonic Hive Acoustics`
      : "Products | Sonic Hive Acoustics",
    category?.description
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // If category doesn't exist, it might be an individual product
    if (!category) {
      // Try to load it as a product detail page instead
      navigate(`/product/${categorySlug}`, { replace: true });
      return;
    }
    
    // If category has no subproducts, redirect to product detail
    if (!category.subProducts || category.subProducts.length === 0) {
      navigate(`/product/${categorySlug}`, { replace: true });
    }
  }, [category, categorySlug, navigate]);

  if (!category || !category.subProducts || category.subProducts.length === 0) {
    return null;
  }

  const Icon = category.icon;

  return (
    <section className="relative bg-surface min-h-screen overflow-hidden">
      {/* Hero Section */}
      <CategoryHero category={category} Icon={Icon} />

      {/* Sub-products Grid */}
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
            {category.subProducts.length} Available Products
          </span>
        </motion.div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {category.subProducts.map((subProduct, index) => (
            <ProductCard
              key={subProduct.slug + index}
              slug={subProduct.slug}
              name={subProduct.name}
              image={subProduct.image}
              tag={subProduct.tag}
              year={subProduct.year}
              description={subProduct.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Hero Component ─── */
function CategoryHero({ category, Icon }: { category: any; Icon: any }) {
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
      {/* Grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Ambient glows */}
      <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] bg-[#DC2626]/[0.03] rounded-full blur-[200px]" />
      <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-[#DC2626]/[0.02] rounded-full blur-[150px]" />

      <motion.div
        style={{ y: yText, opacity }}
        className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 pb-16 md:pb-24 w-full"
      >
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-on-surface/30 hover:text-[#DC2626] transition-all duration-300 mb-12 md:mb-16 text-[13px] group"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to All Products
          </Link>
        </motion.div>

        {/* Category Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#DC2626]/10 flex items-center justify-center mb-8 border border-[#DC2626]/20"
        >
          <Icon className="w-8 h-8 md:w-10 md:h-10 text-[#DC2626]" />
        </motion.div>

        {/* Subtitle */}
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
              Product Category — {category.tag}
            </span>
          </motion.div>
        </div>

        {/* Category Name */}
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
            {category.name}
          </motion.h1>
        </div>

        {/* Description */}
        <div className="overflow-hidden mt-6 md:mt-8">
          <motion.p
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.7 }}
            className="text-on-surface/30 max-w-[600px] text-[14px] md:text-[16px] leading-[1.8]"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
          >
            {category.description}
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}