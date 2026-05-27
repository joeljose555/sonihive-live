import { useEffect, useRef, useCallback } from "react";

/**
 * Elegant sound-propagation visualizer for a soundproofing company.
 * Soft concentric ripples emanating from center (like sound waves
 * hitting a wall), subtle floating dust motes, and a gentle
 * single waveform. Clean, premium, not techy/hacker-y.
 */
export function HeroSoundVisualizer({
  className = "",
}: {
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const c = canvasRef.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    mouseRef.current = {
      x: (e.clientX - r.left) / r.width,
      y: (e.clientY - r.top) / r.height,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const styles = getComputedStyle(document.documentElement);
    const onSurfaceRgb = styles.getPropertyValue("--on-surface-rgb").trim() || "255, 255, 255";

    let animId: number;
    let t = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    const draw = () => {
      const w = W();
      const h = H();
      ctx.clearRect(0, 0, w, h);
      t++;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      /* ── 1. Concentric sound propagation rings ── */
      /* Rings slowly expand from center-left outward,
         like sound waves radiating from a source */
      const originX = w * 0.35;
      const originY = h * 0.48;
      const ringCount = 8;
      const maxRadius = Math.max(w, h) * 0.7;

      for (let i = 0; i < ringCount; i++) {
        const speed = 0.4;
        const offset = (i / ringCount) * maxRadius;
        const radius = ((t * speed + offset) % maxRadius);
        const life = radius / maxRadius;
        const fade = Math.sin(life * Math.PI); // fade in and out

        if (fade <= 0) continue;

        ctx.beginPath();
        ctx.arc(originX, originY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(220, 38, 38, ${fade * 0.06})`;
        ctx.lineWidth = 1 + fade * 0.5;
        ctx.stroke();
      }

      /* ── 2. Single smooth center waveform ── */
      const yCenter = h * 0.5;
      ctx.beginPath();
      for (let x = 0; x < w; x += 2) {
        const nx = x / w;
        const edge = Math.sin(nx * Math.PI);
        const mouseDist = Math.abs(nx - mx);
        const mouseBoost = Math.max(0, 1 - mouseDist * 3) * 12;
        const amp = (18 + mouseBoost) * edge;

        const y =
          yCenter +
          Math.sin(x * 0.004 + t * 0.015) * amp +
          Math.sin(x * 0.01 + t * 0.025) * amp * 0.25;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(220, 38, 38, 0.10)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      /* ── 3. Subtle EQ bars at bottom edge ── */
      const barCount = 48;
      const gap = 4;
      const barW = (w - gap * barCount) / barCount;
      const maxBarH = h * 0.08;

      for (let i = 0; i < barCount; i++) {
        const x = i * (barW + gap);
        const ni = i / barCount;
        const mouseDist = Math.abs(ni - mx);
        const mBoost = Math.max(0, 1 - mouseDist * 3) * 0.35;

        const val =
          (Math.sin(i * 0.3 + t * 0.035) * 0.5 + 0.5) * 0.5 +
          (Math.sin(i * 0.7 + t * 0.05) * 0.5 + 0.5) * 0.25 +
          mBoost;

        const barH = Math.max(2, val * maxBarH);
        const alpha = 0.04 + mBoost * 0.06;

        ctx.fillStyle = `rgba(220, 38, 38, ${alpha})`;
        ctx.fillRect(x, h - barH, barW, barH);
      }

      /* ── 4. Floating dust/motes (ambient) ── */
      for (let p = 0; p < 20; p++) {
        const px = ((Math.sin(p * 7.3 + t * 0.003) * 0.5 + 0.5) * w * 1.1) - w * 0.05;
        const py = ((Math.cos(p * 4.1 + t * 0.002) * 0.5 + 0.5) * h * 1.1) - h * 0.05;
        const radius = 0.8 + Math.sin(p * 2.7 + t * 0.02) * 0.4;
        const alpha = 0.06 + Math.sin(p * 3.3 + t * 0.015) * 0.03;

        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${onSurfaceRgb}, ${alpha})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ imageRendering: "auto" }}
    />
  );
}
