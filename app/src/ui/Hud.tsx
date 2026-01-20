import { useState, useRef, useEffect } from "react";
import Console from "./Console";
import Panel from "./Panel";

interface Message {
  role: "user" | "system";
  text: string;
  identity?: string;
}

const PERSONALIDADES: Record<string, { nombre: string; color: string }> = {
  jarvis: { nombre: "JARVIS", color: "cyan" },
  zero: { nombre: "ZERO", color: "purple" },
  alfred: { nombre: "ALFRED", color: "pink" },
  horus: { nombre: "HORUS", color: "blue" },
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
  const identidadRef = useRef("jarvis");
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="hud-container">
      <div className="grid-background" />
      <div className="radial-overlay" />

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
          <Panel title="SISTEMA" color="cyan" />
          <Panel title="DIAGNÓSTICO" color="purple" />
          <Panel title="ENERGÍA" color="pink" />

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
          <Panel title="RED" color="blue" />
          <Panel title="PROCESOS" color="violet" />
          <Panel title="SEGURIDAD" color="pink" />
        </div>
      </div>
    </div>
  );
}