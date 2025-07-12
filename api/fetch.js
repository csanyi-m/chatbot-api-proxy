import { JSDOM } from "jsdom";

export default async function handler(req, res) {
  // ✅ Engedélyezd a CORS-t
  res.setHeader("Access-Control-Allow-Origin", "https://csanyi-m.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // preflight válasz
  }

  const { ACCESS_PASSWORD } = process.env;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Csak POST metódus engedélyezett' });
  }

  const { url, password } = req.body;

  if (password !== ACCESS_PASSWORD) {
    return res.status(403).json({ error: 'Hibás jelszó' });
  }

  try {
    const response = await fetch(url);
    const html = await response.text();

    // 🔧 Csak a látható szöveget adjuk vissza
    const dom = new JSDOM(html);
    const textContent = dom.window.document.body.innerText;

    res.status(200).json({ content: textContent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Nem sikerült letölteni az oldalt' });
  }
}
