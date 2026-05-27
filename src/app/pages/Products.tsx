import { useEffect } from "react";
import { ProductCategories } from "../components/ProductCategories";
import { usePageMeta } from "../hooks/usePageMeta";

export function Products() {
  usePageMeta(
    "Acoustic Product Catalog | STC & NRC Rated Solutions | Sonic Hive Acoustics",
    "Browse the Sonic Hive Acoustics collection: silent booths, holographic modules, and G-Series acoustic doors. High-performance materials for professional sound isolation."
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return <ProductCategories />;
}
