export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://csanyi-m.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { ACCESS_PASSWORD } = process.env;
  const { url, password } = req.body;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Csak POST metódus engedélyezett" });
  }

  if (password !== ACCESS_PASSWORD) {
    return res.status(403).json({ error: "Hibás jelszó" });
  }

  try {
    const response = await fetch(url);
    const html = await response.text();

    // 🔧 Szimpla HTML tag-eltávolítás (NEM tökéletes, de működik)
    const textOnly = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

    res.status(200).json({ content: textOnly });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Nem sikerült letölteni az oldalt" });
  }
}
