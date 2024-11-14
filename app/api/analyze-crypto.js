import { analyze_crypto_content_x } from '../../lib/crypto-analyzer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { prompt, searchResults } = req.body;
    const results = await analyze_crypto_content_x(searchResults);
    
    return res.status(200).json(results);
  } catch (error) {
    console.error('Content generation error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}