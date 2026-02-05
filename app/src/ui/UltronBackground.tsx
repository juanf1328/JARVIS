import { useEffect, useRef } from "react";

export default function UltronBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      opacity: number;
    }

    const particles: Particle[] = [];
    const numParticles = 50;

    // Crear partículas simples
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedY: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.5 + 0.3
      });
    }

    let animationId: number;

    function animate() {
      const c = canvasRef.current;
      if (!c || !ctx) return;

      // Limpiar con transparencia
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, c.width, c.height);

      // Dibujar partículas
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(239, 68, 68, ${p.opacity})`;
        ctx.fill();

        // Mover hacia abajo
        p.y += p.speedY;

        // Reiniciar arriba cuando sale
        if (p.y > c.height) {
          p.y = -10;
          p.x = Math.random() * c.width;
        }
      });

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
        zIndex: 1
      }}
    />
  );
}