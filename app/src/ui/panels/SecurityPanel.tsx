import { useState, useEffect } from "react";
import Panel from "../Panel";

interface Props {
  identity: string;
}

const IDENTITY_TITLES: Record<string, string> = {
  jarvis: "SEGURIDAD",
  zero: "DEFENSA",
  alfred: "PROTECCIÓN",
  horus: "GUARDIANES",
};

const COLORS: Record<string, { grad1: string; grad2: string; bg: string }> = {
  jarvis: { grad1: "#ec4899", grad2: "#f472b6", bg: "rgba(236, 72, 153, 0.2)" },
  zero: { grad1: "#a855f7", grad2: "#c084fc", bg: "rgba(168, 85, 247, 0.2)" },
  alfred: { grad1: "#ec4899", grad2: "#f472b6", bg: "rgba(236, 72, 153, 0.2)" },
  horus: { grad1: "#f59e0b", grad2: "#fbbf24", bg: "rgba(245, 158, 11, 0.2)" },
};

export default function SecurityPanel({ identity }: Props) {
  const [scanProgress, setScanProgress] = useState(0);
  const [threats, setThreats] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanProgress((prev) => (prev >= 100 ? 0 : prev + 5));
      
      if (Math.random() > 0.95) {
        setThreats((prev) => prev + 1);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const status = threats === 0 ? "SECURE" : threats < 3 ? "CAUTION" : "ALERT";
  const color = threats === 0 ? "#4ade80" : threats < 3 ? "#f59e0b" : "#ef4444";
  const isHorus = identity === "horus";
  const title = IDENTITY_TITLES[identity] || "SEGURIDAD";
  const colors = COLORS[identity] || COLORS.jarvis;

  const statusText = isHorus ? {
    "SECURE": "PROTEGIDO",
    "CAUTION": "ALERTA",
    "ALERT": "PELIGRO"
  }[status] : status;

  return (
    <Panel title={title} identity={identity}>
      <div style={{ fontSize: "0.7rem", lineHeight: "1.6" }}>
        <div>
          STATUS: <span style={{ color, fontWeight: "bold" }}>{statusText}</span>
        </div>
        <div>{isHorus ? "𓋴" : "🛡️"} {isHorus ? "AMENAZAS" : "THREATS"}: {threats}</div>
        <div style={{ marginTop: "0.5rem" }}>
          <div>{isHorus ? "ESCANEO" : "SCAN"}: {scanProgress}%</div>
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
                width: `${scanProgress}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${colors.grad1}, ${colors.grad2})`,
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>
        <div style={{ marginTop: "0.5rem" }}>
          <div>FIREWALL: {isHorus ? "ACTIVO" : "ACTIVE"}</div>
          <div>{isHorus ? "CIFRADO" : "ENCRYPTION"}: AES-256</div>
        </div>
      </div>
    </Panel>
  );
}