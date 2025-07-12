// File: api/fetch.js

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

    const dom = new DOMParser().parseFromString(html, "text/html");
    const text = dom.body.textContent || "";

    res.status(200).json({ content: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Nem sikerült betölteni a link tartalmát." });
  }
}
