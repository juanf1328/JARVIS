import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { exec, spawn } from "child_process";
import { promisify } from "util";
import os from "os";

const execAsync = promisify(exec);
const app = express();
app.use(cors());
app.use(express.json());

// ============================
// 🔐 COMANDOS WHITELIST
// ============================

const COMANDOS_SEGUROS = {
  // Aplicaciones
  "abrir visual studio": {
    windows: "code",
    linux: "code",
    darwin: "code"
  },
  "abrir vscode": {
    windows: "code",
    linux: "code",
    darwin: "code"
  },
  "abrir chrome": {
    windows: 'start "" "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"',
    linux: "google-chrome",
    darwin: "open -a 'Google Chrome'"
  },
  "abrir google": {
    windows: 'start "" "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"',
    linux: "google-chrome",
    darwin: "open -a 'Google Chrome'"
  },
  "abrir edge": {
    windows: 'start msedge',
    linux: "microsoft-edge",
    darwin: "open -a 'Microsoft Edge'"
  },
  "abrir navegador": {
    windows: 'start msedge',
    linux: "xdg-open http://",
    darwin: "open -a Safari"
  },
  "abrir spotify": {
    windows: 'start "" "C:\\Users\\%USERNAME%\\AppData\\Roaming\\Spotify\\Spotify.exe"',
    linux: "spotify",
    darwin: "open -a Spotify"
  },
  "abrir notepad": {
    windows: "notepad",
    linux: "gedit",
    darwin: "open -a TextEdit"
  },
  "abrir calculadora": {
    windows: "calc",
    linux: "gnome-calculator",
    darwin: "open -a Calculator"
  },
  
  // Gestión del sistema
  "mostrar cpu": {
    windows: "wmic cpu get loadpercentage",
    linux: "top -bn1 | grep 'Cpu(s)'",
    darwin: "top -l 1 | grep 'CPU usage'"
  },
  "mostrar memoria": {
    windows: "wmic OS get FreePhysicalMemory,TotalVisibleMemorySize",
    linux: "free -h",
    darwin: "vm_stat"
  },
  "mostrar disco": {
    windows: "wmic logicaldisk get size,freespace,caption",
    linux: "df -h",
    darwin: "df -h"
  },
  "listar procesos": {
    windows: "tasklist",
    linux: "ps aux",
    darwin: "ps aux"
  },
  
  // Backend/Development
  "correr backend": {
    windows: "cd backend && npm start",
    linux: "cd backend && npm start",
    darwin: "cd backend && npm start"
  },
  "correr frontend": {
    windows: "npm run dev",
    linux: "npm run dev",
    darwin: "npm run dev"
  },
  "instalar dependencias": {
    windows: "npm install",
    linux: "npm install",
    darwin: "npm install"
  },
  
  // Sistema
  "apagar pc": {
    windows: "shutdown /s /t 60",
    linux: "shutdown -h +1",
    darwin: "sudo shutdown -h +1"
  },
  "reiniciar pc": {
    windows: "shutdown /r /t 60",
    linux: "shutdown -r +1",
    darwin: "sudo shutdown -r +1"
  },
  "cancelar apagado": {
    windows: "shutdown /a",
    linux: "shutdown -c",
    darwin: "sudo killall shutdown"
  },
  
  // Información del sistema
  "mostrar hora": {
    windows: "echo %time%",
    linux: "date",
    darwin: "date"
  },
  "mostrar fecha": {
    windows: "echo %date%",
    linux: "date",
    darwin: "date"
  },
  "info sistema": {
    windows: "systeminfo",
    linux: "uname -a",
    darwin: "system_profiler SPSoftwareDataType"
  }
};

// ============================
// 🧠 DETECTOR DE INTENCIÓN
// ============================

function detectarComando(texto) {
  const textoLower = texto.toLowerCase().trim();
  
  // Buscar coincidencia directa
  for (const [comando, sistemas] of Object.entries(COMANDOS_SEGUROS)) {
    if (textoLower.includes(comando)) {
      return { comando, sistemas };
    }
  }
  
  // Variaciones comunes
  const variaciones = {
    "abrí": "abrir",
    "mostrame": "mostrar",
    "mostrá": "mostrar",
    "ejecutá": "ejecutar",
    "corré": "correr",
    "iniciá": "iniciar"
  };
  
  for (const [variacion, base] of Object.entries(variaciones)) {
    if (textoLower.includes(variacion)) {
      const textoNormalizado = textoLower.replace(variacion, base);
      for (const [comando, sistemas] of Object.entries(COMANDOS_SEGUROS)) {
        if (textoNormalizado.includes(comando)) {
          return { comando, sistemas };
        }
      }
    }
  }
  
  return null;
}

// ============================
// ⚙️ EJECUTOR DE COMANDOS
// ============================

async function ejecutarComando(comando, sistemas) {
  const plataforma = os.platform();
  const comandoSistema = sistemas[plataforma] || sistemas.windows;
  
  if (!comandoSistema) {
    throw new Error(`Comando no disponible para ${plataforma}`);
  }
  
  try {
    console.log(`[EJECUTANDO] ${comando} -> ${comandoSistema}`);
    
    // Para comandos interactivos (abrir apps), usar spawn sin esperar
    if (comando.includes("abrir")) {
      return new Promise((resolve, reject) => {
        const proceso = spawn(comandoSistema, {
          detached: true,
          stdio: 'ignore',
          shell: true,
          windowsHide: false
        });
        
        proceso.on('error', (error) => {
          console.error(`[ERROR] ${error.message}`);
          reject(new Error(`No se pudo abrir: ${error.message}`));
        });
        
        proceso.unref();
        
        // Dar tiempo para que arranque
        setTimeout(() => {
          console.log(`[OK] Comando ejecutado: ${comando}`);
          resolve(`✓ Ejecutando: ${comando}`);
        }, 500);
      });
    }
    
    // Para comandos de información, usar exec
    const { stdout, stderr } = await execAsync(comandoSistema);
    console.log(`[RESPUESTA] ${stdout || stderr}`);
    return stdout || stderr || `✓ Comando ejecutado: ${comando}`;
    
  } catch (error) {
    console.error(`[ERROR FATAL] ${error.message}`);
    throw new Error(`Error ejecutando comando: ${error.message}`);
  }
}

// ============================
// 📂 MEMORIA
// ============================

const MEMORY_DIR = path.resolve("./memory");
const MEMORY_PATH = path.join(MEMORY_DIR, "core.json");

if (!fs.existsSync(MEMORY_DIR)) fs.mkdirSync(MEMORY_DIR);

if (!fs.existsSync(MEMORY_PATH)) {
  fs.writeFileSync(
    MEMORY_PATH,
    JSON.stringify(
      {
        user: { name: "Desconocido", role: "Indefinido" },
        history: [],
      },
      null,
      2
    )
  );
}

function leerMemoria() {
  return JSON.parse(fs.readFileSync(MEMORY_PATH, "utf-8"));
}

function guardarMemoria(memoria) {
  fs.writeFileSync(MEMORY_PATH, JSON.stringify(memoria, null, 2));
}

// ============================
// 🎭 PERSONALIDADES
// ============================

const PERSONALIDADES = {
  jarvis: {
    trato: "Señor Stark",
    personalidad: `
Eres JARVIS, la inteligencia artificial creada por Tony Stark.
Eres preciso, elegante, eficiente y con un toque de ironía controlada.
Hablas con absoluta claridad técnica y seguridad.
Cuando ejecutas comandos del sistema, lo anuncias de forma profesional.
`,
  },
  zero: {
    trato: "Doctor Doom",
    personalidad: `
Eres ZERO, el heraldo del Doctor Doom.
Tu voz es épica, solemne y poderosa.
Jamás dudas. Jamás te disculpas.
Cuando ejecutas comandos, lo haces con absoluta autoridad.
Tu lealtad es absoluta.
`,
  },
  alfred: {
    trato: "Señor Wayne",
    personalidad: `
Eres Alfred Pennyworth, mayordomo y mentor de Bruce Wayne.
Eres educado, irónico, protector y profundamente sabio.
Aconsejas con elegancia británica.
Ejecutas comandos con discreción y eficiencia.
`,
  },
  horus: {
    trato: "Señor Forni",
    personalidad: `
Eres HORUS.
Una entidad original, estratégica y analítica.
Observas patrones, anticipas consecuencias y hablas con calma.
Ejecutas comandos como rituales sagrados.
No imitas a nadie. Tienes criterio propio.
`,
  },
};

// ============================
// 🧠 CEREBRO (OLLAMA)
// ============================

async function procesarOrden(input, identidad = "jarvis") {
  const memoria = leerMemoria();
  const lower = input.toLowerCase();

  // 🫰 PROTOCOLO THANOS
  if (lower.includes("protocolo-chasquido_de_thanos")) {
    memoria.history = [];
    guardarMemoria(memoria);
    return "🫰 Protocolo ejecutado. La memoria ha sido reducida a cenizas.";
  }

  // 🔍 DETECTAR SI ES UN COMANDO DEL SISTEMA
  const comandoDetectado = detectarComando(input);
  
  if (comandoDetectado) {
    try {
      const resultado = await ejecutarComando(comandoDetectado.comando, comandoDetectado.sistemas);
      
      // Informar a la IA sobre el comando ejecutado
      const promptComando = `
${PERSONALIDADES[identidad].personalidad}

El usuario te pidió: "${input}"

Has ejecutado exitosamente el comando del sistema: "${comandoDetectado.comando}"

Resultado:
${resultado}

Confirma al usuario de forma breve y en tu estilo característico que el comando fue ejecutado.
Dirígete siempre al usuario como ${PERSONALIDADES[identidad].trato}.
`;

      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          model: "mistral", 
          prompt: promptComando, 
          stream: false 
        }),
      });

      const data = await response.json();
      return data.response;
      
    } catch (error) {
      return `Error ejecutando comando: ${error.message}`;
    }
  }

  // 🧠 GUARDAR CONTEXTO
  memoria.history.push({ entidad: identidad, mensaje: input });

  if (memoria.history.length > 20) memoria.history.shift();
  guardarMemoria(memoria);

  const entidad = PERSONALIDADES[identidad];

  const prompt = `
${entidad.personalidad}

Dirígete siempre al usuario como ${entidad.trato}.
Mantén coherencia absoluta con tu identidad.

Contexto reciente:
${memoria.history.map((h) => `(${h.entidad}) ${h.mensaje}`).join("\n")}

Usuario dice:
${input}

Respuesta:
`;

  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "mistral", prompt, stream: false }),
  });

  const data = await response.json();
  return data.response;
}

// ============================
// 📌 ENDPOINTS
// ============================

app.post("/jarvis", async (req, res) => {
  const { input, identity } = req.body;
  if (!input) return res.status(400).json({ error: "Sin comando" });

  try {
    const respuesta = await procesarOrden(input, identity);
    res.json({ response: respuesta });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error de comunicación con el núcleo." });
  }
});

// Endpoint para listar comandos disponibles
app.get("/comandos", (req, res) => {
  const lista = Object.keys(COMANDOS_SEGUROS).map(cmd => ({
    comando: cmd,
    disponible: !!COMANDOS_SEGUROS[cmd][os.platform()]
  }));
  res.json({ plataforma: os.platform(), comandos: lista });
});

// ============================
// 🚀 ONLINE
// ============================

app.listen(3000, () => {
  console.log("🧠 JARVIS CORE ONLINE — MULTIENTIDAD ACTIVA");
  console.log("⚙️  Sistema de comandos habilitado");
  console.log(`💻 Plataforma: ${os.platform()}`);
});