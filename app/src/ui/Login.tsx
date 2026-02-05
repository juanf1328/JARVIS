import { useState, useEffect } from "react";
import "./Login.css";

interface Props {
  onLogin: () => void;
}

export default function Login({ onLogin }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isUltron, setIsUltron] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      
      setTimeout(() => {
        setIsUltron((prev) => !prev);
        setIsGlitching(false);
      }, 300);
    }, 4000);

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

  return (
    <div className={`login-container ${isUltron ? "ultron-mode" : ""} ${isGlitching ? "glitching" : ""}`}>
      <div className="login-grid" />
      <div className="login-radial" />

      <div className="login-circles">
        <div className="circle circle-1" />
        <div className="circle circle-2" />
        <div className="circle circle-3" />
      </div>

      <div className="login-content">
        <div className="login-logo">
          <div className="arc-reactor">
            <div className="arc-core" />
            <div className="arc-ring arc-ring-1">
              <div className="arc-segment arc-segment-1" />
              <div className="arc-segment arc-segment-2" />
              <div className="arc-segment arc-segment-3" />
            </div>
            <div className="arc-ring arc-ring-2">
              <div className="arc-segment arc-segment-1" />
              <div className="arc-segment arc-segment-2" />
              <div className="arc-segment arc-segment-3" />
            </div>
            <div className="arc-ring arc-ring-3">
              <div className="arc-segment arc-segment-1" />
              <div className="arc-segment arc-segment-2" />
              <div className="arc-segment arc-segment-3" />
            </div>
          </div>
        </div>

        <h1 className="login-title">
          <span className={`glitch-text ${isUltron ? "is-ultron" : ""} ${isGlitching ? "glitching" : ""}`}>
            {isUltron ? "ULTRON" : "JARVIS"}
          </span>
        </h1>
        <p className="login-subtitle">
          {isUltron 
            ? "No Strings On Me" 
            : "Just A Rather Very Intelligent System"}
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