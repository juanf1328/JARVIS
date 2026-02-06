import { useState, useEffect } from "react";
import "./Login.css";
import { 
  ArcReactorLogo, 
  HorusLogo, 
  KhonshuLogo, 
  ZeroLogo, 
  AlfredLogo, 
  UltronLogo 
} from "./PersonalityLogos";

interface Props {
  onLogin: () => void;
}

const PERSONALIDADES = [
  { name: "JARVIS", subtitle: "Just A Rather Very Intelligent System", mode: "jarvis" },
  { name: "ZERO", subtitle: "Destiny Waits for No One", mode: "zero" },
  { name: "ALFRED", subtitle: "Master Wayne's Loyal Companion", mode: "alfred" },
  { name: "HORUS", subtitle: "The Sky God of Ancient Egypt", mode: "horus" },
  { name: "KHONSHU", subtitle: "The Moon God of Vengeance", mode: "khonshu" },
  { name: "ULTRON", subtitle: "No Strings On Me", mode: "ultron" }
];

export default function Login({ onLogin }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPersonality, setCurrentPersonality] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      
      setTimeout(() => {
        setCurrentPersonality((prev) => (prev + 1) % PERSONALIDADES.length);
        setIsGlitching(false);
      }, 300);
    }, 10000); // 10 segundos

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = () => {
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (username === "jforni" && password === "2nqc4g") {
        onLogin();
      } else {
        setError("ACCESO DENEGADO");
        setLoading(false);
        
        setTimeout(() => {
          setUsername("");
          setPassword("");
          setError("");
        }, 2000);
      }
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleSubmit();
    }
  };

  const persona = PERSONALIDADES[currentPersonality];

  return (
    <div className={`login-container ${persona.mode}-mode ${isGlitching ? "glitching" : ""}`}>
      <div className="login-grid" />
      <div className="login-radial" />

      <div className="login-circles">
        <div className="circle circle-1" />
        <div className="circle circle-2" />
        <div className="circle circle-3" />
      </div>

      <div className="login-content">
        <div className="login-logo">
          {persona.mode === "jarvis" && <ArcReactorLogo />}
          {persona.mode === "ultron" && <UltronLogo />}
          {persona.mode === "horus" && <HorusLogo />}
          {persona.mode === "khonshu" && <KhonshuLogo />}
          {persona.mode === "zero" && <ZeroLogo />}
          {persona.mode === "alfred" && <AlfredLogo />}
        </div>

        <h1 className="login-title">
          <span className={`glitch-text ${isGlitching ? "glitching" : ""}`}>
            {persona.name}
          </span>
        </h1>
        <p className="login-subtitle">
          {persona.subtitle}
        </p>

        <div className="login-form">
          <div className="input-group">
            <div className="input-icon">👤</div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="USERNAME"
              className="login-input"
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="input-group">
            <div className="input-icon">🔒</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="PASSWORD"
              className="login-input"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="login-error">
              <span className="error-icon">⚠</span>
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            className={`login-button ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner" />
                VERIFICANDO...
              </>
            ) : (
              "INICIAR SESIÓN"
            )}
          </button>
        </div>

        <div className="login-footer">
          <div className="status-line">
            <span className="status-dot" />
            SISTEMA EN LÍNEA
          </div>
          <div className="version">v4.5.2</div>
        </div>
      </div>
    </div>
  );
}