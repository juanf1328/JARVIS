import { useEffect, useRef } from "react";

export default function HorusBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    // Jeroglíficos egipcios
    const hieroglyphics = [
      "𓀀","𓀁","𓀂","𓀃","𓀄","𓀅","𓀆","𓀇","𓀈","𓀉",
      "𓁷","𓁸","𓁹","𓁺","𓁻","𓁼","𓁽","𓁾","𓁿","𓂀",
      "𓂋","𓂌","𓂍","𓂎","𓂏","𓂐","𓂑","𓂒","𓂓","𓂔",
      "𓃀","𓃁","𓃂","𓃃","𓃄","𓃅","𓃆","𓃇","𓃈","𓃉",
      "𓄀","𓄁","𓄂","𓄃","𓄄","𓄅","𓄆","𓄇","𓄈","𓄉",
      "𓅓","𓅔","𓅕","𓅖","𓅗","𓅘","𓅙","𓅚","𓅛","𓅜",
      "𓆈","𓆉","𓆊","𓆋","𓆌","𓆍","𓆎","𓆏","𓆐","𓆑",
      "𓆙","𓆚","𓆛","𓆜","𓇋","𓇌","𓇍","𓇎","𓇏","𓇐",
      "𓇳","𓇴","𓇵","𓇶","𓇷","𓇸","𓈖","𓈗","𓈘","𓈙",
      "𓉐","𓉑","𓉒","𓉓","𓉔","𓉕","𓊖","𓊗","𓊘","𓊙",
      "𓋴","𓋵","𓋶","𓋷","𓋸","𓋹","☥"
    ];

    interface Glyph {
      char: string;
      x: number;
      y: number;
      speed: number;
      opacity: number;
      size: number;
      rotation: number;
      rotationSpeed: number;
      primary: boolean;
    }

    const glyphs: Glyph[] = [];
    const numGlyphs = 45;

    for (let i = 0; i < numGlyphs; i++) {
      const primary = Math.random() > 0.7;

      glyphs.push({
        char: hieroglyphics[Math.floor(Math.random() * hieroglyphics.length)],
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 0.15 + Math.random() * 0.4,
        opacity: primary ? 0.55 : 0.3,
        size: primary
          ? 70 + Math.random() * 40
          : 32 + Math.random() * 35,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.008,
        primary
      });
    }

    let animationId: number;

    const animate = () => {
      if (!ctx) return;

      // Fade suave (deja estelas)
      ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      glyphs.forEach((glyph) => {
        ctx.save();
        ctx.translate(glyph.x, glyph.y);
        ctx.rotate(glyph.rotation);

        ctx.font = `${glyph.size}px 'Segoe UI Symbol', 'Noto Sans Egyptian Hieroglyphs', serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Glow
        ctx.shadowColor = "rgba(245, 158, 11, 0.6)";
        ctx.shadowBlur = glyph.primary ? 18 : 12;

        // Capa suave
        ctx.fillStyle = `rgba(245, 158, 11, ${glyph.opacity * 0.4})`;
        ctx.fillText(glyph.char, 0, 0);

        // Capa principal
        ctx.fillStyle = `rgba(255, 210, 140, ${glyph.opacity})`;
        ctx.fillText(glyph.char, 0, 0);

        ctx.restore();

        // Movimiento
        glyph.y += glyph.speed;
        glyph.rotation += glyph.rotationSpeed;

        // Pulso vivo
        glyph.opacity += Math.sin(Date.now() * 0.002 + glyph.y) * 0.002;
        glyph.opacity = glyph.primary
          ? Math.max(0.4, Math.min(0.8, glyph.opacity))
          : Math.max(0.2, Math.min(0.6, glyph.opacity));

        // Reset al salir
        if (glyph.y > canvas.height + 80) {
          glyph.y = -80;
          glyph.x = Math.random() * canvas.width;
          glyph.char = hieroglyphics[Math.floor(Math.random() * hieroglyphics.length)];
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1
      }}
    />
  );
}
