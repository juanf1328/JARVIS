import { useEffect, useRef } from "react";

export default function KhonshuBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface Star {
      x: number;
      y: number;
      size: number;
      twinkleSpeed: number;
      opacity: number;
      maxOpacity: number;
    }

    const stars: Star[] = [];
    const numStars = 100;

    // Crear estrellas brillantes
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        opacity: Math.random(),
        maxOpacity: Math.random() * 0.5 + 0.5
      });
    }

    let animationId: number;
    let time = 0;

    function animate() {
      const c = canvasRef.current;
      if (!c || !ctx) return;

      time += 0.01;

      // Fondo negro
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, c.width, c.height);

      // Dibujar luna creciente (efecto sutil)
      const moonX = c.width * 0.85;
      const moonY = c.height * 0.2;
      const moonRadius = 80;

      // Luna llena (fondo)
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
      const moonGradient = ctx.createRadialGradient(
        moonX, moonY, 10,
        moonX, moonY, moonRadius
      );
      moonGradient.addColorStop(0, "rgba(224, 242, 254, 0.3)");
      moonGradient.addColorStop(0.5, "rgba(159, 205, 255, 0.2)");
      moonGradient.addColorStop(1, "rgba(148, 163, 184, 0.1)");
      ctx.fillStyle = moonGradient;
      ctx.fill();

      // Sombra para crear creciente (opcional)
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(moonX + 30, moonY, moonRadius - 5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";

      // Dibujar estrellas con parpadeo
      stars.forEach((star) => {
        // Parpadeo usando seno
        star.opacity += Math.sin(time * star.twinkleSpeed) * 0.01;
        star.opacity = Math.max(0.1, Math.min(star.maxOpacity, star.opacity));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(159, 205, 255, ${star.opacity})`;
        ctx.fill();

        // Efecto de resplandor para algunas estrellas
        if (star.size > 1.5) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(224, 242, 254, ${star.opacity * 0.1})`;
          ctx.fill();
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