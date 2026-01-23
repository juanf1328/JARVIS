import { useEffect, useRef } from "react";

export default function AlfredBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface Bat {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      wingPhase: number;
    }

    const bats: Bat[] = [];
    const numBats = 8;

    // Crear murciélagos
    for (let i = 0; i < numBats; i++) {
      bats.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 15 + Math.random() * 20,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: 0.1 + Math.random() * 0.15,
        wingPhase: Math.random() * Math.PI * 2
      });
    }

    let animationId: number;

    function drawBat(bat: Bat) {
      if (!ctx) return;

      ctx.save();
      ctx.translate(bat.x, bat.y);
      
      const wingSpan = bat.size * (1 + Math.sin(bat.wingPhase) * 0.3);
      
      ctx.fillStyle = `rgba(120, 120, 120, ${bat.opacity})`;
      
      // Cuerpo
      ctx.beginPath();
      ctx.ellipse(0, 0, bat.size * 0.3, bat.size * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Alas
      ctx.beginPath();
      ctx.moveTo(-wingSpan, 0);
      ctx.quadraticCurveTo(-wingSpan * 0.7, -bat.size * 0.8, 0, 0);
      ctx.quadraticCurveTo(wingSpan * 0.7, -bat.size * 0.8, wingSpan, 0);
      ctx.fill();
      
      ctx.restore();
    }

    function animate() {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      bats.forEach((bat) => {
        drawBat(bat);

        // Movimiento
        bat.x += bat.speedX;
        bat.y += bat.speedY;
        bat.wingPhase += 0.1;

        // Rebotar en los bordes
        if (bat.x < -50 || bat.x > canvas.width + 50) {
          bat.speedX *= -1;
        }
        if (bat.y < -50 || bat.y > canvas.height + 50) {
          bat.speedY *= -1;
        }

        // Cambios aleatorios de dirección
        if (Math.random() > 0.99) {
          bat.speedX += (Math.random() - 0.5) * 0.2;
          bat.speedY += (Math.random() - 0.5) * 0.2;
          
          // Limitar velocidad
          bat.speedX = Math.max(-1, Math.min(1, bat.speedX));
          bat.speedY = Math.max(-0.7, Math.min(0.7, bat.speedY));
        }
      });

      animationId = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
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