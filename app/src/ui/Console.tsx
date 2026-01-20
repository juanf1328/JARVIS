import { useState } from "react";

interface Props {
  onSend: (text: string) => void;
  onResponse: (text: string, identity?: string) => void;
}

export default function Console({ onSend, onResponse }: Props) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  function detectarIdentity(text: string): string {
    const lower = text.toLowerCase().trim();
    if (lower.startsWith("jarvis")) return "jarvis";
    if (lower.startsWith("zero")) return "zero";
    if (lower.startsWith("alfred")) return "alfred";
    if (lower.startsWith("horus")) return "horus";
    return "jarvis";
  }

  async function enviar() {
    if (!input.trim() || loading) return;

    const text = input;
    const identity = detectarIdentity(text);
    const command = text.replace(/^(jarvis|zero|alfred|horus)\s*/i, "");

    setInput("");
    onSend(text);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/jarvis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: command, identity }),
      });

      const data = await res.json();
      onResponse(data.response, identity);
    } catch {
      onResponse("Error de comunicación con el núcleo.", identity);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="console">
      <div className="console-glow" />
      <div className="console-input-container">
        <span className="console-prompt">&gt;_</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enviar()}
          className="console-input"
          placeholder={loading ? "PROCESSING..." : "Enter command..."}
          disabled={loading}
        />
        {loading && <div className="loading-spinner" />}
      </div>
    </div>
  );
}