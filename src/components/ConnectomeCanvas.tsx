import React, { useEffect, useRef, useState } from 'react';

interface CanvasProps {
  padScore: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  opacity: number;
}

export const ConnectomeCanvas: React.FC<CanvasProps> = ({ padScore }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipples((prev) => [...prev, { x, y, radius: 5, opacity: 1.0 }]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const numNodes = 85;
    const nodes: Array<{ x: number; y: number; baseX: number; baseY: number; pulse: number }> = [];

    const width = canvas.width;
    const height = canvas.height;

    for (let i = 0; i < numNodes; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radiusX = (Math.random() * 0.38 + 0.05) * width;
      const radiusY = (Math.random() * 0.42 + 0.05) * height;
      const x = width / 2 + Math.cos(angle) * radiusX;
      const y = height / 2 + Math.sin(angle) * radiusY;
      nodes.push({ x, y, baseX: x, baseY: y, pulse: Math.random() * Math.PI });
    }

    let step = 0;
    const render = () => {
      step += 0.04;
      ctx.clearRect(0, 0, width, height);

      const stressFactor = Math.min(Math.max(padScore / 10, 0), 1);
      const r = Math.round(16 + stressFactor * (244 - 16));
      const g = Math.round(185 + stressFactor * (63 - 185));
      const b = Math.round(129 + stressFactor * (94 - 129));

      // Draw connective mesh
      ctx.lineWidth = 0.8;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 55) {
            const alpha = (1 - dist / 55) * (0.2 + stressFactor * 0.4);
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Render nodes & synaptic pulse
      nodes.forEach((node) => {
        node.pulse += 0.08;
        const pulseEffect = Math.sin(node.pulse) * 1.5;
        const jitter = stressFactor * 2.0;
        const currentX = node.baseX + Math.sin(step + node.baseX) * jitter;
        const currentY = node.baseY + Math.cos(step + node.baseY) * jitter;

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.beginPath();
        ctx.arc(currentX, currentY, 2 + pulseEffect + stressFactor * 1.2, 0, Math.PI * 2);
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
    <div className="relative w-full flex flex-col justify-center items-center bg-zinc-950 rounded-xl border border-zinc-800 p-2 shadow-xl">
      <canvas 
        ref={canvasRef} 
        width={320} 
        height={220} 
        onClick={handleClick}
        className="w-full max-w-[320px] h-[220px] cursor-pointer rounded-lg" 
      />
      <div className="w-full flex justify-between items-center px-2 pt-1.5 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
        <span>Schaefer-400 Connectome Strain Map</span>
        <span className="text-rose-400">Tap to Fire Synapse</span>
      </div>
    </div>
  );
};
