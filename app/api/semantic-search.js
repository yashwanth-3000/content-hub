export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  
    try {
      const { query_text } = req.body;
      const [results, output] = await semantic_search(query_text);
      
      return res.status(200).json({
        results,
        output
      });
    } catch (error) {
      console.error('Semantic search error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  