import { useState, useEffect } from "react";
import Panel from "../Panel";

interface Props {
  identity: string;
}

const IDENTITY_TITLES: Record<string, string> = {
  jarvis: "DIAGNÓSTICO",
  zero: "ANÁLISIS GLOBAL",
  alfred: "CONDICIONES EXTERNAS",
  horus: "VISIÓN DEL CIELO",
};

export default function DiagnosticPanel({ identity }: Props) {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://wttr.in/Cordoba,Argentina?format=j1")
      .then((r) => r.json())
      .then((data) => {
        setWeather(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const isHorus = identity === "horus";
  const title = IDENTITY_TITLES[identity] || "DIAGNÓSTICO";

  const getWeatherIcon = () => {
    if (!weather) return "☁️";
    const desc = weather.current_condition[0].weatherDesc[0].value.toLowerCase();
    if (isHorus) {
      if (desc.includes("sun") || desc.includes("clear")) return "☥"; // Ankh
      if (desc.includes("rain")) return "𓇔"; // Water
      if (desc.includes("cloud")) return "𓇊"; // Sky
      return "☥";
    }
    if (desc.includes("sun") || desc.includes("clear")) return "☀️";
    if (desc.includes("rain")) return "🌧️";
    if (desc.includes("cloud")) return "☁️";
    return "🌤️";
  };

  return (
    <Panel title={title} identity={identity}>
      {loading ? (
        <div>{isHorus ? "𓂀 ESCANEANDO..." : "SCANNING..."}</div>
      ) : weather ? (
        <div style={{ fontSize: "0.7rem", lineHeight: "1.4" }}>
          <div>{isHorus ? "𓉔" : "📍"} CÓRDOBA, AR</div>
          <div>{isHorus ? "𓇳" : "🌡️"} {weather.current_condition[0].temp_C}°C</div>
          <div>{getWeatherIcon()} {weather.current_condition[0].weatherDesc[0].value}</div>
          <div>{isHorus ? "𓇋" : "💨"} {weather.current_condition[0].windspeedKmph} km/h</div>
          <div>{isHorus ? "𓇔" : "💧"} {weather.current_condition[0].humidity}% HUM</div>
        </div>
      ) : (
        <div>{isHorus ? "𓃀 DESCONECTADO" : "OFFLINE"}</div>
      )}
    </Panel>
  );
}