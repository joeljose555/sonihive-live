import { useEffect } from "react";
import { IndustriesSection } from "../components/IndustriesSection";
import { usePageMeta } from "../hooks/usePageMeta";

export function IndustriesPage() {
  usePageMeta(
    "Acoustic Engineering for Every Sector | Corporate, Studio, & Industrial | Sonic Hive Acoustics",
    "Tailored sound solutions for every environment. Discover how Sonic Hive Acoustics provides acoustic excellence for Fortune 500 offices, Grammy-winning studios, and luxury automotive NVH."
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return <IndustriesSection variant="page" />;
}
