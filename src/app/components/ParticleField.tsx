import { useRef, useEffect, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  pulseSpeed: number;
  pulsePhase: number;
}

interface ParticleFieldProps {
  particleCount?: number;
  color?: [number, number, number]; // RGB
  maxRadius?: number;
  connectionDistance?: number;
  speed?: number;
  className?: string;
}

export function ParticleField({
  particleCount = 60,
  color = [220, 38, 38], // red
  maxRadius = 2,
  connectionDistance = 140,
  speed = 0.3,
  className = "",
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animIdRef = useRef(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const isVisibleRef = useRef(false);

  const initParticles = useCallback(
    (w: number, h: number) => {
      const particles: Particle[] = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          radius: Math.random() * maxRadius + 0.5,
          opacity: Math.random() * 0.5 + 0.1,
          pulseSpeed: Math.random() * 0.02 + 0.005,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
      particlesRef.current = particles;
    },
    [particleCount, speed, maxRadius]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      w = rect.width;
      h = rect.height;
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles(w, h);
    };

    resize();
    window.addEventListener("resize", resize);

    // IntersectionObserver to pause when offscreen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting && !animIdRef.current) {
          animIdRef.current = requestAnimationFrame(draw);
        }
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    if (!isTouch) {
      canvas.addEventListener("mousemove", handleMouse, { passive: true });
    }

    let time = 0;
    const connDistSq = connectionDistance * connectionDistance;
    let frameCount = 0;
    const colorStr = `${color[0]},${color[1]},${color[2]}`;

    const draw = () => {
      if (!isVisibleRef.current) {
        animIdRef.current = 0;
        return;
      }

      // Frame-skip: render every 2nd frame (~30fps) — background particles don't need 60fps
      frameCount++;
      if (frameCount % 2 !== 0) {
        animIdRef.current = requestAnimationFrame(draw);
        return;
      }

      time++;
      ctx.clearRect(0, 0, w, h);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      // Update & draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!isTouch) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 14400) {
            const dist = Math.sqrt(distSq);
            const force = (120 - dist) / 120;
            p.vx += (dx / dist) * force * 0.15;
            p.vy += (dy / dist) * force * 0.15;
          }
        }

        // Dampen velocity
        p.vx *= 0.99;
        p.vy *= 0.99;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        // Pulsing opacity
        const pulse = Math.sin(time * p.pulseSpeed + p.pulsePhase) * 0.3 + 0.7;
        const alpha = p.opacity * pulse;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${colorStr},${alpha})`;
        ctx.fill();

        // Connections — squared distance only, no sqrt needed
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const cdx = p.x - p2.x;
          const cdy = p.y - p2.y;
          const cdistSq = cdx * cdx + cdy * cdy;
          if (cdistSq < connDistSq) {
            // Approximate fade using squared ratio (cheaper than sqrt)
            const lineAlpha =
              (1 - cdistSq / connDistSq) * 0.12 * pulse;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${colorStr},${lineAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animIdRef.current = requestAnimationFrame(draw);
    };

    animIdRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animIdRef.current);
      animIdRef.current = 0;
      window.removeEventListener("resize", resize);
      if (!isTouch) canvas.removeEventListener("mousemove", handleMouse);
      observer.disconnect();
    };
  }, [initParticles, color, connectionDistance]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-auto ${className}`}
      style={{ zIndex: 0 }}
    />
  );
}

