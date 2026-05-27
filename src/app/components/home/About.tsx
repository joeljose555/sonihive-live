import { motion, useInView } from "motion/react";
import { useRef, useEffect, useState } from "react";
import Asset16 from '../../assets/asset_16.jpg';

const Counter = ({ end, duration = 2, suffix = "" }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
  
    useEffect(() => {
      if (isInView) {
        let start = 0;
        const increment = end / (duration * 60);
        const timer = setInterval(() => {
          start += increment;
          if (start >= end) {
            setCount(end);
            clearInterval(timer);
          } else {
            setCount(Math.floor(start));
          }
        }, 1000 / 60);
        return () => clearInterval(timer);
      }
    }, [isInView, end, duration]);
  
    return <span ref={ref}>{count}{suffix}</span>;
  };

export function About() {
  return (
    <section className="py-32 bg-surface-overlay relative overflow-hidden" id="about">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        
        {/* Visual Block */}
        <div className="relative">
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                transition={{ duration: 0.8 }}
                className="aspect-[4/5] bg-neutral-800 overflow-hidden relative z-10"
            >
                <img 
                    src={Asset16} 
                    alt="Audio Engineering" 
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover opacity-80 hover:scale-103 transition-transform duration-600"
                />
            </motion.div>
            {/* Decorative Elements */}
            <div className="absolute -top-10 -left-10 w-40 h-40 border border-[#F3BC18]/30 z-0" />
            <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-[#F3BC18]/5 z-0 rounded-full blur-3xl" />
        </div>

        {/* Content Block */}
        <div>
            <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                transition={{ duration: 0.55 }}
                className="text-4xl md:text-6xl font-bold uppercase tracking-tighter text-on-surface mb-8 leading-none"
            >
                Redefining <span className="text-[#F3BC18]">Acoustics</span> for the Modern World.
            </motion.h2>

            <motion.p 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                transition={{ delay: 0.18, duration: 0.55 }}
                className="text-on-surface/60 text-lg leading-relaxed mb-12 border-l-2 border-[#F3BC18] pl-6"
            >
                Sonic Hive Acoustics isn't just about blocking noise. It's about sculpting sound. We combine advanced material science with architectural aesthetics to create spaces that sound as good as they look.
            </motion.p>

            {/* Counters */}
            <div className="grid grid-cols-3 gap-8 border-t border-on-surface/10 pt-12">
                <div className="text-center md:text-left">
                    <h3 className="text-4xl md:text-5xl font-black text-on-surface mb-2 text-[#F3BC18]">
                        <Counter end={500} suffix="+" />
                    </h3>
                    <p className="text-xs uppercase tracking-widest text-on-surface/50">Projects Delivered</p>
                </div>
                <div className="text-center md:text-left">
                    <h3 className="text-4xl md:text-5xl font-black text-on-surface mb-2 text-[#F3BC18]">
                        <Counter end={24} suffix="" />
                    </h3>
                    <p className="text-xs uppercase tracking-widest text-on-surface/50">Industries Served</p>
                </div>
                <div className="text-center md:text-left">
                    <h3 className="text-4xl md:text-5xl font-black text-on-surface mb-2 text-[#F3BC18]">
                        <Counter end={100} suffix="%" />
                    </h3>
                    <p className="text-xs uppercase tracking-widest text-on-surface/50">Satisfaction</p>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
