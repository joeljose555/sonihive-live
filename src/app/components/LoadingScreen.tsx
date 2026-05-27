import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import logo from "../assets/logo.png";

/* ── Animated equalizer bars ── */
function EqBars() {
  return (
    <div className="flex items-end gap-[3px] h-8">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-[#DC2626]"
          animate={{
            height: [
              `${8 + Math.random() * 12}px`,
              `${18 + Math.random() * 14}px`,
              `${6 + Math.random() * 10}px`,
              `${14 + Math.random() * 18}px`,
              `${8 + Math.random() * 12}px`,
            ],
            opacity: [0.4, 1, 0.5, 0.9, 0.4],
          }}
          transition={{
            duration: 0.8 + Math.random() * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.06,
          }}
        />
      ))}
    </div>
  );
}

/* ── Canvas sound waveform for loading ── */
function LoadingWaveform() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;
    let animId: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Draw multiple waves
      for (let wave = 0; wave < 4; wave++) {
        ctx.beginPath();
        const alpha = 0.08 - wave * 0.015;
        ctx.strokeStyle = `rgba(var(--accent-rgb), ${alpha})`;
        ctx.lineWidth = 1.5;

        for (let x = 0; x < w; x++) {
          const freq = 0.004 + wave * 0.0015;
          const amp = 20 + wave * 15;
          const speed = 0.03 + wave * 0.008;
          const y =
            h / 2 +
            Math.sin(x * freq + time * speed) *
              amp *
              Math.sin(x * 0.0015 + time * 0.015);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Center glow line
      ctx.beginPath();
      ctx.strokeStyle = "rgba(var(--accent-rgb), 0.3)";
      ctx.lineWidth = 2;
      for (let x = 0; x < w; x++) {
        const y =
          h / 2 +
          Math.sin(x * 0.008 + time * 0.04) *
            12 *
            Math.cos(x * 0.002 + time * 0.02);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      time++;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}

export function LoadingScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "revealing" | "done">(
    "loading"
  );

  useEffect(() => {
    let start = Date.now();
    const duration = 2800; // 2.8s loading

    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / duration, 1);
      // Ease-out curve
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(eased * 100);

      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        setPhase("revealing");
        setTimeout(() => {
          setPhase("done");
          onComplete();
        }, 900);
      }
    };
    requestAnimationFrame(tick);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#0A0A0A]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Background waveform */}
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            <LoadingWaveform />
          </div>

          {/* Grid overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(var(--accent-rgb),1) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-rgb),1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          {/* Ambient glow */}
          <motion.div
            className="absolute w-[600px] h-[600px] bg-[#DC2626]/[0.04] rounded-full blur-[200px] pointer-events-none"
            animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          />

          {/* Curtain reveal lines */}
          {phase === "revealing" && (
            <>
              <motion.div
                className="absolute top-0 left-0 right-0 bg-[#0A0A0A] z-10"
                initial={{ height: "0%" }}
                animate={{ height: "50%" }}
                transition={{
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-[#0A0A0A] z-10"
                initial={{ height: "0%" }}
                animate={{ height: "50%" }}
                transition={{
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </>
          )}

          {/* Logo and content */}
          <motion.div
            className="relative z-20 flex flex-col items-center"
            animate={
              phase === "revealing"
                ? { scale: 1.2, opacity: 0 }
                : { scale: 1, opacity: 1 }
            }
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Main logo – SonicHive; brightness so dark “Sonic” and tagline visible on dark background */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                duration: 1,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.2,
              }}
              className="mb-8 relative"
            >
              <img src={logo} alt="Sonic Hive Acoustics" className="h-20 w-auto object-contain [filter:brightness(2.2)_contrast(1.05)]" />
              {/* Pulsing ring */}
              <motion.div
                className="absolute inset-[-8px] rounded-2xl border border-[#DC2626]/30 pointer-events-none"
                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0, 0.3] }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute inset-[-16px] rounded-3xl border border-[#DC2626]/15 pointer-events-none"
                animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0, 0.15] }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                  delay: 0.3,
                }}
              />
            </motion.div>

            {/* EQ bars */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mb-8"
            >
              <EqBars />
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 200 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="relative h-[2px] bg-white/[0.06] rounded-full overflow-hidden"
            >
              <motion.div
                className="absolute top-0 left-0 h-full bg-[#DC2626] rounded-full"
                style={{ width: `${progress}%` }}
              />
              {/* Glow on progress head */}
              <motion.div
                className="absolute top-[-3px] h-[8px] w-[20px] rounded-full bg-[#DC2626]/50 blur-sm"
                style={{ left: `calc(${progress}% - 10px)` }}
              />
            </motion.div>

            {/* Percentage */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-white/20 text-[11px] tracking-[0.3em] uppercase mt-4"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
            >
              {Math.round(progress)}%
            </motion.span>

            {/* Tagline */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="text-white text-[10px] tracking-[0.25em] uppercase mt-6"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
            >
              Engineering Silence
            </motion.span>
          </motion.div>

          {/* Corner decorations */}
          <motion.div
            className="absolute top-6 left-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ delay: 0.4, duration: 1 }}
          >
            <div className="w-8 h-px bg-[#DC2626]" />
            <div className="w-px h-8 bg-[#DC2626]" />
          </motion.div>
          <motion.div
            className="absolute bottom-6 right-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ delay: 0.4, duration: 1 }}
          >
            <div className="w-8 h-px bg-[#DC2626] ml-auto" />
            <div className="w-px h-8 bg-[#DC2626] ml-auto" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
