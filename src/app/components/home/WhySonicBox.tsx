import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";

const reasons = [
    { title: "Advanced Acoustic Engineering", desc: "Precision-calibrated solutions backed by scientific research." },
    { title: "Premium Materials", desc: "Eco-friendly, fire-rated, and durable materials for long-lasting performance." },
    { title: "Custom Solutions", desc: "Tailored designs to meet the unique sonic needs of your space." },
    { title: "Industry Certified", desc: "Meeting global standards for sound reduction and acoustic quality." },
];

export function WhySonicBox() {
  return (
    <section className="py-32 bg-[#F3BC18] text-black" id="solutions">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-20">
        <div>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 leading-none">
                Why <br />Sonic Hive Acoustics?
            </h2>
            <p className="text-black/70 text-lg leading-relaxed max-w-md border-l-4 border-black pl-6">
                We don't just sell products; we solve acoustic problems. Our approach combines physics, design, and engineering to deliver superior results.
            </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
            {reasons.map((reason, idx) => (
                <motion.div 
                    key={reason.title}
                    initial={{ opacity: 0, x: 32 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ delay: idx * 0.12, duration: 0.45 }}
                    className="flex gap-6 items-start border-b border-black/10 pb-8 last:border-0"
                >
                    <CheckCircle2 className="w-8 h-8 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="text-2xl font-bold uppercase tracking-wide mb-2">{reason.title}</h3>
                        <p className="text-black/60 leading-relaxed">{reason.desc}</p>
                    </div>
                </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
}
