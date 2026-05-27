import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import Asset17 from '../../assets/asset_17.jpg';
import Asset18 from '../../assets/asset_18.jpg';
import Asset19 from '../../assets/asset_19.jpg';

const products = [
    {
        id: 1,
        name: "SonicPod Pro",
        category: "Silent Booths",
        image: Asset17,
        desc: "The ultimate privacy solution for open-plan offices."
    },
    {
        id: 2,
        name: "WaveForm 3D",
        category: "Acoustic Panels",
        image: Asset18,
        desc: "High-performance absorption with sculptural aesthetics."
    },
    {
        id: 3,
        name: "IsoShield X",
        category: "Industrial",
        image: Asset19,
        desc: "Heavy-duty sound insulation for machinery and manufacturing."
    }
];

export function FeaturedProducts() {
    return (
        <section className="py-32 bg-surface-overlay relative" id="featured">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                    className="text-4xl md:text-6xl font-bold uppercase tracking-tighter text-on-surface mb-16 text-center"
                >
                    Featured <span className="text-[#F3BC18]">Innovations</span>
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {products.map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ delay: idx * 0.18, duration: 0.6 }}
                            className="group relative cursor-pointer"
                        >
                            <div className="relative aspect-[3/4] overflow-hidden mb-6 border border-on-surface/10 group-hover:border-[#F3BC18] transition-colors duration-500">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />

                                {/* Overlay Content */}
                                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-surface/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                    <button className="flex items-center gap-2 text-[#F3BC18] text-sm uppercase tracking-widest font-bold">
                                        View Details <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[#F3BC18] text-xs uppercase tracking-widest mb-1">{product.category}</p>
                                    <h3 className="text-2xl font-bold text-on-surface uppercase tracking-wide group-hover:text-[#F3BC18] transition-colors">
                                        {product.name}
                                    </h3>
                                </div>
                            </div>
                            <p className="mt-2 text-on-surface/50 text-sm max-w-xs">{product.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
