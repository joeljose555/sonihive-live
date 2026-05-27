import { motion, useScroll, useTransform, useInView } from "motion/react";
import React, { useRef, useEffect, useState, useCallback } from "react";

/* ══════════════════════════════════════════════════════════════
   SECTION DIVIDER
   ══════════════════════════════════════════════════════════════ */

export function SectionDivider({
  text = "SONIC HIVE",
  direction = "left",
  accent = true,
  height = "compact",
}: {
  text?: string;
  direction?: "left" | "right";
  accent?: boolean;
  height?: "compact" | "tall";
}) {
  const items = Array(8).fill(text);
  const py = height === "tall" ? "py-14 md:py-20" : "py-8 md:py-12";
  const animName = direction === "left" ? "marqueeScrollLeft" : "marqueeScrollRight";

  return (
    <div className={`relative ${py} overflow-hidden bg-surface`}>
      {accent && (
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(var(--accent-rgb),0.25), transparent)",
          }}
        />
      )}
      <div
        className="flex items-center gap-6 md:gap-10 will-change-transform"
        style={{ animation: `${animName} 25s linear infinite` }}
      >
        {items.map((t, i) => (
          <div key={i} className="flex items-center gap-6 md:gap-10 shrink-0">
            <span
              className="text-on-surface/[0.03] whitespace-nowrap select-none"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: "var(--font-weight-display)",
                fontSize:
                  height === "tall"
                    ? "clamp(60px, 10vw, 140px)"
                    : "clamp(40px, 6vw, 80px)",
                lineHeight: 1,
              }}
            >
              {t}
            </span>
            <div className="w-3 h-3 rounded-full bg-[#DC2626]/10 shrink-0" />
          </div>
        ))}
      </div>
      {accent && (
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(var(--accent-rgb),0.15), transparent)",
          }}
        />
      )}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-[#DC2626]/[0.015] rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ANIMATED COUNTER
   ══════════════════════════════════════════════════════════════ */
const AnimatedNumber = React.memo(function AnimatedNumber({
  value,
  inView,
}: {
  value: string;
  inView: boolean;
}) {
  const numericPart = value.replace(/[^0-9]/g, "");
  const prefix = value.match(/^[^0-9]*/)?.[0] || "";
  const suffix = value.replace(/^[^0-9]*/, "").replace(numericPart, "");
  const target = parseInt(numericPart) || 0;
  const [count, setCount] = useState(0);
  const countRef = useRef(0);

  useEffect(() => {
    if (!inView) return;
    let startTime: number | null = null;
    const duration = 2200;
    let animId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // easeOutQuart
      const ease = 1 - Math.pow(1 - percentage, 4);
      const currentVal = Math.floor(target * ease);
      
      // Only trigger React re-render when the displayed value actually changes
      if (currentVal !== countRef.current) {
        countRef.current = currentVal;
        setCount(currentVal);
      }

      if (percentage < 1) {
        animId = requestAnimationFrame(animate);
      } else if (countRef.current !== target) {
        countRef.current = target;
        setCount(target);
      }
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [inView, target]);

  return (
    <span>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
});

/* ══════════════════════════════════════════════════════════════
   MINI WAVEFORM CANVAS — horizontal EQ between quote & stats
   ══════════════════════════════════════════════════════════════ */
function MiniWaveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let t = 0;
    let animId = 0;
    let frameCount = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting && !animId) {
          animId = requestAnimationFrame(draw);
        }
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    const draw = () => {
      if (!isVisibleRef.current) {
        animId = 0;
        return;
      }

      // Frame-skip for ~30fps
      frameCount++;
      if (frameCount % 2 !== 0) {
        animId = requestAnimationFrame(draw);
        return;
      }

      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      const midY = h / 2;

      for (let wave = 0; wave < 2; wave++) {
        ctx.beginPath();
        const alpha = wave === 0 ? 0.2 : 0.06;
        const lineW = wave === 0 ? 1.5 : 3;
        // Step by 2 pixels instead of 1 — halves iterations, imperceptible difference
        for (let x = 0; x < w; x += 2) {
          const nx = x / w;
          const edge = Math.pow(Math.sin(nx * Math.PI), 0.5);
          const amp = (4 + wave * 3) * edge;
          const freq1 = 0.008 + wave * 0.003;
          const freq2 = 0.02 + wave * 0.005;
          const speed1 = 0.025 + wave * 0.01;
          const speed2 = 0.04 + wave * 0.015;
          const y =
            midY +
            Math.sin(x * freq1 + t * speed1) * amp +
            Math.sin(x * freq2 + t * speed2) * amp * 0.4;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(var(--accent-rgb), ${alpha})`;
        ctx.lineWidth = lineW;
        ctx.stroke();
      }

      t++;
      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
      animId = 0;
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}

/* ══════════════════════════════════════════════════════════════
   ACOUSTIC FIELD CANVAS — Cinematic sound-wave background
   Concentric pressure rings, orbiting particles, frequency bands,
   scanning beams, mouse-reactive energy, and constellation network.
   ══════════════════════════════════════════════════════════════ */
function AcousticFieldCanvas({
  mousePosRef,
}: {
  mousePosRef: React.RefObject<{ x: number; y: number }>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let t = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting && !animId) {
          animId = requestAnimationFrame(draw);
        }
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      isRed: boolean;
      alpha: number;
      seed: number;
      orbitRadius: number;
      orbitSpeed: number;
      orbitPhase: number;
    }

    const pCount = Math.min(18, Math.floor((W() * H()) / 40000));
    const particles: Particle[] = Array.from({ length: pCount }, () => ({
      x: Math.random() * W(),
      y: Math.random() * H(),
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.15,
      size: 0.5 + Math.random() * 3,
      isRed: Math.random() < 0.5,
      alpha: 0.02 + Math.random() * 0.06,
      seed: Math.random() * 100,
      orbitRadius: 20 + Math.random() * 120,
      orbitSpeed: 0.0005 + Math.random() * 0.002,
      orbitPhase: Math.random() * Math.PI * 2,
    }));

    const maxDist = 120;
    const maxDistSq = maxDist * maxDist;

    let frameCount = 0;

    const draw = () => {
      if (!isVisibleRef.current) {
        animId = 0;
        return;
      }

      // Frame-skip: render every 2nd frame (~30fps)
      frameCount++;
      if (frameCount % 2 !== 0) {
        animId = requestAnimationFrame(draw);
        return;
      }

      const w = W();
      const h = H();
      ctx.clearRect(0, 0, w, h);
      t++;

      const centerX = w * 0.5;
      const centerY = h * 0.45;
      const mx = mousePosRef.current?.x ?? 0.5;
      const my = mousePosRef.current?.y ?? 0.5;
      const maxR = Math.max(w, h) * 0.85;

      /* ── 1. CONCENTRIC PRESSURE RINGS ── */
      for (let i = 0; i < 4; i++) {
        const baseR = (i / 4) * maxR;
        const offset = (t * 0.4 + i * 110) % maxR;
        const radius = (baseR + offset) % maxR;
        const life = radius / maxR;
        const fade = Math.pow(Math.sin(life * Math.PI), 0.6);
        if (fade < 0.005) continue;
        const breathe = Math.sin(t * 0.008 + i * 0.5) * 3;
        const arcR = Math.max(0, radius + breathe);
        if (arcR <= 0) continue;
        ctx.beginPath();
        ctx.arc(centerX, centerY, arcR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(var(--accent-rgb), ${fade * 0.03})`;
        ctx.lineWidth = i % 3 === 0 ? 1.2 : 0.5;
        ctx.stroke();
      }

      /* ── 2. ROTATING DASHED ORBIT RING ── */
      for (let ring = 0; ring < 1; ring++) {
        const r = 80 + ring * 180 + Math.sin(t * 0.006 + ring) * 10;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(t * 0.0004 * (ring % 2 === 0 ? 1 : -1) + ring * 0.8);
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.setLineDash([6, 16]);
        ctx.strokeStyle = `rgba(var(--accent-rgb), ${0.025 + ring * 0.008})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }

      /* ── 3. FREQUENCY SPECTRUM BANDS ── */
      const bandCount = 20;
      for (let i = 0; i < bandCount; i++) {
        const bx = (i / bandCount) * w;
        const ni = i / bandCount;
        const mDist = Math.abs(ni - mx);
        const mBoost = Math.max(0, 1 - mDist * 3) * 0.4;
        const val =
          (Math.sin(i * 0.15 + t * 0.03) * 0.5 + 0.5) * 0.3 +
          (Math.sin(i * 0.4 + t * 0.045) * 0.5 + 0.5) * 0.2 +
          mBoost;
        const bandH = val * h * 0.06;
        const alpha = 0.015 + mBoost * 0.04;
        ctx.fillStyle = `rgba(var(--accent-rgb), ${alpha})`;
        ctx.fillRect(bx, h - bandH, w / bandCount - 1, bandH);
      }

      /* ── 4. HORIZONTAL WAVEFORMS (reduced from 3 to 2) ── */
      for (let wave = 0; wave < 2; wave++) {
        const waveY = centerY + (wave - 0.5) * h * 0.2;
        const waveAlpha = wave === 0 ? 0.06 : 0.025;
        const waveWidth = wave === 0 ? 1.5 : 0.8;
        ctx.beginPath();
        for (let x = 0; x < w; x += 3) {
          const nx = x / w;
          const edge = Math.pow(Math.sin(nx * Math.PI), 0.5);
          const mouseInfluence = Math.max(0, 1 - Math.abs(nx - mx) * 3) * 15;
          const amp = (6 + wave * 4 + mouseInfluence) * edge;
          const speed = 0.015 + wave * 0.008;
          const freq = 0.005 + wave * 0.002;
          const y =
            waveY +
            Math.sin(x * freq + t * speed) * amp +
            Math.sin(x * freq * 2.5 + t * speed * 1.6) * amp * 0.3;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(var(--accent-rgb), ${waveAlpha})`;
        ctx.lineWidth = waveWidth;
        ctx.stroke();
      }

      /* ── 5. PARTICLES with orbital motion ── */
      for (const p of particles) {
        const orbitX =
          Math.cos(t * p.orbitSpeed + p.orbitPhase) * p.orbitRadius;
        const orbitY =
          Math.sin(t * p.orbitSpeed + p.orbitPhase) * p.orbitRadius * 0.6;
        const driftX = Math.sin(t * 0.002 + p.seed) * 0.12;
        const driftY = Math.cos(t * 0.0018 + p.seed * 1.3) * 0.1;
        p.x += p.vx + driftX;
        p.y += p.vy + driftY;
        if (p.x < -30) p.x = w + 30;
        if (p.x > w + 30) p.x = -30;
        if (p.y < -30) p.y = h + 30;
        if (p.y > h + 30) p.y = -30;
        const drawX = p.x + orbitX * 0.1;
        const drawY = p.y + orbitY * 0.1;
        const pulse = Math.sin(t * 0.01 + p.seed) * 0.3 + 0.7;
        const a = p.alpha * pulse;
        const s = p.size * (0.8 + pulse * 0.2);
        ctx.beginPath();
        ctx.arc(drawX, drawY, s, 0, Math.PI * 2);
        if (p.isRed) {
          ctx.fillStyle = `rgba(var(--accent-rgb), ${a})`;
        } else {
          ctx.fillStyle = `rgba(var(--on-surface-rgb), ${a * 0.5})`;
        }
        ctx.fill();
      }

      /* ── 6. CONSTELLATION LINES ── */
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;
          if (distSq < maxDistSq) {
            // Use squared ratio for fade — avoids sqrt
            const lineAlpha = (1 - distSq / maxDistSq) * 0.025;
            const bothRed = particles[i].isRed && particles[j].isRed;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = bothRed
              ? `rgba(var(--accent-rgb), ${lineAlpha})`
              : `rgba(var(--on-surface-rgb), ${lineAlpha * 0.4})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }

      /* ── 7. MOUSE ENERGY PULSE ── */
      const mpx = w * mx;
      const mpy = h * my;
      const pulseR = 150 + Math.sin(t * 0.015) * 40;
      const mGrad = ctx.createRadialGradient(mpx, mpy, 0, mpx, mpy, pulseR);
      mGrad.addColorStop(0, "rgba(var(--accent-rgb), 0.06)");
      mGrad.addColorStop(0.4, "rgba(var(--accent-rgb), 0.02)");
      mGrad.addColorStop(1, "rgba(var(--accent-rgb), 0)");
      ctx.fillStyle = mGrad;
      ctx.beginPath();
      ctx.arc(mpx, mpy, pulseR, 0, Math.PI * 2);
      ctx.fill();

      /* ── 8. CENTER CORE GLOW ── */
      const coreGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        200
      );
      const corePulse = Math.sin(t * 0.01) * 0.02 + 0.04;
      coreGlow.addColorStop(0, `rgba(var(--accent-rgb), ${corePulse})`);
      coreGlow.addColorStop(0.3, `rgba(var(--accent-rgb), ${corePulse * 0.4})`);
      coreGlow.addColorStop(1, "rgba(var(--accent-rgb), 0)");
      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 200, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
      animId = 0;
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

/* ══════════════════════════════════════════════════════════════
   STAT CARD — glowing card with animated border and hover
   ══════════════════════════════════════════════════════════════ */
function StatCard({
  val,
  label,
  index,
  inView,
}: {
  val: string;
  label: string;
  index: number;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const mousePosRef = useRef({ x: 50, y: 50 });
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    mousePosRef.current = {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    };
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const { x, y } = mousePosRef.current;
      if (cursorGlowRef.current) {
        cursorGlowRef.current.style.background = `radial-gradient(300px circle at ${x}% ${y}%, rgba(var(--accent-rgb),0.08), transparent 60%)`;
      }
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.65,
        delay: 0.35 + index * 0.06,
        ease: "easeOut",
      }}
      className="relative group cursor-default h-full min-h-0"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        mousePosRef.current = { x: 50, y: 50 };
      }}
      onMouseMove={handleMouseMove}
    >
      <div
        className="relative rounded-2xl p-6 md:p-8 overflow-hidden transition-all duration-500 h-full flex flex-col justify-center"
        style={{
          background: hovered
            ? "rgba(var(--accent-rgb),0.04)"
            : "rgba(var(--on-surface-rgb),0.015)",
          border: hovered
            ? "1px solid rgba(var(--accent-rgb),0.15)"
            : "1px solid rgba(var(--on-surface-rgb),0.04)",
        }}
      >
        {/* Cursor-following glow inside card */}
        <div
          ref={cursorGlowRef}
          className="absolute inset-0 pointer-events-none transition-opacity duration-500 rounded-2xl"
          style={{
            background: `radial-gradient(300px circle at 50% 50%, rgba(var(--accent-rgb),0.08), transparent 60%)`,
            opacity: hovered ? 1 : 0,
          }}
        />

        {/* Shine sweep */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, rgba(var(--on-surface-rgb),0.02) 45%, rgba(var(--on-surface-rgb),0.05) 50%, rgba(var(--on-surface-rgb),0.02) 55%, transparent 60%)",
            backgroundSize: "200% 100%",
          }}
          animate={{
            backgroundPosition: hovered ? ["200% 0", "-200% 0"] : "200% 0",
          }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
        />

        {/* Ghost number background */}
        <motion.span
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none"
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: "var(--font-weight-display)",
            fontSize: "clamp(60px, 8vw, 100px)",
            lineHeight: 1,
            color: hovered
              ? "rgba(var(--accent-rgb),0.04)"
              : "rgba(var(--on-surface-rgb),0.015)",
            transition: "color 0.5s ease",
          }}
          animate={{ scale: hovered ? 1.08 : 1 }}
          transition={{ duration: 0.5 }}
        >
          {String(index + 1).padStart(2, "0")}
        </motion.span>

        {/* Content */}
        <div className="relative z-10 text-center">
          <motion.div
            className="text-[#DC2626] leading-none mb-3"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: "var(--font-weight-display)",
              fontSize: "clamp(30px, 4.5vw, 52px)",
            }}
            animate={{ scale: hovered ? 1.05 : 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <AnimatedNumber value={val} inView={inView} />
          </motion.div>
          <div
            className="text-on-surface/55 dark:text-on-surface/30 text-[10px] md:text-[11px] tracking-[0.2em] uppercase"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
          >
            {label}
          </div>
        </div>

        {/* Corner accents (CSS transitions) */}
        <div
          className="absolute top-2 left-2 w-5 h-px bg-[#DC2626]/30 transition-all duration-400 origin-left"
          style={{ transform: `scaleX(${hovered ? 1 : 0.4})`, opacity: hovered ? 0.6 : 0.15 }}
        />
        <div
          className="absolute top-2 left-2 w-px h-5 bg-[#DC2626]/30 transition-all duration-400 origin-top"
          style={{ transform: `scaleY(${hovered ? 1 : 0.4})`, opacity: hovered ? 0.6 : 0.15 }}
        />
        <div
          className="absolute bottom-2 right-2 w-5 h-px bg-[#DC2626]/30 transition-all duration-400 origin-right"
          style={{ transform: `scaleX(${hovered ? 1 : 0.4})`, opacity: hovered ? 0.6 : 0.15 }}
        />
        <div
          className="absolute bottom-2 right-2 w-px h-5 bg-[#DC2626]/30 transition-all duration-400 origin-bottom"
          style={{ transform: `scaleY(${hovered ? 1 : 0.4})`, opacity: hovered ? 0.6 : 0.15 }}
        />

        <div
          className="absolute bottom-0 left-0 h-[2px] bg-[#DC2626] rounded-full transition-all duration-500 ease-out"
          style={{ width: hovered ? "100%" : "0%" }}
        />
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   STATEMENT SECTION — Cinematic, immersive
   ══════════════════════════════════════════════════════════════ */

export function StatementSection() {
  const ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(contentRef, { once: true, margin: "-30px" });
  const sectionMouseRef = useRef({ x: 0.5, y: 0.5 });
  const sectionRafRef = useRef<number | null>(null);

  const handleSectionMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    sectionMouseRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
    if (sectionRafRef.current != null) return;
    sectionRafRef.current = requestAnimationFrame(() => {
      sectionRafRef.current = null;
      const { x, y } = sectionMouseRef.current;
      if (cursorGlowRef.current) {
        cursorGlowRef.current.style.background = `radial-gradient(800px circle at ${x * 100}% ${y * 100}%, rgba(var(--accent-rgb),0.06), transparent 45%)`;
      }
    });
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.5, 0.85, 1],
    [0, 1, 1, 1, 0]
  );

  const stats = [
    { val: "20+", label: "Years of Acoustic Innovation" },
    { val: "60+", label: "Professional Acoustic Patents" },
    { val: "100+", label: "Global Enterprise Clients" },
    { val: "Top 5%", label: "Global Market Leader" },
  ];

  return (
    <section
      ref={ref}
      onMouseMove={handleSectionMouseMove}
      className="relative bg-surface overflow-hidden"
      style={{ minHeight: "85vh" }}
    >
      {/* ── Acoustic field background ── */}
      <div className="absolute inset-0 z-[0] hidden dark:block">
        <AcousticFieldCanvas mousePosRef={sectionMouseRef} />
      </div>

      {/* ── Cursor-following glow overlay ── */}
      <div
        ref={cursorGlowRef}
        className="absolute inset-0 pointer-events-none z-[3] hidden dark:block"
        style={{
          background: `radial-gradient(800px circle at 50% 50%, rgba(var(--accent-rgb),0.06), transparent 45%)`,
        }}
      />

      {/* ── Background watermark text (static -- parallax removed for perf) ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden hidden dark:flex">
        <span
          className="text-on-surface/[0.012] whitespace-nowrap select-none will-change-transform"
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: "var(--font-weight-display)",
            fontSize: "clamp(120px, 22vw, 400px)",
            lineHeight: 1,
          }}
        >
          SILENCE
        </span>
      </div>

      {/* ── Grid overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none hidden dark:block"
        style={{
          backgroundImage:
            "linear-gradient(rgba(var(--accent-rgb),0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-rgb),0.012) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* ── Grain ── */}
      <div
        className="absolute inset-0 opacity-[0.018] pointer-events-none z-[1] hidden dark:block"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ── Ambient glows ── */}
      {/* Ambient glows converted from motion.div to CSS animations for GPU compositing */}
      <div
        className="absolute top-[20%] left-[15%] w-[600px] h-[600px] bg-[#DC2626]/[0.02] rounded-full blur-[250px] pointer-events-none hidden dark:block"
        style={{ animation: 'ambientPulse1 9s ease-in-out infinite' }}
      />
      <div
        className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-[#DC2626]/[0.015] rounded-full blur-[200px] pointer-events-none hidden dark:block"
        style={{ animation: 'ambientPulse2 11s ease-in-out 4s infinite' }}
      />

      {/* ── Side accent lines ── */}
      <motion.div
        className="absolute top-[10%] bottom-[10%] left-0 w-px pointer-events-none"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(var(--accent-rgb),0.08), transparent)",
          transformOrigin: "top",
        }}
      />
      <motion.div
        className="absolute top-[15%] bottom-[15%] right-0 w-px pointer-events-none"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
        transition={{
          duration: 1.5,
          delay: 0.3,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(var(--accent-rgb),0.05), transparent)",
          transformOrigin: "bottom",
        }}
      />

      {/* ══════════ CENTER CONTENT ══════════ */}
      <motion.div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center justify-center text-center px-6 lg:px-10 py-20 md:py-28"
        style={{ minHeight: "85vh", opacity, willChange: "opacity, transform" }}
      >
        {/* ── Top icon with pulsing rings ── */}
        <motion.div
          className="mb-10 relative"
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.75, ease: "easeOut" }}
        >
          <div className="w-16 h-16 rounded-2xl bg-[#DC2626]/10 border border-[#DC2626]/20 flex items-center justify-center mx-auto relative">
            <div
              className="w-3 h-3 rounded-full bg-[#DC2626]"
              style={{ animation: "dotPulse 2.5s ease-in-out infinite" }}
            />
          </div>
          <div
            className="absolute inset-[-6px] rounded-2xl border border-[#DC2626]/15"
            style={{ animation: "ringPulse1 2.5s ease-in-out infinite" }}
          />
          <div
            className="absolute inset-[-14px] rounded-3xl border border-[#DC2626]/8"
            style={{ animation: "ringPulse2 2.5s ease-in-out 0.4s infinite" }}
          />
        </motion.div>

        {/* ── Label ── */}
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="text-[#DC2626] text-[10px] md:text-[11px] tracking-[0.35em] uppercase mb-8 block"
          style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
        >
          Our Philosophy
        </motion.span>

        {/* ── Quote — word-by-word stagger ── */}
        <div className="max-w-[1000px] mb-6">
          <motion.h2
            style={{ y: textY, willChange: "transform" }}
            className="leading-[1.12] md:leading-[1.15]"
          >
            <span className="overflow-hidden inline-block">
              <motion.span
                className="inline-block text-on-surface/90"
                initial={{ y: "110%" }}
                animate={isInView ? { y: 0 } : {}}
                transition={{
                  duration: 0.85,
                  ease: "easeOut",
                  delay: 0.12,
                }}
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: "var(--font-weight-display)",
                  fontSize: "clamp(26px, 5vw, 64px)",
                  willChange: "transform",
                }}
              >
                We don't just block sound,
              </motion.span>
            </span>{" "}
            <span className="overflow-hidden inline-block">
              <motion.span
                className="inline-block text-[#DC2626] relative"
                initial={{ y: "110%" }}
                animate={isInView ? { y: 0 } : {}}
                transition={{
                  duration: 0.85,
                  ease: "easeOut",
                  delay: 0.22,
                }}
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: "var(--font-weight-display)",
                  fontSize: "clamp(26px, 5vw, 64px)",
                  willChange: "transform",
                }}
              >
                we curate it.
                <motion.span
                  className="absolute bottom-1 left-0 h-[2px] bg-[#DC2626] origin-left w-full"
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{
                    duration: 0.65,
                    delay: 0.75,
                    ease: "easeOut",
                  }}
                />
              </motion.span>
            </span>
          </motion.h2>
        </div>

        {/* ── Animated waveform divider ── */}
        {/* <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{
            duration: 1.2,
            delay: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="w-full max-w-[600px] h-[30px] mb-6"
        >
          <MiniWaveCanvas />
        </motion.div> */}

        {/* ── Sub-text ── */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.52 }}
          className="text-on-surface/50 dark:text-on-surface/25 text-[13px] md:text-[15px] max-w-[580px] leading-[2] tracking-wide mb-16 md:mb-20"
          style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
        >
          Every environment has an iconic signature. At Sonic Hive Acoustics, we use the
          principles of Psychoacoustics and Physiological Engineering to create
          spaces that enhance focus, privacy, and well-being. This is where
          scientific rigour meets architectural elegance.
        </motion.p>

        {/* ── STAT CARDS GRID ── */}
        <div className="w-full max-w-[1000px] grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 items-stretch">
          {stats.map((stat, i) => (
            <StatCard
              key={stat.label}
              val={stat.val}
              label={stat.label}
              index={i}
              inView={isInView}
            />
          ))}
        </div>
      </motion.div>

      {/* ── Bottom decorative line ── */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px z-10"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(var(--accent-rgb),0.2), transparent)",
        }}
      />
    </section>
  );
}
