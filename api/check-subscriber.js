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
      'https://connect.mailerlite.com/api/subscribers/' + encodeURIComponent(email),
      {
        headers: {
          'Authorization': 'Bearer ' + API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );
    console.log('Status:', response.status);
    if (!response.ok) {
      return res.status(200).json({ toegang: false });
    }
    const data = await response.json();
    console.log('Data:', JSON.stringify(data));
    const subscriber = data.data;
    const groups = subscriber && subscriber.groups ? subscriber.groups : [];
    console.log('Groups:', JSON.stringify(groups));
    const inGroep = groups.some(function(g) { return g.id === GROUP_ID; });
    return res.status(200).json({ toegang: inGroep });
  } catch (error) {
    console.log('Error:', error.message);
    return res.status(500).json({ error: 'Er ging iets mis.' });
  }
}
