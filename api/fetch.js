import cheerio from 'cheerio';

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://csanyi-m.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { ACCESS_PASSWORD } = process.env;
  const { url, password } = req.body;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Csak POST metódus engedélyezett' });
  }

  if (password !== ACCESS_PASSWORD) {
    return res.status(403).json({ error: 'Hibás jelszó' });
  }

  try {
    const response = await fetch(url);
    const html = await response.text();

    const $ = cheerio.load(html); // <- ez most már működni fog
    const text = $('body').text().replace(/\s+/g, ' ').trim();

    console.log("🔍 Betöltött szöveg (első 500 karakter):", text.slice(0, 500));
    res.status(200).json({ content: text });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Nem sikerült letölteni az oldalt' });
  }
}
