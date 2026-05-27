import { useEffect } from "react";
import { AboutSection } from "../components/AboutSection";
import { usePageMeta } from "../hooks/usePageMeta";

export function AboutPage() {
  usePageMeta(
    "Our Legacy in Silence | The Science & Innovation of Sonic Hive Acoustics",
    "Since 2002, Sonic Hive Acoustics has bridged the gap between psychoacoustics and interior design. Learn about our private reverberation labs and our mission to master the science of silence."
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return <AboutSection />;
}
