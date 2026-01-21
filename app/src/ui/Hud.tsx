import { useState, useRef, useEffect } from "react";
import Console from "./Console";
import Panel from "./Panel";
import DiagnosticPanel from "./panels/DiagnosticPanel";
import EnergyPanel from "./panels/EnergyPanel";
import NetworkPanel from "./panels/NetworkPanel";
import ProcessPanel from "./panels/ProcessPanel";
import SecurityPanel from "./panels/SecurityPanel";

interface Message {
  role: "user" | "system";
  text: string;
  identity?: string;
}

const PERSONALIDADES: Record<string, { nombre: string; color: string }> = {
  jarvis: { nombre: "JARVIS", color: "cyan" },
  zero: { nombre: "ZERO", color: "purple" },
  alfred: { nombre: "ALFRED", color: "pink" },
  horus: { nombre: "HORUS", color: "yellow" },
};

function animarNombre(targetName: string, setNombre: (n: string) => void) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*";
  let frame = 0;
  const totalFrames = 12;

  const interval = setInterval(() => {
    frame++;
    const display = targetName
      .split("")
      .map((c, i) =>
        Math.random() < frame / totalFrames ? c : chars[Math.floor(Math.random() * chars.length)]
      )
      .join("");
    setNombre(display);
    if (frame >= totalFrames) clearInterval(interval);
  }, 50);
}

export default function Hud() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      text: "Sistema en línea. Esperando órdenes...",
      identity: "jarvis",
    },
  ]);

  const [nombreHUD, setNombreHUD] = useState("JARVIS");
  const [messageCount, setMessageCount] = useState(0);
  const identidadRef = useRef("jarvis");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessageCount(messages.length);
  }, [messages]);

  useEffect(() => {
    const ultima = messages[messages.length - 1];
    if (ultima?.role === "system" && ultima.identity) {
      identidadRef.current = ultima.identity;
      animarNombre(PERSONALIDADES[ultima.identity].nombre, setNombreHUD);
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const currentPersonality = PERSONALIDADES[identidadRef.current];
  const isHorus = identidadRef.current === "horus";

  return (
    <div className={`hud-container ${isHorus ? "horus-theme" : ""}`}>
      <div className={`grid-background ${isHorus ? "horus-grid" : ""}`} />
      <div className={`radial-overlay ${isHorus ? "horus-radial" : ""}`} />

      <div className="hud-content">
        {/* Header */}
        <div className="hud-header">
          <div className="hud-title-container">
            <div className={`hud-title ${currentPersonality.color}`}>
              {nombreHUD}
            </div>
            <div className="status-indicator" />
          </div>
          <div className="system-status">
            SYSTEM STATUS: <span className="online">ONLINE</span>
          </div>
        </div>

        {/* Main grid */}
        <div className="main-grid">
          {/* Top panels */}
          <Panel title="SISTEMA" color="cyan" identity={identidadRef.current}>
            <div style={{ fontSize: '0.7rem' }}>
              <div>KERNEL: v4.5.2</div>
              <div>UPTIME: {Math.floor(Date.now() / 3600000 % 24)}h</div>
              <div>STATUS: OPERATIONAL</div>
            </div>
          </Panel>
          <DiagnosticPanel identity={identidadRef.current} />
          <EnergyPanel identity={identidadRef.current} />

          {/* Center: Terminal */}
          <div className="terminal-container">
            <div className="terminal">
              <div className="terminal-messages">
                {messages.map((m, i) => {
                  const persona = PERSONALIDADES[m.identity || "jarvis"];
                  const colorClass = m.role === "system" ? persona.color : "";
                  const displayNombre = m.role === "system"
                    ? (m.identity === identidadRef.current ? nombreHUD : persona.nombre)
                    : "USER";

                  return (
                    <div key={i} className={`terminal-message ${m.role} ${colorClass}`}>
                      <span className="sender">[{displayNombre}]</span>
                      <span className="text">{m.text}</span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <Console
              onSend={(text) =>
                setMessages((prev) => [...prev, { role: "user", text }])
              }
              onResponse={(text, identity = "jarvis") =>
                setMessages((prev) => [
                  ...prev,
                  { role: "system", text, identity },
                ])
              }
            />
          </div>

          {/* Bottom panels */}
          <NetworkPanel identity={identidadRef.current} />
          <ProcessPanel messageCount={messageCount} identity={identidadRef.current} />
          <SecurityPanel identity={identidadRef.current} />
        </div>
      </div>
    </div>
  );
}