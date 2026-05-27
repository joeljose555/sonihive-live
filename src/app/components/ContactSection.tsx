import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useInView } from "./useInView";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Send, MapPin, Phone, Mail } from "lucide-react";
import Asset10 from '../assets/asset_10.jpg';
import Asset2 from '../assets/asset_02.jpg';

export function ContactSection() {
  const { ref, inView } = useInView(0.05);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.1]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: "", email: "", message: "" });
  };

  const officeAddress =
    "Sonic Hive Furniture Trading, Ground Floor, Al Wasl Building, Next to Dubai Mall / Burj Khalifa Metro Station, Exit 2, Sheikh Zayed Road, Dubai, United Arab Emirates";

  const contactItems: {
    icon: typeof MapPin;
    label: string;
    value: string;
    href?: string;
    external?: boolean;
  }[] = [
    {
      icon: MapPin,
      label: "Visit Us",
      value: officeAddress,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(officeAddress)}`,
      external: true,
    },
    {
      icon: Phone,
      label: "Call Us",
      value: "+971585550099",
      href: "tel:+971585550099",
    },
    {
      icon: Mail,
      label: "Email Us",
      value: "info@thesonichive.com",
      href: "mailto:info@thesonichive.com",
    },
  ];

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative bg-surface py-16 md:py-24 overflow-hidden"
    >
      {/* Background parallax image */}
      <motion.div className="absolute inset-0 z-0" style={{ y: bgY, scale: bgScale, willChange: "transform" }}>
        <ImageWithFallback
          src={Asset10}
          alt=""
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.06) saturate(0.4)" }}
        />
      </motion.div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/80 dark:bg-surface/80 z-[1]" />

      {/* Animated grid */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none hidden dark:block"
        style={{
          backgroundImage:
            "linear-gradient(rgba(var(--accent-rgb),0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-rgb),0.015) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Ambient glows (CSS) */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#DC2626]/[0.025] rounded-full blur-[200px] z-[2] pointer-events-none hidden dark:block"
        style={{ animation: "gentlePulse 10s ease-in-out infinite" }}
      />
      <div
        className="absolute bottom-0 right-[10%] w-[400px] h-[400px] bg-[#DC2626]/[0.02] rounded-full blur-[180px] z-[2] pointer-events-none hidden dark:block"
        style={{ animation: "gentlePulse2 12s ease-in-out 4s infinite" }}
      />

      {/* Floating particles (CSS) */}
      {[...Array(5)].map((_, i) => (
        <div
          key={`cp-${i}`}
          className="absolute w-1 h-1 rounded-full bg-[#DC2626]/20 z-[3] hidden dark:block"
          style={{
            left: `${15 + i * 18}%`,
            top: `${25 + (i % 3) * 20}%`,
            animation: `floatParticle ${5 + i * 0.6}s ease-in-out ${i * 0.8}s infinite`,
          }}
        />
      ))}

      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none z-[3] hidden dark:block"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div
        ref={ref}
        className="max-w-[1400px] mx-auto px-6 lg:px-10 relative z-10"
      >
        {/* Header */}
        <div className="mb-16 md:mb-24">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            transition={{ duration: 0.6 }}
            className="text-[#DC2626] text-[11px] tracking-[0.3em] uppercase mb-5 block"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
          >
            Get In Touch
          </motion.span>
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: "0px 0px -100px 0px" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="text-white leading-[1.05]"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: "var(--font-weight-display)",
                fontSize: "clamp(28px, 5vw, 64px)",
              }}
            >
              Let's build your <span className="text-[#DC2626]">perfect sound</span>
            </motion.h2>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 md:gap-24">
          {/* Left: Contact info + image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-between"
          >
            <div>
              <p
                className="text-white/80 text-[16px] md:text-[18px] leading-[1.9] mb-12"
                style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
              >
                Whether you need a single acoustic panel or a full studio
                build-out, our team of acoustic engineers is ready to help you
                create the perfect sound environment.
              </p>

              {/* Inline image */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative rounded-xl overflow-hidden mb-12 group"
                style={{ aspectRatio: "16/9" }}
              >
                <ImageWithFallback
                  src={Asset2}
                  alt="Sonic Hive Acoustics workspace"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1200ms] ease-out"
                  style={{ filter: "brightness(0.45) saturate(0.85)" }}
                />
                <div className="absolute inset-0 dark:bg-gradient-to-t dark:from-surface/70 dark:to-transparent" />
                <div className="absolute inset-0 rounded-xl border border-on-surface/[0.04] group-hover:border-[#DC2626]/15 transition-colors duration-700" />
                <div className="absolute bottom-4 left-4 z-10">
                  <span className="text-white/60 text-[10px] tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}>
                    Sonic Hive Acoustics Design Studio
                  </span>
                </div>
              </motion.div>

              <div className="flex flex-col gap-8">
                {contactItems.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                      className="flex items-start gap-5 group cursor-pointer"
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 group-hover:scale-105"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        <Icon className="w-5 h-5 text-white/40 group-hover:text-[#DC2626] transition-colors duration-500" />
                      </div>
                      <div>
                        <span
                          className="text-white/50 text-[10px] tracking-[0.2em] uppercase block mb-1.5"
                          style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
                        >
                          {item.label}
                        </span>
                        {item.href ? (
                          <a
                            href={item.href}
                            target={item.external ? "_blank" : undefined}
                            rel={item.external ? "noopener noreferrer" : undefined}
                            className="text-white/70 text-[15px] group-hover:text-white/90 transition-colors duration-500 block leading-relaxed hover:underline underline-offset-4 decoration-white/30"
                            style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
                          >
                            {item.value}
                          </a>
                        ) : (
                          <span
                            className="text-white/70 text-[15px] group-hover:text-white/90 transition-colors duration-500 leading-relaxed"
                            style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
                          >
                            {item.value}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Name */}
              <div className="relative">
                <label
                  className="text-[10px] tracking-[0.25em] uppercase block mb-3 transition-colors duration-300"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 500,
                    color: focusedField === "name" ? "#DC2626" : "rgba(255,255,255,0.5)",
                  }}
                >
                  Your Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full bg-transparent border-b border-white/10 pb-4 text-white placeholder-white/30 focus:border-[#DC2626]/30 focus:outline-none transition-all text-[15px]"
                  style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <label
                  className="text-[10px] tracking-[0.25em] uppercase block mb-3 transition-colors duration-300"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 500,
                    color: focusedField === "email" ? "#DC2626" : "rgba(255,255,255,0.5)",
                  }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full bg-transparent border-b border-white/10 pb-4 text-white placeholder-white/30 focus:border-[#DC2626]/30 focus:outline-none transition-all text-[15px]"
                  style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
                  placeholder="john@company.com"
                />
              </div>

              {/* Message */}
              <div className="relative">
                <label
                  className="text-[10px] tracking-[0.25em] uppercase block mb-3 transition-colors duration-300"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 500,
                    color: focusedField === "message" ? "#DC2626" : "rgba(255,255,255,0.5)",
                  }}
                >
                  Your Message
                </label>
                <textarea
                  value={formData.message}
                  onFocus={() => setFocusedField("message")}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={4}
                  className="w-full bg-transparent border-b border-white/10 pb-4 text-white placeholder-white/30 focus:border-[#DC2626]/30 focus:outline-none transition-all resize-none text-[15px]"
                  style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
                  placeholder="Tell us about your project..."
                />
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 0 40px rgba(var(--accent-rgb),0.15)",
                }}
                whileTap={{ scale: 0.98 }}
                className="group w-full py-5 bg-[#DC2626] text-white rounded-xl flex items-center justify-center gap-3 cursor-pointer transition-all duration-300 text-[14px] tracking-wide hover:bg-[#b91c1c]"
                style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--font-weight-medium)" }}
              >
                {submitted ? (
                  "Message Sent!"
                ) : (
                  <>
                    Send Message
                    <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Bottom decorative line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px z-10"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: "linear-gradient(90deg, transparent, rgba(var(--accent-rgb),0.15), transparent)",
        }}
      />
    </section>
  );
}
