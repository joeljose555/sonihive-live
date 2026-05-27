import { motion } from "motion/react";

export function Contact() {
  return (
    <section className="py-32 bg-surface-overlay relative" id="contact">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45 }}
            className="text-4xl md:text-6xl font-bold uppercase tracking-tighter text-on-surface mb-6"
        >
            Start Your <span className="text-[#F3BC18]">Silence</span>
        </motion.h2>
        <p className="text-on-surface/50 text-lg mb-12">
            Get in touch with our acoustic engineers for a custom consultation.
        </p>

        <motion.form 
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4 }}
            className="max-w-xl mx-auto space-y-4"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                    type="text" 
                    placeholder="NAME" 
                    className="w-full bg-on-surface/5 border border-on-surface/10 p-4 text-on-surface placeholder:text-on-surface/30 focus:outline-none focus:border-[#F3BC18] transition-colors"
                />
                <input 
                    type="email" 
                    placeholder="EMAIL" 
                    className="w-full bg-on-surface/5 border border-on-surface/10 p-4 text-on-surface placeholder:text-on-surface/30 focus:outline-none focus:border-[#F3BC18] transition-colors"
                />
            </div>
            <textarea 
                placeholder="TELL US ABOUT YOUR PROJECT" 
                rows={4}
                className="w-full bg-on-surface/5 border border-on-surface/10 p-4 text-on-surface placeholder:text-on-surface/30 focus:outline-none focus:border-[#F3BC18] transition-colors"
            />
            <button className="w-full bg-[#F3BC18] text-black py-4 uppercase tracking-widest font-bold hover:bg-on-surface transition-colors duration-300">
                Submit Request
            </button>
        </motion.form>
      </div>
    </section>
  );
}
