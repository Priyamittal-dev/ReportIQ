import React, { useEffect, useRef } from 'react';

interface ParticleWarpProps {
  mode: '3d' | '5d' | '8d' | 'anaglyph';
}

interface Particle {
  x: number;
  y: number;
  z: number;
  vz: number;
  color: string;
  size: number;
}

export const ParticleWarp: React.FC<ParticleWarpProps> = ({ mode }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const count = mode === '8d' ? 350 : mode === '5d' ? 200 : 120;
    const particles: Particle[] = [];

    const colors3d = ['#00f0ff', '#ff0055', '#a855f7', '#ffffff'];
    const colors5d = ['#00ffff', '#ff00ea', '#3b82f6', '#10b981'];
    const colors8d = ['#ff3366', '#33ccff', '#ffcc00', '#a855f7', '#00ffcc'];

    const getColors = () => {
      if (mode === '8d') return colors8d;
      if (mode === '5d') return colors5d;
      return colors3d;
    };

    for (let i = 0; i < count; i++) {
      const colArray = getColors();
      particles.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * 1000 + 1,
        vz: mode === '8d' ? 12 : mode === '5d' ? 4 : 2,
        color: colArray[Math.floor(Math.random() * colArray.length)],
        size: Math.random() * 2.5 + 1,
      });
    }

    const render = () => {
      ctx.fillStyle = mode === '8d' ? 'rgba(5, 5, 12, 0.28)' : 'rgba(7, 9, 15, 0.4)';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.z -= p.vz;
        if (p.z <= 0) {
          p.z = 1000;
          p.x = (Math.random() - 0.5) * width * 2;
          p.y = (Math.random() - 0.5) * height * 2;
        }

        const k = 400 / p.z;
        const px = p.x * k + cx;
        const py = p.y * k + cy;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const alpha = Math.min(1, (1000 - p.z) / 400);
          ctx.beginPath();
          ctx.arc(px, py, Math.max(0.6, p.size * k), 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = alpha;
          ctx.fill();

          // In 8D mode, draw hyperspace warp streak
          if (mode === '8d') {
            const pPrevZ = p.z + p.vz * 2.5;
            const kPrev = 400 / pPrevZ;
            const prevPx = p.x * kPrev + cx;
            const prevPy = p.y * kPrev + cy;

            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(prevPx, prevPy);
            ctx.strokeStyle = p.color;
            ctx.lineWidth = Math.max(0.5, p.size * k * 0.8);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [mode]);

  return <canvas ref={canvasRef} className="particle-warp-canvas" />;
};
