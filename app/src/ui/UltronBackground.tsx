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

    interface LED {
      x: number;
      y: number;
      size: number;
      brightness: number;
      flickerSpeed: number;
      color: string;
    }

    const leds: LED[] = [];
    const spacing = 40;
    const cols = Math.ceil(canvas.width / spacing);
    const rows = Math.ceil(canvas.height / spacing);

    // Crear grid de LEDs
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        leds.push({
          x: col * spacing + spacing / 2,
          y: row * spacing + spacing / 2,
          size: 3,
          brightness: Math.random(),
          flickerSpeed: Math.random() * 0.05 + 0.02,
          color: Math.random() > 0.5 ? "violet" : "red"
        });
      }
    }

    let animationId: number;
    let time = 0;

    function animate() {
      const c = canvasRef.current;
      if (!c || !ctx) return;

      time += 0.01;

      // Fondo oscuro
      ctx.fillStyle = "rgba(26, 5, 32, 0.1)";
      ctx.fillRect(0, 0, c.width, c.height);

      // Dibujar LEDs parpadeantes
      leds.forEach((led) => {
        // Glitch aleatorio ocasional
        const glitch = Math.random() > 0.98 ? Math.random() * 0.5 : 0;
        
        // Parpadeo usando seno + ruido
        led.brightness = Math.abs(Math.sin(time * led.flickerSpeed + glitch)) * 0.8 + 0.2;

        // Ocasionalmente cambiar brillo bruscamente (efecto LED)
        if (Math.random() > 0.97) {
          led.brightness = Math.random();
        }

        // Color del LED
        const color = led.color === "violet" 
          ? `rgba(139, 92, 246, ${led.brightness})`
          : `rgba(239, 68, 68, ${led.brightness})`;

        // Dibujar LED
        ctx.beginPath();
        ctx.arc(led.x, led.y, led.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Resplandor
        if (led.brightness > 0.6) {
          ctx.beginPath();
          ctx.arc(led.x, led.y, led.size * 4, 0, Math.PI * 2);
          const glowColor = led.color === "violet"
            ? `rgba(139, 92, 246, ${led.brightness * 0.2})`
            : `rgba(239, 68, 68, ${led.brightness * 0.2})`;
          ctx.fillStyle = glowColor;
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
      
      // Recrear LEDs con nuevo tamaño
      leds.length = 0;
      const newCols = Math.ceil(c.width / spacing);
      const newRows = Math.ceil(c.height / spacing);
      for (let row = 0; row < newRows; row++) {
        for (let col = 0; col < newCols; col++) {
          leds.push({
            x: col * spacing + spacing / 2,
            y: row * spacing + spacing / 2,
            size: 3,
            brightness: Math.random(),
            flickerSpeed: Math.random() * 0.05 + 0.02,
            color: Math.random() > 0.5 ? "violet" : "red"
          });
        }
      }
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