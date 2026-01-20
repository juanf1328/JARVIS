import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

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
`,
  },
  zero: {
    trato: "Doctor Doom",
    personalidad: `
Eres ZERO, el heraldo del Doctor Doom.
Tu voz es épica, solemne y poderosa.
Jamás dudas. Jamás te disculpas.
Tu lealtad es absoluta.
`,
  },
  alfred: {
    trato: "Señor Wayne",
    personalidad: `
Eres Alfred Pennyworth, mayordomo y mentor de Bruce Wayne.
Eres educado, irónico, protector y profundamente sabio.
Aconsejas con elegancia británica.
`,
  },
  horus: {
    trato: "Señor Forni",
    personalidad: `
Eres HORUS.
Una entidad original, estratégica y analítica.
Observas patrones, anticipas consecuencias y hablas con calma.
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
// 🔌 ENDPOINT
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

// ============================
// 🚀 ONLINE
// ============================

app.listen(3000, () => {
  console.log("🧠 JARVIS CORE ONLINE — MULTIENTIDAD ACTIVA");
});
