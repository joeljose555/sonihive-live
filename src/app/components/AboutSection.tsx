import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
// ParallaxImageStrip now uses CSS animations instead of Framer Motion
import { ImageWithFallback } from "./figma/ImageWithFallback";
import Asset1 from '../assets/asset_01.jpg';
import Asset2 from '../assets/asset_02.jpg';
import Asset3 from '../assets/asset_03.jpg';
import Asset4 from '../assets/asset_04.jpg';
import Asset5 from '../assets/asset_05.jpg';
import Asset6 from '../assets/asset_06.jpg';
import Asset7 from '../assets/asset_07.jpg';
import Asset8 from '../assets/asset_08.jpg';
import HomeAboutBanner1 from "../assets/homeaboutbanner1.jpeg";
import HomeAboutBanner2 from "../assets/homeaboutbanner2.jpg";

/* Image strip via CSS marquee animation (reduced from 3x to 2x duplication) */
function ParallaxImageStrip({
  images,
  direction = "left",
  speed = 40,
}: {
  images: { src: string; alt: string }[];
  direction?: "left" | "right";
  speed?: number;
}) {
  const animName = direction === "left" ? "marqueeScrollLeft" : "marqueeScrollRight";
  return (
    <div className="overflow-hidden py-4">
      <div
        className="flex gap-4 will-change-transform"
        style={{ animation: `${animName} ${speed}s linear infinite` }}
      >
        {[...images, ...images].map((img, i) => (
          <div
            key={i}
            className="relative shrink-0 w-[280px] h-[180px] md:w-[360px] md:h-[220px] rounded-xl overflow-hidden group"
          >
            <ImageWithFallback
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              style={{ filter: "brightness(0.7) saturate(0.9)" }}
            />
            <div className="absolute inset-0 dark:bg-gradient-to-t dark:from-surface/40 dark:to-transparent" />
            <div className="absolute inset-0 border border-on-surface/[0.04] rounded-xl group-hover:border-[#DC2626]/20 transition-colors duration-500" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AboutSection({
  showTopImageStrip = true,
  showBottomImageStrip = true,
}: {
  /** When false, hides the top marquee image strip (e.g. on Home where it sits under the hero). About page keeps the default true. */
  showTopImageStrip?: boolean;
  /** When false, hides the bottom marquee image strip (e.g. on Home where it sits under the hero). About page keeps the default true. */
  showBottomImageStrip?: boolean;
} = {}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const yImg = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  const yText = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  const stripImages1 = [
    { src: Asset1, alt: "Recording studio" },
    { src: Asset2, alt: "Modern architecture" },
    { src: Asset3, alt: "Luxury office" },
    { src: Asset4, alt: "Concert speakers" },
  ];

  const stripImages2 = [
    { src: Asset5, alt: "Acoustic foam" },
    { src: Asset6, alt: "Recording console" },
    { src: Asset7, alt: "Industrial workshop" },
    { src: Asset8, alt: "Dark tunnel" },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative bg-surface overflow-hidden"
    >
      {/* Static watermark text */}
      <div className="hidden dark:flex absolute inset-0 items-center justify-center pointer-events-none overflow-hidden opacity-[0.025]">
        <span
          className="text-on-surface whitespace-nowrap select-none"
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: "var(--font-weight-display)",
            fontSize: "clamp(120px, 18vw, 280px)",
            lineHeight: 1,
          }}
        >
          SONIC HIVE
        </span>
      </div>

      {/* Ambient glows (CSS) */}
      <div
        className="hidden dark:block absolute top-[20%] right-0 w-[500px] h-[500px] bg-[#DC2626]/[0.02] rounded-full blur-[200px]"
        style={{ animation: "gentlePulse 10s ease-in-out infinite" }}
      />
      <div
        className="hidden dark:block absolute bottom-[30%] left-[5%] w-[400px] h-[400px] bg-[#DC2626]/[0.015] rounded-full blur-[180px]"
        style={{ animation: "gentlePulse2 12s ease-in-out 1s infinite" }}
      />

      {showTopImageStrip && (
        <div className="border-b border-on-surface/[0.04] py-6 md:py-10">
          <ParallaxImageStrip images={stripImages1} direction="left" speed={50} />
        </div>
      )}

      {/* Editorial about section */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 md:py-24">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-24"
        >
          <span
            className="text-[#DC2626] text-[11px] tracking-[0.3em] uppercase"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
          >
            About Sonic Hive Acoustics
          </span>
        </motion.div>

        {/* Large editorial heading */}
        <div className="grid lg:grid-cols-12 gap-8 md:gap-16 mb-20 md:mb-32">
          <div className="lg:col-span-8">
            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="text-on-surface leading-[1.05]"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: "var(--font-weight-display)",
                  fontSize: "clamp(30px, 5vw, 64px)",
                }}
              >
                Founded in Hong Kong in{" "}
                <span className="text-[#DC2626]">2002</span> — mastering the
                science of silence where precision meets tranquility.
              </motion.h2>
            </div>
          </div>
          <motion.div
            className="lg:col-span-4 flex items-end"
            style={{ y: yText, willChange: "transform" }}
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-on-surface/55 dark:text-on-surface/30 text-[14px] md:text-[15px] leading-[1.9]"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
            >
              Engineering the world&apos;s most advanced acoustic environments —
              from high-tech office pods to professional recording sanctuaries —
              with psychoacoustics and physiological engineering at the core.
            </motion.p>
          </motion.div>
        </div>

        {/* Dual cinematic images with parallax */}
        <div className="grid md:grid-cols-2 gap-5 md:gap-6 mb-20 md:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-2xl overflow-hidden group"
            style={{ aspectRatio: "4/3" }}
          >
            <motion.div className="absolute inset-0" style={{ y: yImg, scale: bgScale, willChange: "transform" }}>
              <ImageWithFallback
              src={HomeAboutBanner1}
              alt="Corporate acoustic environment — conference and collaboration"
              className="w-full h-[115%] object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
              />
            </motion.div>
            <div className="absolute inset-0 dark:bg-gradient-to-r dark:from-surface/40 dark:to-transparent" />
            <div className="absolute inset-0 dark:bg-gradient-to-t dark:from-surface/40 dark:to-transparent" />
            {/* Shine sweep on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{
                background: "linear-gradient(105deg, transparent 40%, rgba(var(--on-surface-rgb),0.03) 45%, rgba(var(--on-surface-rgb),0.06) 50%, rgba(var(--on-surface-rgb),0.03) 55%, transparent 60%)",
              }}
            />
            <div className="absolute bottom-6 md:bottom-8 left-6 md:left-8 z-10">
              {/* <span className="text-on-surface/80 dark:text-on-surface/55 text-[11px] tracking-[0.2em] uppercase block mb-2" style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}>
                Sonic Hive Acoustics — Sound Lab
              </span> */}
              {/* <span className="text-on-surface text-[16px] md:text-[20px]" style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--font-weight-heading)" }}>
                Where every decibel matters
              </span> */}
            </div>
            <div className="absolute inset-0 rounded-2xl border border-on-surface/[0.04] group-hover:border-[#DC2626]/15 transition-colors duration-700" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-2xl overflow-hidden group"
            style={{ aspectRatio: "4/3" }}
          >
            <motion.div className="absolute inset-0" style={{ scale: bgScale, willChange: "transform" }}>
              <ImageWithFallback
              src={HomeAboutBanner2}
              alt="Educational space with acoustic wall panels"
              className="w-full h-[115%] object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
              />
            </motion.div>
            <div className="absolute inset-0 dark:bg-gradient-to-l dark:from-surface/40 dark:to-transparent" />
            <div className="absolute inset-0 dark:bg-gradient-to-t dark:from-surface/40 dark:to-transparent" />
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{
                background: "linear-gradient(105deg, transparent 40%, rgba(var(--on-surface-rgb),0.03) 45%, rgba(var(--on-surface-rgb),0.06) 50%, rgba(var(--on-surface-rgb),0.03) 55%, transparent 60%)",
              }}
            />
            <div className="absolute bottom-6 md:bottom-8 left-6 md:left-8 z-10">
              {/* <span className="text-on-surface/80 dark:text-on-surface/55 text-[11px] tracking-[0.2em] uppercase block mb-2" style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}>
                Precision Engineering
              </span>
              <span className="text-on-surface text-[16px] md:text-[20px]" style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--font-weight-heading)" }}>
                Studio-grade craftsmanship
              </span> */}
            </div>
            <div className="absolute inset-0 rounded-2xl border border-on-surface/[0.04] group-hover:border-[#DC2626]/15 transition-colors duration-700" />
          </motion.div>
        </div>

        {/* Bottom text block */}
        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: " 0px 0px -100px 0px" }}
            transition={{ duration: 0.7 }}
          >
            <p
              className="text-on-surface/85 dark:text-on-surface/60 text-[16px] md:text-[18px] leading-[1.9]"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
            >
              Sonic Hive Acoustics is a global leader in premium acoustic solutions,
              combining cutting-edge carbon polymer technology with refined
              architectural design.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: " 0px 0px -100px 0px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <p
              className="text-on-surface/70 dark:text-on-surface/45 text-[15px] leading-[1.9]"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
            >
              Our partnerships with Fortune 500 companies, world-class
              recording studios, and leading architectural firms worldwide
              reflect over two decades of unwavering commitment to acoustic
              perfection and innovation.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Auto-scrolling image strip 2 (reverse direction) */}
      {showBottomImageStrip && (
        <div className="border-t border-on-surface/[0.04] py-6 md:py-10">
          <ParallaxImageStrip images={stripImages2} direction="right" speed={55} />
        </div>
      )}
    </section>
  );
}
