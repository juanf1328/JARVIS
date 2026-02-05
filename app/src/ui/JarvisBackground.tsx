import { useEffect, useRef } from "react";

export default function JarvisBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    interface Particle {
      angle: number;
      radius: number;
      speed: number;
      size: number;
      opacity: number;
    }

    const particles: Particle[] = [];
    const numParticles = 60;

    // Crear partículas orbitales
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        angle: (Math.PI * 2 * i) / numParticles,
        radius: 100 + Math.random() * 200,
        speed: 0.001 + Math.random() * 0.002,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.3
      });
    }

    let animationId: number;
    let time = 0;

    function animate() {
      const c = canvasRef.current;
      if (!c || !ctx) return;

      time += 0.01;

      // Limpiar con transparencia
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, c.width, c.height);

      // Dibujar núcleo del Arc Reactor
      const coreRadius = 30;
      const coreGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, coreRadius
      );
      coreGradient.addColorStop(0, "rgba(34, 211, 238, 0.8)");
      coreGradient.addColorStop(0.5, "rgba(6, 182, 212, 0.4)");
      coreGradient.addColorStop(1, "rgba(6, 182, 212, 0.1)");
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
      ctx.fillStyle = coreGradient;
      ctx.fill();

      // Anillos pulsantes del Arc
      for (let i = 0; i < 3; i++) {
        const ringRadius = 50 + i * 40;
        const pulse = Math.sin(time * 2 + i) * 10;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, ringRadius + pulse, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(34, 211, 238, ${0.3 - i * 0.08})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Dibujar y animar partículas
      particles.forEach((p) => {
        // Orbitar alrededor del centro
        p.angle += p.speed;
        
        const x = centerX + Math.cos(p.angle) * p.radius;
        const y = centerY + Math.sin(p.angle) * p.radius;

        // Partícula
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 211, 238, ${p.opacity})`;
        ctx.fill();

        // Rastro/línea al centro (ocasional)
        if (Math.random() > 0.95) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(centerX, centerY);
          ctx.strokeStyle = `rgba(34, 211, 238, 0.1)`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });

      // Resplandor exterior
      const outerGlow = ctx.createRadialGradient(
        centerX, centerY, 100,
        centerX, centerY, 300
      );
      outerGlow.addColorStop(0, "rgba(34, 211, 238, 0.05)");
      outerGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, 300, 0, Math.PI * 2);
      ctx.fillStyle = outerGlow;
      ctx.fill();

      animationId = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      const c = canvasRef.current;
      if (!c) return;
      c.width = window.innerWidth;
      c.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
        opacity: 0.6
      }}
    />
  );
}