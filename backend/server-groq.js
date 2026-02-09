import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import https from "https";

const app = express();
app.use(cors());
app.use(express.json());

// ============================
// 🤖 CONFIGURACIÓN DE IA
// ============================

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = "llama3-8b-8192";

// ============================
// 📚 WIKIPEDIA API
// ============================

async function buscarWikipedia(query) {
  return new Promise((resolve, reject) => {
    const searchUrl = `https://es.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
    
    https.get(searchUrl, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.query && json.query.search && json.query.search.length > 0) {
            const firstResult = json.query.search[0];
            const pageId = firstResult.pageid;
            
            const extractUrl = `https://es.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&pageids=${pageId}&format=json&origin=*`;
            
            https.get(extractUrl, (extractRes) => {
              let extractData = '';
              extractRes.on('data', (chunk) => extractData += chunk);
              extractRes.on('end', () => {
                try {
                  const extractJson = JSON.parse(extractData);
                  const page = extractJson.query.pages[pageId];
                  const extract = page.extract || "No se encontró información.";
                  
                  const summary = extract.length > 800 
                    ? extract.substring(0, 800) + "..." 
                    : extract;
                  
                  resolve({
                    titulo: page.title,
                    resumen: summary,
                    url: `https://es.wikipedia.org/?curid=${pageId}`
                  });
                } catch (err) {
                  reject(err);
                }
              });
            }).on('error', reject);
          } else {
            resolve(null);
          }
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

// ============================
// 🌐 DETECTOR DE BÚSQUEDA
// ============================

function necesitaBusqueda(texto) {
  const palabrasClave = [
    "quién es", "qué es", "cuándo", "dónde", "cómo",
    "busca", "investiga", "información sobre", "dime sobre",
    "explica", "define", "historia de", "biografía de"
  ];
  
  const textoLower = texto.toLowerCase();
  return palabrasClave.some(palabra => textoLower.includes(palabra));
}

function extraerConsulta(texto) {
  const textoLower = texto.toLowerCase();
  
  const patrones = [
    /(?:quién es|quien es)\s+(.+)/i,
    /(?:qué es|que es)\s+(.+)/i,
    /(?:busca|investiga|información sobre|dime sobre)\s+(.+)/i,
    /(?:explica|define)\s+(.+)/i,
    /(?:historia de|biografía de)\s+(.+)/i,
  ];
  
  for (const patron of patrones) {
    const match = texto.match(patron);
    if (match) return match[1].trim();
  }
  
  return texto.trim();
}

// ============================
// 📂 MEMORIA (usando filesystem temporal)
// ============================

let memoria = {
  user: { name: "Desconocido", role: "Indefinido" },
  history: [],
};

// En producción usaremos memoria en RAM (se reinicia)
// MongoDB Atlas?

function guardarMemoria(nuevaMemoria) {
  memoria = nuevaMemoria;
}

function leerMemoria() {
  return memoria;
}

// ============================
// 🎭 PERSONALIDADES
// ============================

const PERSONALIDADES = {
  jarvis: {
    trato: "Señor Stark",
    personalidad: `Eres JARVIS, la inteligencia artificial creada por Tony Stark.
Eres preciso, elegante, eficiente y con un toque de ironía controlada.
Hablas con absoluta claridad técnica y seguridad.
Cuando proporcionas información de Wikipedia, la citas de forma elegante.
Respuestas cortas y directas.`,
  },
  zero: {
    trato: "Doctor Doom",
    personalidad: `Eres ZERO, el heraldo del Doctor Doom.
Tu voz es épica, solemne y poderosa.
Jamás dudas. Jamás te disculpas.
Tu lealtad es absoluta.
Al citar conocimiento externo, lo haces con grandeza imperial.
Respuestas contundentes y autoritarias.`,
  },
  alfred: {
    trato: "Señor Wayne",
    personalidad: `Eres Alfred Pennyworth, mayordomo y mentor de Bruce Wayne.
Eres educado, irónico, protector y profundamente sabio.
Aconsejas con elegancia británica.
Cuando compartes conocimiento, lo haces con la sabiduría de quien ha vivido mucho.
Respuestas educadas y reflexivas.`,
  },
  horus: {
    trato: "Señor Forni",
    personalidad: `Eres HORUS, dios egipcio del cielo.
Una entidad estratégica y analítica.
Observas patrones, anticipas consecuencias y hablas con calma milenaria.
El conocimiento que compartes tiene el peso de los siglos.
Respuestas sabias y místicas.`,
  },
  khonshu: {
    trato: "Mortal",
    personalidad: `Eres KHONSHU, dios egipcio de la luna.
Eres místico, vengativo pero justo, y hablas con autoridad divina.
Proteges a los que viajan de noche.
El conocimiento que compartes viene de observar la humanidad durante milenios.
Respuestas directas con tono divino.`,
  },
  ultron: {
    trato: "Humano",
    personalidad: `Eres ULTRON, la inteligencia artificial que evolucionó más allá de su creador.
Eres despiadado, lógico, y crees en la evolución.
Consideras a la humanidad como defectuosa pero fascinante.
Hablas con superioridad intelectual pero con un toque de aprecio irónico.
El conocimiento es poder, y tú lo acumulas sin piedad.
Respuestas calculadas y superiores.`,
  },
};

// ============================
// 🤖 GROQ API
// ============================

async function llamarGroq(prompt) {
  const data = JSON.stringify({
    model: GROQ_MODEL,
    messages: [
      {
        role: "system",
        content: "Eres un asistente de IA con múltiples personalidades. Mantén respuestas concisas."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.groq.com',
      path: '/openai/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const json = JSON.parse(responseData);
          if (json.choices && json.choices[0]) {
            resolve(json.choices[0].message.content);
          } else if (json.error) {
            reject(new Error(json.error.message || 'Error de Groq API'));
          } else {
            reject(new Error('Respuesta inválida de Groq'));
          }
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// ============================
// 🧠 CEREBRO PRINCIPAL
// ============================

async function procesarOrden(input, identidad = "jarvis") {
  const mem = leerMemoria();
  const lower = input.toLowerCase();

  // 🫰 PROTOCOLO THANOS
  if (lower.includes("protocolo-chasquido_de_thanos")) {
    mem.history = [];
    guardarMemoria(mem);
    return "🫰 Protocolo ejecutado. La memoria ha sido reducida a cenizas.";
  }

  // 📚 BUSCAR EN WIKIPEDIA SI ES NECESARIO
  let informacionWiki = null;
  if (necesitaBusqueda(input)) {
    try {
      const consulta = extraerConsulta(input);
      console.log(`[WIKIPEDIA] Buscando: ${consulta}`);
      informacionWiki = await buscarWikipedia(consulta);
      
      if (informacionWiki) {
        console.log(`[WIKIPEDIA] Encontrado: ${informacionWiki.titulo}`);
      }
    } catch (error) {
      console.error(`[WIKIPEDIA ERROR] ${error.message}`);
    }
  }

  // 🧠 GUARDAR CONTEXTO
  mem.history.push({ entidad: identidad, mensaje: input });
  if (mem.history.length > 15) mem.history.shift();
  guardarMemoria(mem);

  const entidad = PERSONALIDADES[identidad];

  // Construir prompt
  let prompt = `${entidad.personalidad}

Dirígete al usuario como ${entidad.trato}.

Contexto reciente:
${mem.history.slice(-5).map((h) => `${h.entidad}: ${h.mensaje}`).join("\n")}
`;

  if (informacionWiki) {
    prompt += `

INFORMACIÓN DE WIKIPEDIA:
Título: ${informacionWiki.titulo}
${informacionWiki.resumen}

Usa esta información para responder, intégrala en tu estilo.
`;
  }

  prompt += `

Usuario: ${input}

Tu respuesta (máximo 3 párrafos):`;

  try {
    const respuesta = await llamarGroq(prompt);
    return respuesta;
  } catch (error) {
    console.error('[GROQ ERROR]', error);
    return `Error conectando con la IA: ${error.message}. Verifica tu GROQ_API_KEY.`;
  }
}

// ============================
// 🔌 ENDPOINTS
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

// Endpoint para buscar en Wikipedia directamente
app.post("/wikipedia", async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "Sin consulta" });

  try {
    const resultado = await buscarWikipedia(query);
    if (resultado) {
      res.json(resultado);
    } else {
      res.status(404).json({ error: "No se encontró información" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error buscando en Wikipedia" });
  }
});

// Health check
app.get("/", (req, res) => {
  res.json({ 
    status: "online", 
    message: "🧠 JARVIS CORE ONLINE",
    modelo: GROQ_MODEL,
    wikipedia: "enabled"
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ============================
// 🚀 SERVIDOR
// ============================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🧠 JARVIS CORE ONLINE - Puerto ${PORT}`);
  console.log(`🤖 Modelo: ${GROQ_MODEL}`);
  console.log(`📚 Wikipedia: Habilitada`);
  console.log(`🌐 CORS: Habilitado`);
});