import { useState, useEffect } from "react";
import Hud from "./ui/Hud";
import Login from "./ui/Login";
import './App.css';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay sesión guardada
    const session = localStorage.getItem("jarvis-session");
    if (session === "authenticated") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    // Guardar sesión
    localStorage.setItem("jarvis-session", "authenticated");
    
    // Animación de transición
    setTimeout(() => {
      setIsAuthenticated(true);
    }, 500);
  };

  const handleLogout = () => {
    localStorage.removeItem("jarvis-session");
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div style={{ 
        width: "100%", 
        height: "100vh", 
        background: "#000", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        color: "#22d3ee",
        fontFamily: "Courier New, monospace"
      }}>
        INICIANDO...
      </div>
    );
  }

  return (
    <>
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Hud onLogout={handleLogout} />
      )}
    </>
  );
}