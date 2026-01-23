import { useState, useEffect } from "react";
import Panel from "../Panel";

interface Props {
  identity: string;
}

interface Comando {
  comando: string;
  disponible: boolean;
}

const IDENTITY_TITLES: Record<string, string> = {
  jarvis: "COMANDOS",
  zero: "ARSENAL",
  alfred: "FUNCIONES",
  horus: "PODERES",
};

export default function CommandsPanel({ identity }: Props) {
  const [commands, setCommands] = useState<Comando[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/comandos")
      .then((r) => r.json())
      .then((data) => {
        setCommands(data.comandos);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const isHorus = identity === "horus";
  const isZero = identity === "zero";
  const isAlfred = identity === "alfred";
  const title = IDENTITY_TITLES[identity] || "COMANDOS";

  const displayCommands = showAll ? commands : commands.slice(0, 5);
  const availableCount = commands.filter(c => c.disponible).length;

  const getIcon = () => {
    if (isHorus) return "𓋹";
    if (isZero) return "⚡";
    if (isAlfred) return "🎩";
    return "⚙️";
  };

  return (
    <Panel title={title} identity={identity}>
      {loading ? (
        <div style={{ fontSize: "0.7rem" }}>CARGANDO...</div>
      ) : (
        <div style={{ fontSize: "0.65rem", lineHeight: "1.3", height: "100%", display: "flex", flexDirection: "column" }}>
          <div style={{ marginBottom: "0.5rem", opacity: 0.7 }}>
            {getIcon()} {availableCount} disponibles
          </div>
          
          <div style={{ flex: 1, overflowY: "auto", marginBottom: "0.5rem" }}>
            {displayCommands.map((cmd, i) => (
              <div 
                key={i} 
                style={{ 
                  marginBottom: "0.3rem",
                  opacity: cmd.disponible ? 1 : 0.4,
                  fontSize: "0.6rem"
                }}
              >
                <span style={{ color: cmd.disponible ? "inherit" : "#666" }}>
                  {cmd.disponible ? "✓" : "✗"} {cmd.comando}
                </span>
              </div>
            ))}
          </div>

          {commands.length > 5 && (
            <button
              onClick={() => setShowAll(!showAll)}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid currentColor",
                borderRadius: "3px",
                padding: "0.25rem 0.5rem",
                color: "inherit",
                fontSize: "0.6rem",
                cursor: "pointer",
                width: "100%"
              }}
            >
              {showAll ? "Mostrar menos" : `Mostrar todos (${commands.length})`}
            </button>
          )}
        </div>
      )}
    </Panel>
  );
}