"use client"
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface YouTubeResponse {
  title?: string;
  description?: string;
  thumbnail?: string;
  error?: string;
}

interface RequestData {
  input_text: string;
}

const YouTubeContentGenerator = () => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<YouTubeResponse | null>(null);

  const generateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputText.trim()) {
      setError('Please enter some text.');
      return;
    }

    setLoading(true);
    setError(null);

    const requestData: RequestData = {
      input_text: inputText
    };

    try {
      const response = await fetch('http://3.129.88.226:5000/youtube', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      setData(result);
      setError(null);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate content. Please try again later.');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-white">YouTube Content Generator</h1>
        
        <form onSubmit={generateContent} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="input_text" className="mb-2 font-medium text-gray-300">
              Enter a topic for YouTube content:
            </label>
            <textarea
              id="input_text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={4}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md 
                         text-gray-100 placeholder-gray-500 focus:outline-none 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your topic here..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md 
                     hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-400 
                     disabled:cursor-not-allowed flex items-center justify-center 
                     transition duration-200"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Content'
            )}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-900/50 border border-red-700 text-red-200 rounded-md">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}

        {data && !error && (
          <div className="mt-6 p-6 bg-gray-800 border border-gray-700 rounded-lg shadow-lg space-y-4">
            <h3 className="text-xl font-bold text-white">Generated Content</h3>
            
            {data.title && (
              <div className="space-y-1">
                <p className="font-semibold text-gray-300">Title:</p>
                <p className="p-2 bg-gray-700 rounded text-gray-100">{data.title}</p>
              </div>
            )}

            {data.description && (
              <div className="space-y-1">
                <p className="font-semibold text-gray-300">Description:</p>
                <p className="p-2 bg-gray-700 rounded text-gray-100 whitespace-pre-wrap">
                  {data.description}
                </p>
              </div>
            )}

            {data.thumbnail && (
              <div className="space-y-1">
                <p className="font-semibold text-gray-300">Thumbnail:</p>
                <pre className="p-2 bg-gray-700 rounded text-gray-100 overflow-x-auto">
                  {data.thumbnail}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default YouTubeContentGenerator;