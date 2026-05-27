import { motion } from "motion/react";
import { 
    Box, 
    Mic2, 
    Headphones, 
    Layers, 
    VolumeX, 
    Wind, 
    Zap, 
    Speaker, 
    Radio, 
    Square, 
    Grid, 
    Move, 
    Triangle,
    Hexagon,
    Music,
    Shield,
    Hammer,
    Wrench,
    ArrowUpRight
} from "lucide-react";

const categories = [
    { name: "Silent Booth", icon: Box },
    { name: "VRT Series", icon: Layers },
    { name: "ART Series", icon: Music },
    { name: "Home Pod", icon: Headphones },
    { name: "Soundproof Door", icon: Shield },
    { name: "Consumer Series", icon: Speaker },
    { name: "Commercial Series", icon: Grid },
    { name: "Engineering Series", icon: Hammer },
    { name: "Engineering Acoustics", icon: Wrench },
    { name: "Portable Acoustics", icon: Move },
    { name: "Acoustic Cube", icon: Square },
    { name: "Imagine Acoustic Art", icon: Hexagon },
    { name: "EQ Series Panels", icon: Radio },
    { name: "AQ Smart Module", icon: Zap },
    { name: "QRD 2D Diffuser", icon: Grid },
    { name: "MLS 3D Diffuser", icon: Box },
    { name: "Sound Insulation", icon: VolumeX },
    { name: "Automotive Series", icon: Wind },
    { name: "Noise Accessories", icon: Triangle },
];

export function ProductCategories() {
  return (
    <section className="py-32 bg-surface-overlay text-on-surface" id="products">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-on-surface/10 pb-8">
            <div>
                <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-4">
                    Product <span className="text-[#F3BC18]">Range</span>
                </h2>
                <p className="text-on-surface/50 max-w-lg">
                    Comprehensive acoustic solutions for every application.
                </p>
            </div>
            <button className="hidden md:flex items-center gap-2 text-[#F3BC18] uppercase tracking-widest text-xs font-bold hover:text-on-surface transition-colors">
                View All Catalog <ArrowUpRight size={16} />
            </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat, idx) => (
                <motion.div
                    key={cat.name}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ delay: idx * 0.03, duration: 0.4 }}
                    className="group relative bg-on-surface/5 border border-on-surface/5 p-6 hover:bg-[#F3BC18] hover:border-[#F3BC18] transition-all duration-300 cursor-pointer overflow-hidden"
                >
                    <div className="flex justify-between items-start mb-12">
                        <cat.icon className="w-8 h-8 text-on-surface/70 group-hover:text-black transition-colors" strokeWidth={1.5} />
                        <ArrowUpRight className="w-4 h-4 text-on-surface/30 group-hover:text-black opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>
                    
                    <h3 className="text-lg font-medium text-on-surface group-hover:text-black transition-colors uppercase tracking-wide">
                        {cat.name}
                    </h3>
                    
                    {/* Background Glow Effect */}
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-on-surface/5 rounded-full blur-2xl group-hover:bg-black/10 transition-colors" />
                </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
}
