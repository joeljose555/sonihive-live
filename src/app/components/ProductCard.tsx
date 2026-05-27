import { useRef, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { useInView } from "./useInView";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export type ProductCardProps = {
  slug: string;
  name: string;
  image: string;
  tag: string;
  year?: string;
  description?: string;
  index: number;
  /** Catalog heroes may need contain inside fixed tile */
  imageObjectFit?: "cover" | "contain";
};

export function ProductCard({
  slug,
  name,
  image,
  tag,
  year,
  description,
  index,
  imageObjectFit = "cover",
}: ProductCardProps) {
  const { ref, inView } = useInView(0.08);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.7,
        delay: Math.min(index * 0.06, 0.5),
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link to={`/product/${slug}`}>
        <div
          ref={cardRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseMove={handleMouseMove}
          className="relative group cursor-pointer rounded-2xl overflow-hidden"
          style={{
            background: "var(--surface-elevated)",
            border: "1px solid rgba(var(--on-surface-rgb), 0.04)",
            height: "420px",
          }}
        >
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-[1]"
            style={{
              background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, rgba(var(--accent-rgb), 0.06), transparent 50%)`,
            }}
          />

          <div
            className="absolute -top-20 -left-20 w-60 h-60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none z-[1]"
            style={{
              background:
                "radial-gradient(circle, rgba(var(--accent-rgb), 0.08), transparent 70%)",
            }}
          />

          <div className="absolute inset-0 flex items-center justify-center z-[2] p-8 pt-12 pb-24">
            <motion.div
              className="relative w-full h-full rounded-xl overflow-hidden bg-[rgba(var(--on-surface-rgb),0.02)]"
              animate={{
                scale: isHovered ? 1.04 : 1,
                y: isHovered ? -6 : 0,
              }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <ImageWithFallback
                src={image}
                alt={name}
                className={`w-full h-full rounded-xl ${
                  imageObjectFit === "contain" ? "object-contain" : "object-cover"
                }`}
                style={{
                  filter: isHovered ? "brightness(1.1)" : "brightness(0.7)",
                  transition: "filter 0.6s ease",
                }}
              />
              <div
                className="absolute inset-0 rounded-xl transition-opacity duration-600 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.7) 100%)",
                  opacity: isHovered ? 0.4 : 0.8,
                }}
              />

              <motion.div
                className="absolute inset-0 rounded-xl pointer-events-none"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 40%, rgba(var(--on-surface-rgb), 0.04) 45%, rgba(var(--on-surface-rgb), 0.08) 50%, rgba(var(--on-surface-rgb), 0.04) 55%, transparent 60%)",
                }}
                animate={{ x: isHovered ? "120%" : "-120%" }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
            </motion.div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-[5] p-5 flex items-end justify-between">
            <div className="flex items-end gap-4">
              <motion.h3
                className="text-on-surface leading-[1.15]"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: "var(--font-weight-heading)",
                  fontSize: "18px",
                }}
                animate={{ y: isHovered ? -2 : 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {name}
              </motion.h3>
            </div>

            <div className="flex items-center gap-4">
              {year ? (
                <motion.span
                  className="text-on-surface/25 text-[13px]"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 400,
                  }}
                  animate={{ opacity: isHovered ? 1 : 0.4 }}
                  transition={{ duration: 0.4 }}
                >
                  {year}
                </motion.span>
              ) : null}

              <motion.div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  border: "1px solid rgba(var(--on-surface-rgb), 0.1)",
                  background: "rgba(var(--on-surface-rgb), 0.03)",
                }}
                animate={{
                  borderColor: isHovered
                    ? "rgba(var(--accent-rgb), 0.4)"
                    : "rgba(var(--on-surface-rgb), 0.1)",
                  background: isHovered
                    ? "rgba(var(--accent-rgb), 0.1)"
                    : "rgba(var(--on-surface-rgb), 0.03)",
                  rotate: isHovered ? 90 : 0,
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <Plus
                  className="w-3.5 h-3.5 transition-colors duration-400"
                  style={{
                    color: isHovered
                      ? "#DC2626"
                      : "rgba(var(--on-surface-rgb),var(--text-alpha-muted))",
                  }}
                />
              </motion.div>
            </div>
          </div>

          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-[5]">
            <motion.span
              className="block text-[10px] tracking-[0.2em] uppercase whitespace-nowrap"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
                writingMode: "vertical-rl",
                textOrientation: "mixed",
                color: isHovered
                  ? "rgba(var(--accent-rgb), 0.5)"
                  : "rgba(var(--on-surface-rgb),var(--text-alpha-faint))",
                transition: "color 0.5s ease",
              }}
            >
              {tag}
            </motion.span>
          </div>

          {description ? (
            <motion.div
              className="absolute bottom-14 left-5 right-16 z-[5]"
              initial={false}
              animate={{
                opacity: isHovered ? 1 : 0,
                y: isHovered ? 0 : 10,
              }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <p
                className="text-on-surface/40 text-[12px] leading-[1.6] line-clamp-2"
                style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
              >
                {description}
              </p>
            </motion.div>
          ) : null}

          <motion.div
            className="absolute bottom-0 left-0 h-[2px] bg-[#DC2626] z-[6]"
            initial={{ width: "0%" }}
            animate={{ width: isHovered ? "100%" : "0%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </Link>
    </motion.div>
  );
}
