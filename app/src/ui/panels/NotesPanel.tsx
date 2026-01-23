import { useState, useEffect } from "react";
import Panel from "../Panel";

interface Props {
  identity: string;
}

const IDENTITY_TITLES: Record<string, string> = {
  jarvis: "NOTAS RÁPIDAS",
  zero: "DECRETOS",
  alfred: "MEMORÁNDUM",
  horus: "INSCRIPCIONES",
};

export default function NotesPanel({ identity }: Props) {
  const [notes, setNotes] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const isHorus = identity === "horus";
  const title = IDENTITY_TITLES[identity] || "NOTAS RÁPIDAS";

  useEffect(() => {
    const saved = localStorage.getItem("jarvis-notes");
    if (saved) {
      try {
        setNotes(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const addNote = () => {
    if (!input.trim()) return;
    const newNotes = [...notes, input.trim()].slice(-3); // Solo últimas 3
    setNotes(newNotes);
    localStorage.setItem("jarvis-notes", JSON.stringify(newNotes));
    setInput("");
  };

  const clearNotes = () => {
    setNotes([]);
    localStorage.removeItem("jarvis-notes");
  };

  return (
    <Panel title={title} identity={identity}>
      <div style={{ fontSize: "0.65rem", lineHeight: "1.4", height: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, overflowY: "auto", marginBottom: "0.5rem" }}>
          {notes.length === 0 ? (
            <div style={{ opacity: 0.4 }}>[ SIN NOTAS ]</div>
          ) : (
            notes.map((note, i) => (
              <div key={i} style={{ marginBottom: "0.4rem", paddingLeft: "0.5rem", borderLeft: "2px solid currentColor", opacity: 0.8 }}>
                {isHorus && "𓂋 "}{note}
              </div>
            ))
          )}
        </div>
        <div style={{ display: "flex", gap: "0.25rem" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addNote()}
            placeholder="Nueva nota..."
            style={{
              flex: 1,
              background: "rgba(0,0,0,0.3)",
              border: "1px solid currentColor",
              borderRadius: "3px",
              padding: "0.25rem 0.5rem",
              color: "inherit",
              fontSize: "0.65rem",
              outline: "none"
            }}
          />
          <button
            onClick={addNote}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid currentColor",
              borderRadius: "3px",
              padding: "0.25rem 0.5rem",
              color: "inherit",
              fontSize: "0.65rem",
              cursor: "pointer"
            }}
          >
            +
          </button>
          <button
            onClick={clearNotes}
            style={{
              background: "rgba(255,0,0,0.1)",
              border: "1px solid currentColor",
              borderRadius: "3px",
              padding: "0.25rem 0.5rem",
              color: "inherit",
              fontSize: "0.65rem",
              cursor: "pointer"
            }}
          >
            ✕
          </button>
        </div>
      </div>
    </Panel>
  );
}