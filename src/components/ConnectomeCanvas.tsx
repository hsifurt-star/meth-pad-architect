import React, { useEffect, useRef } from 'react';

interface CanvasProps {
  padScore: number;
}

export const ConnectomeCanvas: React.FC<CanvasProps> = ({ padScore }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const numNodes = 75;
    const nodes: Array<{ x: number; y: number; baseX: number; baseY: number }> = [];

    const width = canvas.width;
    const height = canvas.height;

    for (let i = 0; i < numNodes; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radiusX = (Math.random() * 0.35 + 0.05) * width;
      const radiusY = (Math.random() * 0.42 + 0.05) * height;
      const x = width / 2 + Math.cos(angle) * radiusX;
      const y = height / 2 + Math.sin(angle) * radiusY;
      nodes.push({ x, y, baseX: x, baseY: y });
    }

    let step = 0;
    const render = () => {
      step += 0.03;
      ctx.clearRect(0, 0, width, height);

      const stressFactor = Math.min(Math.max(padScore / 10, 0), 1);
      const r = Math.round(16 + stressFactor * (244 - 16));
      const g = Math.round(185 + stressFactor * (63 - 185));
      const b = Math.round(129 + stressFactor * (94 - 129));

      ctx.lineWidth = 0.8;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 50) {
            const alpha = (1 - dist / 50) * (0.15 + stressFactor * 0.35);
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      nodes.forEach((node) => {
        const jitter = stressFactor * 1.5;
        const currentX = node.baseX + Math.sin(step + node.baseX) * jitter;
        const currentY = node.baseY + Math.cos(step + node.baseY) * jitter;

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.beginPath();
        ctx.arc(currentX, currentY, 2 + stressFactor * 1.2, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [padScore]);

  return (
    <div className="relative w-full flex justify-center items-center bg-zinc-950 rounded-xl border border-zinc-800 p-2">
      <canvas ref={canvasRef} width={320} height={220} className="w-full max-w-[320px] h-[220px]" />
      <div className="absolute bottom-2 left-3 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
        Schaefer-400 Brain Connectome Strain
      </div>
    </div>
  );
};
