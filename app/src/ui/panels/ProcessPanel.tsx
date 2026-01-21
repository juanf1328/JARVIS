import { useState, useEffect } from "react";
import Panel from "../Panel";

interface Props {
  messageCount: number;
  identity: string;
}

const IDENTITY_TITLES: Record<string, string> = {
  jarvis: "PROCESOS",
  zero: "OPERACIONES",
  alfred: "TAREAS ACTIVAS",
  horus: "RITUALES ACTIVOS",
};

export default function ProcessPanel({ messageCount, identity }: Props) {
  const [uptime, setUptime] = useState(0);
  const [activeThreads, setActiveThreads] = useState(4);

  useEffect(() => {
    const interval = setInterval(() => {
      setUptime((prev) => prev + 1);
      setActiveThreads(3 + Math.floor(Math.random() * 3));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const isHorus = identity === "horus";
  const title = IDENTITY_TITLES[identity] || "PROCESOS";

  return (
    <Panel title={title} identity={identity}>
      <div style={{ fontSize: "0.7rem", lineHeight: "1.6" }}>
        <div>{isHorus ? "𓇳" : "⏱️"} {isHorus ? "TIEMPO" : "UPTIME"}: {formatTime(uptime)}</div>
        <div>{isHorus ? "𓂋" : "💬"} {isHorus ? "MENSAJES" : "MESSAGES"}: {messageCount}</div>
        <div>{isHorus ? "𓆙" : "🧵"} {isHorus ? "HEBRAS" : "THREADS"}: {activeThreads}</div>
        <div style={{ marginTop: "0.5rem" }}>
          <div>OLLAMA: {isHorus ? "ACTIVO" : "RUNNING"}</div>
          <div>NODE: {isHorus ? "ACTIVO" : "RUNNING"}</div>
          <div>REACT: {isHorus ? "ACTIVO" : "RUNNING"}</div>
        </div>
      </div>
    </Panel>
  );
}