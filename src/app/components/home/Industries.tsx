import { motion } from "motion/react";
import { Mic2, Building2, Factory, Car, Home, Briefcase } from "lucide-react";

const industries = [
    { name: "Studios", icon: Mic2 },
    { name: "Offices", icon: Briefcase },
    { name: "Manufacturing", icon: Factory },
    { name: "Automotive", icon: Car },
    { name: "Residential", icon: Home },
    { name: "Commercial", icon: Building2 },
];

export function Industries() {
  return (
    <section className="py-24 bg-surface-overlay border-t border-on-surface/5" id="industries">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 text-center">
            {industries.map((industry, idx) => (
                <motion.div
                    key={industry.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ delay: idx * 0.06, duration: 0.4 }}
                    className="flex flex-col items-center gap-4 group cursor-pointer"
                >
                    <div className="w-20 h-20 rounded-full bg-on-surface/5 border border-on-surface/10 flex items-center justify-center group-hover:bg-[#F3BC18] group-hover:border-[#F3BC18] transition-all duration-300">
                        <industry.icon className="w-8 h-8 text-on-surface/70 group-hover:text-black transition-colors" />
                    </div>
                    <span className="text-on-surface/60 text-sm uppercase tracking-widest group-hover:text-on-surface transition-colors">
                        {industry.name}
                    </span>
                </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
}
