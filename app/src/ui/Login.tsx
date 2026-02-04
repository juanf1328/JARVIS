import { useState } from "react";
import "./Login.css";

interface Props {
  onLogin: () => void;
}

export default function Login({ onLogin }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setError("");
    setLoading(true);

    // Simular verificación
    setTimeout(() => {
      if (username === "jforni" && password === "2nqc4g") {
        // Login exitoso
        onLogin();
      } else {
        setError("ACCESO DENEGADO");
        setLoading(false);
        
        // Limpiar campos después de error
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
    <div className="login-container">
      {/* Grid Background */}
      <div className="login-grid" />
      <div className="login-radial" />

      {/* Círculos animados */}
      <div className="login-circles">
        <div className="circle circle-1" />
        <div className="circle circle-2" />
        <div className="circle circle-3" />
      </div>

      {/* Logo/Title */}
      <div className="login-content">
        <div className="login-logo">
          <div className="arc-reactor">
            <div className="arc-core" />
            <div className="arc-ring arc-ring-1" />
            <div className="arc-ring arc-ring-2" />
            <div className="arc-ring arc-ring-3" />
          </div>
        </div>

        <h1 className="login-title">
          <span className="glitch" data-text="JARVIS">JARVIS</span>
        </h1>
        <p className="login-subtitle">Just A Rather Very Intelligent System</p>

        {/* Formulario */}
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