import { useEffect, useRef } from "react";

export function SoundWave({ className = "", color = "#DC2626", opacity = 0.15 }: { className?: string; color?: string; opacity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      const midY = h / 2;

      for (let wave = 0; wave < 3; wave++) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.globalAlpha = opacity - wave * 0.03;
        ctx.lineWidth = 2;

        for (let x = 0; x < w; x++) {
          const frequency = 0.003 + wave * 0.001;
          const amplitude = 40 + wave * 20;
          const speed = 0.02 + wave * 0.005;
          const y = midY + Math.sin(x * frequency + time * speed) * amplitude * Math.sin(x * 0.001 + time * 0.01);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      time++;
      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [color, opacity]);

  return <canvas ref={canvasRef} className={`w-full h-full ${className}`} />;
}