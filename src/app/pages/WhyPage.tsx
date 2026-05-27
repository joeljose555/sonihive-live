import { useEffect } from "react";
import { WhySonicBox } from "../components/WhySonicBox";
import { usePageMeta } from "../hooks/usePageMeta";

export function WhyPage() {
  usePageMeta(
    "The Sonic Hive Acoustics Advantage | Laboratory Verified Performance",
    "Why top architects choose Sonic Hive Acoustics. Explore our 47-point quality checks, patented magnetic seal technologies, and our commitment to E0-grade sustainable materials."
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return <WhySonicBox />;
}
