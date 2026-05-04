export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Geen e-mailadres opgegeven' });
  }
  const API_KEY = process.env.MAILERLITE_API_KEY;
  const GROUP_ID = '186539737344902275';
  try {
    const response = await fetch(
      `https://connect.mailerlite.com/api/groups/${GROUP_ID}/subscribers?filter[email]=${encodeURIComponent(email)}`,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );
    if (!response.ok) {
      return res.status(200).json({ toegang: false });
    }
    const data = await response.json();
    const gevonden = data.data && data.data.length > 0;
    return res.status(200).json({ toegang: gevonden });
  } catch (error) {
    return res.status(500).json({ error: 'Er ging iets mis, probeer opnieuw.' });
  }
}
