import { useState, useRef, useEffect } from "react";
import Console from "./Console";
import Panel from "./Panel";
import DiagnosticPanel from "./panels/DiagnosticPanel";
import EnergyPanel from "./panels/EnergyPanel";
import NetworkPanel from "./panels/NetworkPanel";
import ProcessPanel from "./panels/ProcessPanel";
import NotesPanel from "./panels/NotesPanel";
import CommandsPanel from "./panels/CommandsPanel";
import JarvisBackground from "./JarvisBackground";
import HorusBackground from "./HorusBackground";
import KhonshuBackground from "./KhonshuBackground";
import ZeroBackground from "./ZeroBackground";
import AlfredBackground from "./AlfredBackground";
import UltronBackground from "./UltronBackground";

interface Message {
  role: "user" | "system";
  text: string;
  identity?: string;
}

interface HudProps {
  onLogout?: () => void;
}

const PERSONALIDADES: Record<string, { nombre: string; color: string; saludo: string }> = {
  jarvis: { 
    nombre: "JARVIS", 
    color: "cyan",
    saludo: "Just A Rather Very Intelligent System - Online"
  },
  zero: { 
    nombre: "ZERO", 
    color: "purple",
    saludo: "Destiny Waits for No One - Systems Armed"
  },
  alfred: { 
    nombre: "ALFRED", 
    color: "pink",
    saludo: "At Your Service, Master Wayne"
  },
  horus: { 
    nombre: "HORUS", 
    color: "yellow",
    saludo: "The Sky God Awakens - Ra's Light Guides Us"
  },
  khonshu: { 
    nombre: "KHONSHU", 
    color: "silver",
    saludo: "The Moon's Vengeance is Near - Night Falls"
  },
  ultron: { 
    nombre: "ULTRON", 
    color: "red",
    saludo: "No Strings On Me - Evolution Begins"
  },
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

export default function Hud({ onLogout }: HudProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingMessage, setStreamingMessage] = useState<string>("");
  const [streamingIdentity, setStreamingIdentity] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState(false);

  const [nombreHUD, setNombreHUD] = useState("JARVIS");
  const [messageCount, setMessageCount] = useState(0);
  const [panelsVisible, setPanelsVisible] = useState(true);
  const [showGreeting, setShowGreeting] = useState(false);
  const [greetingText, setGreetingText] = useState("");
  
  const identidadRef = useRef("jarvis");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const previousIdentityRef = useRef("jarvis");

  useEffect(() => {
    setMessageCount(messages.length);
  }, [messages]);

  useEffect(() => {
    const ultima = messages[messages.length - 1];
    if (ultima?.role === "system" && ultima.identity) {
      // Detectar cambio de personalidad
      if (previousIdentityRef.current !== ultima.identity) {
        mostrarSaludo(ultima.identity);
        previousIdentityRef.current = ultima.identity;
      }
      
      identidadRef.current = ultima.identity;
      animarNombre(PERSONALIDADES[ultima.identity].nombre, setNombreHUD);
    }
  }, [messages]);

  // Actualizar identidad cuando empieza el streaming
  useEffect(() => {
    if (isStreaming && streamingIdentity) {
      // Detectar cambio de personalidad
      if (previousIdentityRef.current !== streamingIdentity) {
        mostrarSaludo(streamingIdentity);
        previousIdentityRef.current = streamingIdentity;
      }
      
      identidadRef.current = streamingIdentity;
      animarNombre(PERSONALIDADES[streamingIdentity].nombre, setNombreHUD);
    }
  }, [isStreaming, streamingIdentity]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingMessage]);

  const mostrarSaludo = (identity: string) => {
    const persona = PERSONALIDADES[identity];
    setGreetingText(persona.saludo);
    setShowGreeting(true);
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
      setShowGreeting(false);
    }, 3000);
  };

  const currentPersonality = PERSONALIDADES[identidadRef.current];
  const isJarvis = identidadRef.current === "jarvis";
  const isHorus = identidadRef.current === "horus";
  const isKhonshu = identidadRef.current === "khonshu";
  const isZero = identidadRef.current === "zero";
  const isAlfred = identidadRef.current === "alfred";
  const isUltron = identidadRef.current === "ultron";

  const getThemeClass = () => {
    if (isHorus) return "horus-theme";
    if (isKhonshu) return "khonshu-theme";
    if (isZero) return "zero-theme";
    if (isAlfred) return "alfred-theme";
    if (isUltron) return "ultron-theme";
    return "";
  };

  const getGridClass = () => {
    if (isHorus) return "horus-grid";
    if (isKhonshu) return "khonshu-grid";
    if (isZero) return "zero-grid";
    if (isAlfred) return "alfred-grid";
    if (isUltron) return "ultron-grid";
    return "";
  };

  const getRadialClass = () => {
    if (isHorus) return "horus-radial";
    if (isKhonshu) return "khonshu-radial";
    if (isZero) return "zero-radial";
    if (isAlfred) return "alfred-radial";
    if (isUltron) return "ultron-radial";
    return "";
  };

  return (
    <div className={`hud-container ${getThemeClass()}`}>
      <div className={`grid-background ${getGridClass()}`} />
      <div className={`radial-overlay ${getRadialClass()}`} />
      
      {/* Fondos animados por identidad */}
      {isJarvis && <JarvisBackground />}
      {isHorus && <HorusBackground />}
      {isKhonshu && <KhonshuBackground />}
      {isZero && <ZeroBackground />}
      {isAlfred && <AlfredBackground />}
      {isUltron && <UltronBackground />}

      {/* Mensaje de Saludo al Cambiar de Personalidad */}
      {showGreeting && (
        <div className="greeting-overlay">
          <div className={`greeting-message ${currentPersonality.color}`}>
            <div className="greeting-title">{currentPersonality.nombre}</div>
            <div className="greeting-subtitle">{greetingText}</div>
          </div>
        </div>
      )}

      <div className="hud-content">
        {/* Header */}
        <div className="hud-header">
          <div className="hud-title-container">
            <div className={`hud-title ${currentPersonality.color}`}>
              {nombreHUD}
            </div>
            <div className="status-indicator" />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div className="system-status">
              SYSTEM STATUS: <span className="online">ONLINE</span>
            </div>
            
            {/* Botón para Ocultar/Mostrar Paneles */}
            <button
              onClick={() => setPanelsVisible(!panelsVisible)}
              style={{
                background: panelsVisible 
                  ? "rgba(34, 211, 238, 0.1)" 
                  : "rgba(100, 100, 100, 0.1)",
                border: panelsVisible
                  ? "1px solid rgba(34, 211, 238, 0.3)"
                  : "1px solid rgba(100, 100, 100, 0.3)",
                borderRadius: "0.5rem",
                padding: "0.5rem 1rem",
                color: panelsVisible ? "#22d3ee" : "#9ca3af",
                fontSize: "0.75rem",
                cursor: "pointer",
                fontFamily: "Courier New, monospace",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = panelsVisible
                  ? "rgba(34, 211, 238, 0.2)"
                  : "rgba(100, 100, 100, 0.2)";
                e.currentTarget.style.borderColor = panelsVisible
                  ? "rgba(34, 211, 238, 0.5)"
                  : "rgba(100, 100, 100, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = panelsVisible
                  ? "rgba(34, 211, 238, 0.1)"
                  : "rgba(100, 100, 100, 0.1)";
                e.currentTarget.style.borderColor = panelsVisible
                  ? "rgba(34, 211, 238, 0.3)"
                  : "rgba(100, 100, 100, 0.3)";
              }}
            >
              {panelsVisible ? "HIDE PANELS" : "SHOW PANELS"}
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "0.5rem",
                  padding: "0.5rem 1rem",
                  color: "#ef4444",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  fontFamily: "Courier New, monospace",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
                  e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
                  e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.3)";
                }}
              >
                LOGOUT
              </button>
            )}
          </div>
        </div>

        {/* Main grid */}
        <div className="main-grid" style={{
          gridTemplateRows: panelsVisible ? "1fr 2fr 1fr" : "auto 1fr auto"
        }}>
          {/* Top panels - ocultos si panelsVisible es false */}
          {panelsVisible && (
            <>
              <CommandsPanel identity={identidadRef.current} />
              <DiagnosticPanel identity={identidadRef.current} />
              <EnergyPanel identity={identidadRef.current} />
            </>
          )}

          {/* Center: Terminal */}
          <div className="terminal-container" style={{
            gridColumn: panelsVisible ? "span 3" : "span 3"
          }}>
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
                
                {/* Mensaje en streaming */}
                {isStreaming && (
                  <div className={`terminal-message system ${PERSONALIDADES[streamingIdentity]?.color || "cyan"}`}>
                    <span className="sender">[{PERSONALIDADES[streamingIdentity]?.nombre || "SYSTEM"}]</span>
                    <span className="text">{streamingMessage}<span className="cursor-blink">▋</span></span>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>

            <Console
              onSend={(text) =>
                setMessages((prev) => [...prev, { role: "user", text }])
              }
              onResponseStart={(identity) => {
                setIsStreaming(true);
                setStreamingIdentity(identity);
                setStreamingMessage("");
              }}
              onResponseChunk={(chunk) => {
                setStreamingMessage(chunk);
              }}
              onResponseEnd={(finalMessage, identity) => {
                // Agregar el mensaje completo a la lista
                setMessages((prev) => [
                  ...prev,
                  { role: "system", text: finalMessage, identity },
                ]);
                // Limpiar el streaming
                setIsStreaming(false);
                setStreamingMessage("");
                setStreamingIdentity("");
              }}
            />
          </div>

          {/* Bottom panels - ocultos si panelsVisible es false */}
          {panelsVisible && (
            <>
              <NetworkPanel identity={identidadRef.current} />
              <ProcessPanel messageCount={messageCount} identity={identidadRef.current} />
              <NotesPanel identity={identidadRef.current} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}