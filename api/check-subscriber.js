export default async function handler(req, res) {
  // Alleen POST requests toegestaan
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
    // Zoek de subscriber op bij MailerLite
    const response = await fetch(
     `https://connect.mailerlite.com/api/subscribers/${encodeURIComponent(email)}?include=groups`,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      // Subscriber bestaat niet
      return res.status(200).json({ toegang: false });
    }

    const data = await response.json();
    const subscriber = data.data;

    // Check of subscriber in de juiste groep zit
    const inGroep = subscriber.groups &&
      subscriber.groups.some(g => g.id === GROUP_ID);

    return res.status(200).json({ toegang: !!inGroep });

  } catch (error) {
    return res.status(500).json({ error: 'Er ging iets mis, probeer opnieuw.' });
  }
}
