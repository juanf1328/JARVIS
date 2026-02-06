// Reactor Arc para JARVIS y ULTRON
export function ArcReactorLogo() {
  return (
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
  );
}

// Jeroglíficos egipcios para HORUS
export function HorusLogo() {
  return (
    <div className="horus-logo">
      <svg viewBox="0 0 200 200" className="horus-svg">
        {/* Ojo de Horus */}
        <g className="eye-of-horus">
          {/* Ojo principal */}
          <ellipse cx="100" cy="100" rx="60" ry="40" fill="none" stroke="currentColor" strokeWidth="3"/>
          {/* Pupila */}
          <circle cx="100" cy="100" r="20" fill="currentColor" opacity="0.8"/>
          {/* Línea inferior característica */}
          <path d="M 60 100 Q 60 130 80 140" fill="none" stroke="currentColor" strokeWidth="3"/>
          {/* Espiral debajo */}
          <path d="M 80 140 Q 85 145 90 140 Q 95 135 90 130" fill="none" stroke="currentColor" strokeWidth="2"/>
          {/* Ceja */}
          <path d="M 50 80 Q 100 70 150 80" fill="none" stroke="currentColor" strokeWidth="3"/>
          {/* Lágrima/marca */}
          <line x1="140" y1="100" x2="160" y2="120" stroke="currentColor" strokeWidth="2"/>
        </g>
        {/* Rayos del sol */}
        <g className="sun-rays" opacity="0.6">
          <line x1="100" y1="30" x2="100" y2="10" stroke="currentColor" strokeWidth="2"/>
          <line x1="140" y1="40" x2="155" y2="25" stroke="currentColor" strokeWidth="2"/>
          <line x1="160" y1="80" x2="180" y2="70" stroke="currentColor" strokeWidth="2"/>
          <line x1="60" y1="40" x2="45" y2="25" stroke="currentColor" strokeWidth="2"/>
          <line x1="40" y1="80" x2="20" y2="70" stroke="currentColor" strokeWidth="2"/>
        </g>
      </svg>
    </div>
  );
}

// Luna creciente para KHONSHU
export function KhonshuLogo() {
  return (
    <div className="khonshu-logo">
      <svg viewBox="0 0 200 200" className="khonshu-svg">
        {/* Luna creciente */}
        <g className="crescent-moon">
          <circle cx="100" cy="100" r="60" fill="currentColor" opacity="0.9"/>
          <circle cx="115" cy="100" r="55" fill="var(--bg-color, #000)" opacity="1"/>
          {/* Estrellas alrededor */}
          <g className="stars">
            <path d="M 50 50 L 52 55 L 57 56 L 52 58 L 50 63 L 48 58 L 43 56 L 48 55 Z" fill="currentColor"/>
            <path d="M 150 60 L 152 65 L 157 66 L 152 68 L 150 73 L 148 68 L 143 66 L 148 65 Z" fill="currentColor"/>
            <path d="M 160 140 L 162 145 L 167 146 L 162 148 L 160 153 L 158 148 L 153 146 L 158 145 Z" fill="currentColor"/>
            <path d="M 40 130 L 42 135 L 47 136 L 42 138 L 40 143 L 38 138 L 33 136 L 38 135 Z" fill="currentColor"/>
          </g>
          {/* Anillos orbitales */}
          <ellipse cx="100" cy="100" rx="80" ry="80" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
          <ellipse cx="100" cy="100" rx="90" ry="90" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
        </g>
      </svg>
    </div>
  );
}

// Código binario/matriz para ZERO
export function ZeroLogo() {
  return (
    <div className="zero-logo">
      <svg viewBox="0 0 200 200" className="zero-svg">
        {/* Círculo principal con efecto de código */}
        <g className="digital-circle">
          <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 100 100"
              to="360 100 100"
              dur="20s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="360 100 100"
              to="0 100 100"
              dur="15s"
              repeatCount="indefinite"
            />
          </circle>
          {/* Número 0 central */}
          <text x="100" y="120" fontSize="80" fontWeight="bold" textAnchor="middle" fill="currentColor" fontFamily="monospace">0</text>
          {/* Binarios orbitando */}
          <g className="binary-orbit" fontSize="12" fontFamily="monospace" fill="currentColor" opacity="0.7">
            <text x="100" y="40">1010</text>
            <text x="160" y="100">0110</text>
            <text x="100" y="180">1100</text>
            <text x="30" y="100">0011</text>
          </g>
        </g>
      </svg>
    </div>
  );
}

// Escudo de murciélago para ALFRED
export function AlfredLogo() {
  return (
    <div className="alfred-logo">
      <svg viewBox="0 0 200 200" className="alfred-svg">
        {/* Escudo de murciélago estilizado */}
        <g className="bat-shield">
          {/* Círculo exterior */}
          <circle cx="100" cy="100" r="75" fill="none" stroke="currentColor" strokeWidth="2"/>
          {/* Silueta de murciélago */}
          <path 
            d="M 100 60 
               Q 85 75 70 75 Q 60 75 55 85 Q 50 95 60 100 
               Q 70 95 80 100 
               L 100 120 
               L 120 100 
               Q 130 95 140 100 Q 150 95 145 85 Q 140 75 130 75 
               Q 115 75 100 60 Z" 
            fill="currentColor" 
            opacity="0.9"
          />
          {/* Orejas del murciélago */}
          <path d="M 70 75 L 60 60 L 65 75" fill="currentColor"/>
          <path d="M 130 75 L 140 60 L 135 75" fill="currentColor"/>
          {/* Detalles góticos */}
          <g opacity="0.4" stroke="currentColor" fill="none" strokeWidth="1">
            <circle cx="100" cy="100" r="85"/>
            <circle cx="100" cy="100" r="65"/>
          </g>
        </g>
      </svg>
    </div>
  );
}

// Calavera robótica para ULTRON
export function UltronLogo() {
  return (
    <div className="arc-reactor ultron-reactor">
      {/* Reutilizamos el reactor arc pero con temática de Ultron */}
      <div className="arc-core ultron-core" />
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
  );
}