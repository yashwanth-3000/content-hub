// api/generate-content.js
import { semantic_search, analyze_crypto_content_x, prompt_creator } from '@app/api/x_workflow.py'  // Adjust path as needed

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    console.log('[API] Invalid method:', req.method);
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { prompt } = req.body
    console.log('[API] Received prompt:', prompt);
    
    // Step 1: Perform semantic search
    console.log('[API] Starting semantic search...');
    const [searchResults, searchOutput] = await semantic_search(
      prompt,
      "text_embeddings",  // collection_name
      "milvus_demoo.db",  // milvus_file 
      "sk-proj-L5CcdYdlS66D1OFUFAyGT3BlbkFJ2zqDySD8cIbcK1F7BjGn"
    )
    console.log('[API] Semantic search results:', {
      resultCount: searchResults.length,
      firstResult: searchResults[0],
      searchOutput: searchOutput
    });
    
    // Step 2: Use search results to generate tweet content
    console.log('[API] Starting tweet content analysis...');
    const tweetResults = await analyze_crypto_content_x(searchOutput)
    console.log('[API] Tweet analysis results:', tweetResults);
    
    // Extract tweet and image description from results
    let tweetContent = ''
    let imageDescription = ''
    
    console.log('[API] Extracting tweet content and image description...');
    for (const [key, value] of Object.entries(tweetResults)) {
      console.log('[API] Processing key:', key, 'value:', value);
      if (key.includes('tweet_text')) {
        tweetContent = value
        console.log('[API] Found tweet content:', tweetContent);
      } else if (key.includes('image_description')) {
        imageDescription = value
        console.log('[API] Found image description:', imageDescription);
      }
    }
    
    // Step 3: Generate image prompt
    console.log('[API] Starting image prompt generation...');
    const imagePromptResult = await prompt_creator(imageDescription, 'Twitter')
    console.log('[API] Generated image prompt:', imagePromptResult);
    
    // Prepare response
    const response = {
      searchResults: searchResults,
      content: tweetContent,
      imagePrompt: imagePromptResult
    };
    console.log('[API] Sending successful response:', response);
    
    return res.status(200).json(response)
  } catch (error) {
    console.error('[API] Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Log additional error context if available
    if (error.response) {
      console.error('[API] Error response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    }
    
    return res.status(500).json({ 
      error: 'Failed to generate content',
      details: error.message,
      timestamp: new Date().toISOString()
    })
  }
}