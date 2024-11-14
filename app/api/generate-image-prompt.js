import { prompt_creator } from '../../lib/prompt-generator';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { description, style } = req.body;
    const result = await prompt_creator(description, style);
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Image prompt generation error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}