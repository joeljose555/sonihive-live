import { useEffect } from "react";
import { usePageMeta } from "../hooks/usePageMeta";
import { HeroSection } from "../components/HeroSection";
import { AboutSection } from "../components/AboutSection";
import { ShowcaseReel } from "../components/ShowcaseReel";
import { FeaturedProducts } from "../components/FeaturedProducts";
import { IndustriesSection } from "../components/IndustriesSection";
import { WhySonicBox } from "../components/WhySonicBox";
import { ContactSection } from "../components/ContactSection";
import {
  SectionDivider,
  StatementSection,
} from "../components/SectionDivider";

export function Home() {
  usePageMeta(
    "Sonic Hive Acoustics | Global Leaders in Architectural Silence & Acoustic Engineering",
    "Discover laboratory-certified acoustic solutions. From flagship silent booths to patented soundproof doors, Sonic Hive Acoustics engineers tranquility for the world's most visionary brands."
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <HeroSection />
      <StatementSection />
      <AboutSection showTopImageStrip={false} showBottomImageStrip={false} />
      <SectionDivider
        text="ENGINEERING SILENCE"
        direction="left"
        height="compact"
      />
      <ShowcaseReel />
      <SectionDivider
        text="ACOUSTIC PERFECTION"
        direction="right"
        height="compact"
      />
      <FeaturedProducts />
      <SectionDivider
        text="SONIC HIVE INDUSTRIES"
        direction="left"
        height="compact"
      />
      <IndustriesSection variant="home" />
      <SectionDivider
        text="PRECISION CRAFTED"
        direction="right"
        height="compact"
      />
      {/* <WhySonicBox /> */}
      {/* <SectionDivider
        text="GET IN TOUCH"
        direction="left"
        height="compact"
      /> */}
      <ContactSection />
    </>
  );
}
