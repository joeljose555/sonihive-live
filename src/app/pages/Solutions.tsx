import { useEffect } from "react";
import { SolutionCategories } from "../components/SolutionCategories";
import { usePageMeta } from "../hooks/usePageMeta";

export function Solutions() {
  usePageMeta(
    "Acoustic Solutions by Application | Sonic Hive Acoustics",
    "Architectural, industrial, and environmental noise solutions — from homes and venues to rail, marine, and infrastructure."
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return <SolutionCategories />;
}
