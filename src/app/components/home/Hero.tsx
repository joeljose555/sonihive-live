import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDown, Play } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router";
import Asset20 from '../../assets/asset_20.jpg';

export function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "32%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={ref} className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-surface-overlay">
      {/* Background Image with Parallax */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-black/60 z-10" />
        <img 
          src={Asset20} 
          alt="Sound waves abstract" 
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-on-surface leading-tight mb-6">
            Engineering <span className="text-[#F3BC18]">Silence</span>.<br />
            Perfecting Sound.
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.85 }}
          className="text-on-surface/70 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light tracking-wide"
        >
          Premium acoustic solutions for modern workspaces, studios, and industrial environments.
        </motion.p>

        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.45 }}
            className="flex flex-col md:flex-row gap-6 justify-center items-center"
        >
            <Link
              to="/products"
              className="bg-[#F3BC18] text-black px-8 py-4 uppercase tracking-widest font-bold text-sm hover:bg-on-surface transition-colors duration-300"
            >
                Explore Products
            </Link>
            <Link
              to="/about"
              className="flex items-center gap-3 text-on-surface uppercase tracking-widest text-sm hover:text-[#F3BC18] transition-colors group"
            >
                <span className="w-10 h-10 rounded-full border border-on-surface/30 flex items-center justify-center group-hover:border-[#F3BC18] transition-colors">
                    <Play size={14} fill="currentColor" />
                </span>
                Watch Showreel
            </Link>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-on-surface/50 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        <ArrowDown size={20} />
      </motion.div>

      {/* Decorative Lines */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-on-surface/20 to-transparent" />
    </div>
  );
}
