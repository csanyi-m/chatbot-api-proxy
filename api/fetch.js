export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Csak POST metódus engedélyezett" });
  }

  const { url, password } = req.body;

  if (password !== process.env.ACCESS_PASSWORD) {
    return res.status(403).json({ error: "Hibás jelszó" });
  }

  try {
    const response = await fetch(url);
    const html = await response.text();
    res.status(200).json({ content: html });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Nem sikerült betölteni a link tartalmát." });
  }
}
