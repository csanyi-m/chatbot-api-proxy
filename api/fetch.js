export default async function handler(req, res) {
  // ✅ Engedélyezd a CORS-t
  res.setHeader("Access-Control-Allow-Origin", "*");
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
    res.status(200).json({ content: html });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Nem sikerült letölteni az oldalt' });
  }
}
