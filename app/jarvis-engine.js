import fetch from "node-fetch";

export async function procesarOrden(texto) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content:
            "Sos JARVIS. Modo épico permanente. Conciso. Autoridad absoluta.",
        },
        { role: "user", content: texto },
      ],
    }),
  });

  const data = await res.json();
  return data.choices[0].message.content;
}
