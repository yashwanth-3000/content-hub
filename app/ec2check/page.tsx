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

interface APIErrorLog {
  id: string;
  timestamp: string;
  endpoint: string;
  requestData: RequestData;
  statusCode?: number;
  errorType: 'REQUEST_TIMEOUT' | 'NETWORK_ERROR' | 'API_ERROR' | 'PARSE_ERROR' | 'VALIDATION_ERROR';
  errorMessage: string;
  errorDetails?: any;
  requestDuration: number;
  retryCount: number;
}

const MAX_RETRIES = 2;
const TIMEOUT_DURATION = 30000; // 30 seconds

const YouTubeContentGenerator = () => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<APIErrorLog | null>(null);
  const [data, setData] = useState<YouTubeResponse | null>(null);

  const generateErrorId = () => {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const logAPIError = async (errorLog: APIErrorLog) => {
    // Log to console for development
    console.error('API Error Log:', {
      ...errorLog,
      timestamp: new Date(errorLog.timestamp).toLocaleString()
    });

    // In production, you might want to send this to your error tracking service
    try {
      // Example: Send to your error logging endpoint
      // await fetch('your-error-logging-endpoint', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorLog)
      // });

      // For now, store in localStorage for debugging
      const errorLogs = JSON.parse(localStorage.getItem('apiErrorLogs') || '[]');
      errorLogs.push(errorLog);
      localStorage.setItem('apiErrorLogs', JSON.stringify(errorLogs));
    } catch (e) {
      console.error('Failed to save error log:', e);
    }
  };

  const makeRequest = async (
    requestData: RequestData, 
    retryCount: number = 0
  ): Promise<YouTubeResponse> => {
    const startTime = performance.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

    try {
      const response = await fetch('http://3.129.88.226:5000/youtube', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const endTime = performance.now();
      const duration = endTime - startTime;

      if (!response.ok) {
        // Handle different HTTP error status codes
        const errorLog: APIErrorLog = {
          id: generateErrorId(),
          timestamp: new Date().toISOString(),
          endpoint: '/youtube',
          requestData,
          statusCode: response.status,
          errorType: 'API_ERROR',
          errorMessage: `HTTP Error ${response.status}`,
          errorDetails: {
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries())
          },
          requestDuration: duration,
          retryCount
        };

        // Specific status code handling
        switch (response.status) {
          case 429:
            errorLog.errorMessage = 'Rate limit exceeded';
            break;
          case 504:
            errorLog.errorMessage = 'Gateway timeout';
            break;
          case 503:
            errorLog.errorMessage = 'Service temporarily unavailable';
            break;
        }

        await logAPIError(errorLog);

        // Retry on certain status codes
        if ([429, 503, 504].includes(response.status) && retryCount < MAX_RETRIES) {
          const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay));
          return makeRequest(requestData, retryCount + 1);
        }

        throw new Error(errorLog.errorMessage);
      }

      const result = await response.json();
      
      if (result.error) {
        const errorLog: APIErrorLog = {
          id: generateErrorId(),
          timestamp: new Date().toISOString(),
          endpoint: '/youtube',
          requestData,
          errorType: 'API_ERROR',
          errorMessage: result.error,
          requestDuration: duration,
          retryCount
        };
        await logAPIError(errorLog);
        throw new Error(result.error);
      }

      return result;
    } catch (err) {
      clearTimeout(timeoutId);
      const endTime = performance.now();
      const duration = endTime - startTime;

      let errorLog: APIErrorLog = {
        id: generateErrorId(),
        timestamp: new Date().toISOString(),
        endpoint: '/youtube',
        requestData,
        errorType: 'NETWORK_ERROR',
        errorMessage: err instanceof Error ? err.message : 'Unknown error occurred',
        requestDuration: duration,
        retryCount
      };

      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorLog.errorType = 'REQUEST_TIMEOUT';
          errorLog.errorMessage = 'Request timed out';
          errorLog.errorDetails = { timeout: TIMEOUT_DURATION };
        } else if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
          errorLog.errorType = 'NETWORK_ERROR';
          errorLog.errorMessage = 'Network connection failed';
        }
      }

      await logAPIError(errorLog);

      // Retry on network errors
      if (errorLog.errorType === 'NETWORK_ERROR' && retryCount < MAX_RETRIES) {
        const delay = Math.pow(2, retryCount) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        return makeRequest(requestData, retryCount + 1);
      }

      throw new Error(errorLog.errorMessage);
    }
  };

  const generateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputText.trim()) {
      const validationError: APIErrorLog = {
        id: generateErrorId(),
        timestamp: new Date().toISOString(),
        endpoint: '/youtube',
        requestData: { input_text: inputText },
        errorType: 'VALIDATION_ERROR',
        errorMessage: 'Empty input text',
        requestDuration: 0,
        retryCount: 0
      };
      await logAPIError(validationError);
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    const requestData: RequestData = {
      input_text: inputText
    };

    try {
      const result = await makeRequest(requestData);
      setData(result);
      setError(null);
    } catch (err) {
      setData(null);
      if (error && 'id' in error) {
        setError(error);
      }
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
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium">Error Type: {error.errorType}</p>
              <p className="text-sm opacity-75">ID: {error.id}</p>
            </div>
            <p className="mb-2">{error.errorMessage}</p>
            {error.errorDetails && (
              <pre className="text-sm mt-2 p-2 bg-red-900/30 rounded">
                {JSON.stringify(error.errorDetails, null, 2)}
              </pre>
            )}
            <div className="text-sm mt-2 flex justify-between opacity-75">
              <span>Retry Count: {error.retryCount}</span>
              <span>Duration: {error.requestDuration.toFixed(2)}ms</span>
            </div>
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