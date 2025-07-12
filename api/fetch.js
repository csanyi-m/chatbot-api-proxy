import cheerio from 'cheerio';

export default async function handler(req, res) {
  // ✅ CORS fejlécek
  res.setHeader("Access-Control-Allow-Origin", "https://csanyi-m.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Preflight válasz
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ✅ POST metódus ellenőrzése
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Csak POST metódus engedélyezett' });
  }

  const { ACCESS_PASSWORD } = process.env;
  const { url, password } = req.body;

  // ✅ Jelszó ellenőrzés
  if (password !== ACCESS_PASSWORD) {
    return res.status(403).json({ error: 'Hibás jelszó' });
  }

  try {
    // ✅ HTML letöltés és szöveg kinyerés
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const rawText = $('body').text();
    const cleanText = rawText.replace(/\s+/g, ' ').trim();

    console.log("🔍 Betöltött szöveg (első 500 karakter):", cleanText.slice(0, 500));

    // ✅ Szöveg visszaküldése
    res.status(200).json({ content: cleanText });

  } catch (err) {
    console.error("❌ Hiba:", err);
    res.status(500).json({ error: 'Nem sikerült letölteni vagy feldolgozni az oldalt' });
  }
}
