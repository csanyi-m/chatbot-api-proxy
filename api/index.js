export default async function handler(req, res) {
  const { OPENAI_API_KEY, ACCESS_PASSWORD } = process.env;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Csak POST metódus engedélyezett' });
  }

  const { prompt, password } = req.body;

  if (password !== ACCESS_PASSWORD) {
    return res.status(403).json({ error: 'Hibás jelszó' });
  }

  try {
    const completion = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Csak a megadott szöveg alapján válaszolj.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7
      })
    });

    const data = await completion.json();
    res.status(200).json({ reply: data.choices?.[0]?.message?.content || 'Nincs válasz.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Szerverhiba történt' });
  }
}
