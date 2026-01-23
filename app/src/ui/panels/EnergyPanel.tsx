import { useState, useEffect } from "react";
import Panel from "../Panel";

interface Props {
  identity: string;
}

const IDENTITY_TITLES: Record<string, string> = {
  jarvis: "ENERGÍA",
  zero: "PODER",
  alfred: "RECURSOS",
  horus: "KA (FUERZA VITAL)",
};

const COLORS: Record<string, { grad1: string; grad2: string; bg: string }> = {
  jarvis: { grad1: "#ec4899", grad2: "#f472b6", bg: "rgba(236, 72, 153, 0.2)" },
  zero: { grad1: "#22c55e", grad2: "#4ade80", bg: "rgba(34, 197, 94, 0.2)" },
  alfred: { grad1: "#6b7280", grad2: "#9ca3af", bg: "rgba(107, 114, 128, 0.2)" },
  horus: { grad1: "#f59e0b", grad2: "#fbbf24", bg: "rgba(245, 158, 11, 0.2)" },
};

export default function EnergyPanel({ identity }: Props) {
  const [cpu, setCpu] = useState(0);
  const [memory, setMemory] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const baseCpu = 15 + Math.random() * 10;
      const baseMemory = 45 + Math.random() * 15;
      
      setCpu(Math.min(95, baseCpu + (performance.now() % 1000) / 100));
      setMemory(Math.min(95, baseMemory));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const isHorus = identity === "horus";
  const title = IDENTITY_TITLES[identity] || "ENERGÍA";
  const colors = COLORS[identity] || COLORS.jarvis;

  return (
    <Panel title={title} identity={identity}>
      <div style={{ fontSize: "0.7rem", lineHeight: "1.6" }}>
        <div style={{ marginBottom: "0.5rem" }}>
          <div>{isHorus ? "𓋹" : "⚡"} CPU: {cpu.toFixed(1)}%</div>
          <div
            style={{
              width: "100%",
              height: "4px",
              background: colors.bg,
              borderRadius: "2px",
              overflow: "hidden",
              marginTop: "0.25rem",
            }}
          >
            <div
              style={{
                width: `${cpu}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${colors.grad1}, ${colors.grad2})`,
                transition: "width 0.5s ease",
              }}
            />
          </div>
        </div>
        <div>
          <div>{isHorus ? "𓁷" : "🧠"} MEM: {memory.toFixed(1)}%</div>
          <div
            style={{
              width: "100%",
              height: "4px",
              background: colors.bg,
              borderRadius: "2px",
              overflow: "hidden",
              marginTop: "0.25rem",
            }}
          >
            <div
              style={{
                width: `${memory}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${colors.grad1}, ${colors.grad2})`,
                transition: "width 0.5s ease",
              }}
            />
          </div>
        </div>
        <div style={{ marginTop: "0.5rem" }}>
          {isHorus ? "𓋹" : "PWR"}: {cpu < 50 ? (isHorus ? "ESTABLE" : "NOMINAL") : (isHorus ? "ELEVADO" : "HIGH")}
        </div>
      </div>
    </Panel>
  );
}