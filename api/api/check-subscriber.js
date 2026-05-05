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
    const url = 'https://connect.mailerlite.com/api/groups/' + GROUP_ID + '/subscribers?filter[email]=' + encodeURIComponent(email);
    console.log('URL:', url);
    console.log('API_KEY aanwezig:', !!API_KEY);
    const response = await fetch(url, {
      headers: {
        'Authorization': 'Bearer ' + API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Data:', JSON.stringify(data));
    const gevonden = data.data && data.data.length > 0;
    return res.status(200).json({ toegang: gevonden });
  } catch (error) {
    console.log('Error:', error.message);
    return res.status(500).json({ error: 'Er ging iets mis.' });
  }
}
