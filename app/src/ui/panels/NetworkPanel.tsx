import { useState, useEffect } from "react";
import Panel from "../Panel";

interface Props {
  identity: string;
}

const IDENTITY_TITLES: Record<string, string> = {
  jarvis: "RED",
  zero: "CONEXIÓN GLOBAL",
  alfred: "COMUNICACIONES",
  horus: "NEXO CÓSMICO",
};

export default function NetworkPanel({ identity }: Props) {
  const [ping, setPing] = useState(0);
  const [status, setStatus] = useState("ONLINE");

  useEffect(() => {
    const interval = setInterval(async () => {
      const start = performance.now();
      try {
        await fetch("https://www.google.com/favicon.ico", { 
          mode: "no-cors",
          cache: "no-store" 
        });
        const latency = performance.now() - start;
        setPing(Math.round(latency));
        setStatus("ONLINE");
      } catch {
        setPing(999);
        setStatus("OFFLINE");
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const quality = ping < 50 ? "EXCELLENT" : ping < 100 ? "GOOD" : ping < 200 ? "FAIR" : "POOR";
  const color = ping < 50 ? "#4ade80" : ping < 100 ? "#22d3ee" : ping < 200 ? "#f59e0b" : "#ef4444";
  const isHorus = identity === "horus";
  const title = IDENTITY_TITLES[identity] || "RED";

  const statusText = isHorus 
    ? (status === "ONLINE" ? "CONECTADO" : "DESCONECTADO")
    : status;

  const qualityText = isHorus ? {
    "EXCELLENT": "PERFECTO",
    "GOOD": "BUENO",
    "FAIR": "ACEPTABLE",
    "POOR": "DÉBIL"
  }[quality] : quality;

  return (
    <Panel title={title} identity={identity}>
      <div style={{ fontSize: "0.7rem", lineHeight: "1.6" }}>
        <div>STATUS: <span style={{ color }}>{statusText}</span></div>
        <div>PING: {ping}ms</div>
        <div>{isHorus ? "CALIDAD" : "QUALITY"}: {qualityText}</div>
        <div style={{ marginTop: "0.5rem" }}>
          {isHorus ? "𓇼" : "🌐"} IPv4: {status === "ONLINE" ? "CONNECTED" : "DOWN"}
        </div>
        <div>
          {isHorus ? "𓋴" : "📡"} {isHorus ? "ANCHO DE BANDA" : "BANDWIDTH"}: {status === "ONLINE" ? "STABLE" : "LIMITED"}
        </div>
      </div>
    </Panel>
  );
}