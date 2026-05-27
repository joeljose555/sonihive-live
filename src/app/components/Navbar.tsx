import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "react-router";
import { Menu, X, ChevronDown, Sun, Moon } from "lucide-react";
import logo from "../assets/logo.png";
import { productCategories } from "../data/productCategories";
import { solutionGroups } from "../data/solutions";
import { useTheme } from "../context/ThemeContext";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaProductsOpen, setMegaProductsOpen] = useState(false);
  const [megaSolutionsOpen, setMegaSolutionsOpen] = useState(false);
  const productsMegaTimeout = useRef<ReturnType<typeof setTimeout>>();
  const solutionsMegaTimeout = useRef<ReturnType<typeof setTimeout>>();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleProductsMegaEnter = () => {
    clearTimeout(productsMegaTimeout.current);
    clearTimeout(solutionsMegaTimeout.current);
    setMegaSolutionsOpen(false);
    setMegaProductsOpen(true);
  };
  const handleProductsMegaLeave = () => {
    productsMegaTimeout.current = setTimeout(() => setMegaProductsOpen(false), 200);
  };

  const handleSolutionsMegaEnter = () => {
    clearTimeout(solutionsMegaTimeout.current);
    clearTimeout(productsMegaTimeout.current);
    setMegaProductsOpen(false);
    setMegaSolutionsOpen(true);
  };
  const handleSolutionsMegaLeave = () => {
    solutionsMegaTimeout.current = setTimeout(() => setMegaSolutionsOpen(false), 200);
  };

  const goToProducts = () => {
    setMobileOpen(false);
    setMegaProductsOpen(false);
  };

  const goToSolutions = () => {
    setMobileOpen(false);
    setMegaSolutionsOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-muted/95 dark:bg-surface/90 backdrop-blur-xl shadow-2xl shadow-surface/30 border-b border-on-surface/[0.04]"
            : "bg-muted/85 dark:bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-20">
            <Link to="/" aria-label="Sonic Hive Acoustics home" className="flex items-center gap-3 group cursor-pointer">
              <img
                src={logo}
                alt="Sonic Hive Acoustics"
                className={`h-11 w-auto object-contain object-left group-hover:opacity-90 transition-all duration-300 ${
                  theme === "dark" ? "[filter:brightness(2.2)_contrast(1.05)]" : "[filter:brightness(0.2)_contrast(1.2)]"
                }`}
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              <Link to="/about" className="text-on-surface/70 hover:text-[#DC2626] transition-colors duration-300 text-[14px] tracking-wide" style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}>
                About
              </Link>
              <div onMouseEnter={handleProductsMegaEnter} onMouseLeave={handleProductsMegaLeave} className="relative">
                <button className="text-on-surface/70 hover:text-[#DC2626] transition-colors duration-300 flex items-center gap-1 cursor-pointer text-[14px] tracking-wide" style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}>
                  Products <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${megaProductsOpen ? "rotate-180" : ""}`} />
                </button>
              </div>
              <div onMouseEnter={handleSolutionsMegaEnter} onMouseLeave={handleSolutionsMegaLeave} className="relative">
                <button className="text-on-surface/70 hover:text-[#DC2626] transition-colors duration-300 flex items-center gap-1 cursor-pointer text-[14px] tracking-wide" style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}>
                  Solutions <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${megaSolutionsOpen ? "rotate-180" : ""}`} />
                </button>
              </div>
              <Link to="/industries" className="text-on-surface/70 hover:text-[#DC2626] transition-colors duration-300 text-[14px] tracking-wide" style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}>
                Industries
              </Link>
              <Link to="/why" className="text-on-surface/70 hover:text-[#DC2626] transition-colors duration-300 text-[14px] tracking-wide" style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}>
                Why Us
              </Link>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-on-surface/70 hover:text-on-surface hover:bg-on-surface/5 transition-all duration-300 cursor-pointer"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <Link
                to="/contact"
                className="ml-2 px-6 py-2.5 bg-[#DC2626] text-white rounded-full hover:bg-[#DC2626]/90 transition-all duration-300 hover:shadow-lg hover:shadow-[#DC2626]/20 text-[14px] tracking-wide"
                style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--font-weight-medium)" }}
              >
                Contact Us
              </Link>
            </div>

            {/* Mobile toggle */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-on-surface/70 hover:text-on-surface transition-colors duration-300 cursor-pointer"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="text-on-surface p-2 cursor-pointer">
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Products mega menu */}
        <AnimatePresence>
          {megaProductsOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              onMouseEnter={handleProductsMegaEnter}
              onMouseLeave={handleProductsMegaLeave}
              className="hidden lg:block absolute top-full left-0 right-0 bg-surface-elevated/98 backdrop-blur-2xl border-t border-on-surface/5"
            >
              <div className="max-w-[1400px] mx-auto px-10 py-10">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-on-surface/70 dark:text-on-surface/40 text-[12px] tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}>
                    All Products
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                  {productCategories.map((cat) => (
                    <div key={cat.slug} className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <cat.icon className="w-4 h-4 text-[#DC2626]/80 shrink-0" />
                        <span
                          className="text-on-surface text-[13px] font-medium"
                          style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--font-weight-heading)" }}
                        >
                          {cat.name}
                        </span>
                      </div>
                      <p className="text-on-surface/40 dark:text-on-surface/25 text-[11px] leading-snug mb-3 line-clamp-2" style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}>
                        {cat.description}
                      </p>
                      <div className="flex flex-col gap-1.5">
                        {cat.subProducts?.map((subProduct) => (
                          <Link
                            key={subProduct.slug}
                            to={`/product/${subProduct.slug}`}
                            onClick={() => setMegaProductsOpen(false)}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-on-surface/5 transition-all duration-300 text-left group/item"
                          >
                            <div className="w-10 h-10 rounded-lg bg-on-surface/5 flex items-center justify-center group-hover/item:bg-[#DC2626]/10 transition-colors duration-300 shrink-0 border border-on-surface/[0.06]">
                              <cat.icon className="w-5 h-5 text-on-surface/70 dark:text-on-surface/40 group-hover/item:text-[#DC2626] transition-colors duration-300" />
                            </div>
                            <span className="text-on-surface/70 group-hover/item:text-on-surface transition-colors text-[13px] leading-tight line-clamp-2" style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}>
                              {subProduct.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Solutions mega menu */}
        <AnimatePresence>
          {megaSolutionsOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              onMouseEnter={handleSolutionsMegaEnter}
              onMouseLeave={handleSolutionsMegaLeave}
              className="hidden lg:block absolute top-full left-0 right-0 bg-surface-elevated/98 backdrop-blur-2xl border-t border-on-surface/5 max-h-[min(85vh,720px)] overflow-y-auto"
            >
              <div className="max-w-[1400px] mx-auto px-10 py-10">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-on-surface/70 dark:text-on-surface/40 text-[12px] tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}>
                    Solution areas
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                  {solutionGroups.map((group) => (
                    <div key={group.slug} className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <group.icon className="w-4 h-4 text-[#DC2626]/80 shrink-0" />
                        <span
                          className="text-on-surface text-[13px] font-medium"
                          style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--font-weight-heading)" }}
                        >
                          {group.name}
                        </span>
                      </div>
                      <p className="text-on-surface/40 dark:text-on-surface/25 text-[11px] leading-snug mb-3 line-clamp-2" style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}>
                        {group.description}
                      </p>
                      <div className="flex flex-col gap-1.5">
                        {group.items.map((item) => (
                          <Link
                            key={item.slug}
                            to={`/solutions/${group.slug}/${item.slug}`}
                            onClick={() => setMegaSolutionsOpen(false)}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-on-surface/5 transition-all duration-300 text-left group/item"
                          >
                            <div className="w-10 h-10 rounded-lg bg-on-surface/5 flex items-center justify-center group-hover/item:bg-[#DC2626]/10 transition-colors duration-300 shrink-0 border border-on-surface/[0.06]">
                              <item.icon className="w-5 h-5 text-on-surface/70 dark:text-on-surface/40 group-hover/item:text-[#DC2626] transition-colors duration-300" />
                            </div>
                            <span className="text-on-surface/70 group-hover/item:text-on-surface transition-colors text-[13px] leading-tight line-clamp-2" style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}>
                              {item.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Menu – slides in from right */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-surface-overlay pt-24 px-6 overflow-y-auto lg:hidden"
          >
            <div className="flex flex-col gap-6">
              <Link
                to="/about"
                onClick={() => setMobileOpen(false)}
                className="text-on-surface text-[24px] capitalize text-left hover:text-[#DC2626] transition-colors"
                style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--font-weight-heading)" }}
              >
                About
              </Link>
              <div className="text-on-surface text-[24px] capitalize text-left">
                <span style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--font-weight-heading)" }}>Products</span>
              </div>
              <div className="text-on-surface text-[24px] capitalize text-left">
                <span style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--font-weight-heading)" }}>Solutions</span>
              </div>
              <Link
                to="/industries"
                onClick={() => setMobileOpen(false)}
                className="text-on-surface text-[24px] capitalize text-left hover:text-[#DC2626] transition-colors"
                style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--font-weight-heading)" }}
              >
                Industries
              </Link>
              <Link
                to="/why"
                onClick={() => setMobileOpen(false)}
                className="text-on-surface text-[24px] capitalize text-left hover:text-[#DC2626] transition-colors"
                style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--font-weight-heading)" }}
              >
                Why Us
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="text-on-surface text-[24px] capitalize text-left hover:text-[#DC2626] transition-colors"
                style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--font-weight-heading)" }}
              >
                Contact
              </Link>
              <div className="border-t border-on-surface/10 pt-6 mt-4">
                <p className="text-on-surface/70 dark:text-on-surface/40 text-[12px] mb-4 uppercase tracking-widest" style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}>Products</p>
                <div className="flex flex-col gap-6">
                  {productCategories.map((cat) => (
                    <div key={cat.slug}>
                      <div className="flex items-center gap-2 mb-2">
                        <cat.icon className="w-4 h-4 text-[#DC2626]/70" />
                        <span className="text-on-surface text-[14px] font-semibold" style={{ fontFamily: "var(--font-sans)" }}>{cat.name}</span>
                      </div>
                      <div className="pl-6 flex flex-col gap-1 border-l border-on-surface/10 ml-3">
                        {cat.subProducts?.map((subProduct) => (
                          <Link
                            key={subProduct.slug}
                            to={`/product/${subProduct.slug}`}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-2 text-on-surface/75 dark:text-on-surface/55 text-[13px] py-1 hover:text-[#DC2626] transition-colors"
                            style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
                          >
                            <cat.icon className="w-4 h-4 text-[#DC2626]/50 shrink-0" />
                            {subProduct.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-on-surface/10 pt-6 mt-4">
                <p className="text-on-surface/70 dark:text-on-surface/40 text-[12px] mb-4 uppercase tracking-widest" style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}>Solution areas</p>
                <div className="flex flex-col gap-6">
                  {solutionGroups.map((group) => (
                    <div key={group.slug}>
                      <div className="flex items-center gap-2 mb-2">
                        <group.icon className="w-4 h-4 text-[#DC2626]/70" />
                        <span className="text-on-surface text-[14px] font-semibold" style={{ fontFamily: "var(--font-sans)" }}>{group.name}</span>
                      </div>
                      <div className="pl-6 flex flex-col gap-1 border-l border-on-surface/10 ml-3">
                        {group.items.map((item) => (
                          <Link
                            key={item.slug}
                            to={`/solutions/${group.slug}/${item.slug}`}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-2 text-on-surface/75 dark:text-on-surface/55 text-[13px] py-1 hover:text-[#DC2626] transition-colors"
                            style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
                          >
                            <item.icon className="w-4 h-4 text-[#DC2626]/50 shrink-0" />
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}