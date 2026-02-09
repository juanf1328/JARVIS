import { useState, type KeyboardEvent } from "react";

// Usar variable de entorno o fallback a localhost
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface ConsoleProps {
  onSend: (message: string) => void;
  onResponseStart: (identity: string) => void;
  onResponseChunk: (chunk: string) => void;
  onResponseEnd: (message: string, identity: string) => void;
}

export default function Console({
  onSend,
  onResponseStart,
  onResponseChunk,
  onResponseEnd,
}: ConsoleProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const message = input.trim();
    setInput("");
    onSend(message);
    setLoading(true);

    try {
      // Detectar identidad basada en palabras clave
      const inputLower = message.toLowerCase();
      let identity = "jarvis";

      if (inputLower.includes("zero") || inputLower.includes("doom")) {
        identity = "zero";
      } else if (inputLower.includes("alfred") || inputLower.includes("wayne")) {
        identity = "alfred";
      } else if (inputLower.includes("horus") || inputLower.includes("ra")) {
        identity = "horus";
      } else if (inputLower.includes("khonshu") || inputLower.includes("luna")) {
        identity = "khonshu";
      } else if (inputLower.includes("ultron") || inputLower.includes("evolución")) {
        identity = "ultron";
      }

      // Iniciar streaming
      onResponseStart(identity);

      const response = await fetch(`${API_URL}/jarvis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: message, identity }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Simular efecto de escritura
      const fullText = data.response;
      let currentText = "";

      for (let i = 0; i < fullText.length; i++) {
        currentText += fullText[i];
        onResponseChunk(currentText);
        await new Promise((resolve) => setTimeout(resolve, 20));
      }

      // Finalizar
      onResponseEnd(fullText, identity);
    } catch (error) {
      console.error("Error:", error);
      const errorMsg = error instanceof Error 
        ? `Error de conexión: ${error.message}. Verifica que el servidor esté corriendo en ${API_URL}`
        : "Error desconocido al conectar con el servidor";
      
      onResponseEnd(errorMsg, "jarvis");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="console-input-container">
      <div className="console-input-wrapper">
        <span className="console-prompt">{">"}</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={loading ? "PROCESANDO..." : "INGRESE COMANDO..."}
          disabled={loading}
          className="console-input"
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="console-send-btn"
        >
          {loading ? "⏳" : "▶"}
        </button>
      </div>
      <div className="api-status">
        <span className={`status-dot ${loading ? 'loading' : 'ready'}`} />
        <span className="status-text">API: {API_URL}</span>
      </div>
    </div>
  );
}