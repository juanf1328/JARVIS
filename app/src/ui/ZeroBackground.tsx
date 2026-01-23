import { useEffect, useRef } from "react";

export default function ZeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Caracteres para el efecto Matrix/Hacker
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*(){}[]<>|/\\~`";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);

    interface Drop {
      y: number;
      speed: number;
      opacity: number;
    }

    const drops: Drop[] = [];

    // Inicializar gotas
    for (let i = 0; i < columns; i++) {
      drops[i] = {
        y: Math.random() * -100,
        speed: Math.random() * 0.5 + 0.3,
        opacity: Math.random() * 0.5 + 0.3
      };
    }

    let animationId: number;

    function animate() {
      if (!ctx || !canvas) return;

      // Fade effect para crear el trail
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px 'Courier New', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];
        
        // Carácter aleatorio
        const char = chars[Math.floor(Math.random() * chars.length)];
        
        // Color verde brillante con variación
        const greenIntensity = Math.floor(200 + Math.random() * 55);
        ctx.fillStyle = `rgba(34, ${greenIntensity}, 94, ${drop.opacity})`;
        
        const x = i * fontSize;
        const y = drop.y * fontSize;
        
        ctx.fillText(char, x, y);

        // Primera línea más brillante
        if (drop.y * fontSize > 0 && drop.y * fontSize < fontSize) {
          ctx.fillStyle = `rgba(100, 255, 150, ${drop.opacity + 0.3})`;
          ctx.fillText(char, x, y);
        }

        // Mover la gota
        drop.y += drop.speed;

        // Reiniciar cuando sale de la pantalla
        if (drop.y * fontSize > canvas.height && Math.random() > 0.975) {
          drop.y = 0;
          drop.speed = Math.random() * 0.5 + 0.3;
          drop.opacity = Math.random() * 0.5 + 0.3;
        }
      }

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