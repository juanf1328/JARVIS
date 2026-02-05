import { useState } from "react";

interface Props {
  onSend: (text: string) => void;
  onResponseStart: (identity: string) => void;
  onResponseChunk: (chunk: string) => void;
  onResponseEnd: (finalMessage: string, identity: string) => void;
}

export default function Console({ onSend, onResponseStart, onResponseChunk, onResponseEnd }: Props) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  function detectarIdentity(text: string): string {
    const lower = text.toLowerCase().trim();
    if (lower.startsWith("jarvis")) return "jarvis";
    if (lower.startsWith("zero")) return "zero";
    if (lower.startsWith("alfred")) return "alfred";
    if (lower.startsWith("horus")) return "horus";
    if (lower.startsWith("khonshu")) return "khonshu";
    if (lower.startsWith("ultron")) return "ultron";
    return "jarvis";
  }

  // Función para texto a voz
  function speak(text: string, identity: string) {
    if (!('speechSynthesis' in window)) return;
    
    // Esperar a que las voces estén cargadas
    const speakNow = () => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configurar voz según identidad
      const voices = speechSynthesis.getVoices();
      
      // Buscar voces en español (prioritarias para Argentina/LATAM)
      const spanishVoice = voices.find(v => 
        v.lang.includes('es-AR') || // Argentino
        v.lang.includes('es-MX') || // Mexicano
        v.lang.includes('es-US') || // Español US
        v.lang.includes('es-')      // Cualquier español
      ) || voices[0];
      
      utterance.voice = spanishVoice;
      utterance.lang = 'es-AR'; // Forzar español argentino
      
      // Configurar características según personalidad
      switch(identity) {
        case "jarvis":
          utterance.rate = 1.0;
          utterance.pitch = 1.1;
          utterance.volume = 0.9;
          break;
        case "zero":
          utterance.rate = 0.8;
          utterance.pitch = 0.6;
          utterance.volume = 1.0;
          break;
        case "alfred":
          utterance.rate = 0.95;
          utterance.pitch = 0.85;
          utterance.volume = 0.85;
          break;
        case "horus":
          utterance.rate = 0.85;
          utterance.pitch = 0.75;
          utterance.volume = 0.95;
          break;
      }
      
      speechSynthesis.speak(utterance);
    };

    // Si las voces ya están cargadas, hablar inmediatamente
    if (speechSynthesis.getVoices().length > 0) {
      speakNow();
    } else {
      // Esperar a que se carguen las voces
      speechSynthesis.onvoiceschanged = speakNow;
    }
  }

  async function enviar() {
    if (!input.trim() || loading) return;

    const text = input;
    const identity = detectarIdentity(text);
    const command = text.replace(/^(jarvis|zero|alfred|horus|ultron)\s*/i, "");

    setInput("");
    onSend(text);
    setLoading(true);
    onResponseStart(identity);

    try {
      const res = await fetch("http://localhost:3000/jarvis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: command, identity }),
      });

      const data = await res.json();
      const fullResponse = data.response;

      // Streaming: simular escritura carácter por carácter
      let currentText = "";
      const words = fullResponse.split(" ");
      
      for (let i = 0; i < words.length; i++) {
        const word = words[i] + (i < words.length - 1 ? " " : "");
        currentText += word;
        onResponseChunk(currentText);
        
        // Velocidad de escritura (ajustable)
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Pasar el mensaje completo al finalizar
      onResponseEnd(fullResponse, identity);
      
      // Hablar la respuesta completa
      speak(fullResponse, identity);

    } catch {
      const errorMsg = "Error de comunicación con el núcleo.";
      onResponseChunk(errorMsg);
      onResponseEnd(errorMsg, identity);
      speak(errorMsg, identity);
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