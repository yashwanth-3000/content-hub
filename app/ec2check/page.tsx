"use client"
import React, { useState, useRef, useEffect } from 'react';
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

interface LogEntry {
  timestamp: string;
  level: 'info' | 'error' | 'success' | 'warning';
  stage: string;
  message: string;
  data?: any;
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
const TIMEOUT_DURATION = 30000;

const TerminalYouTubeGenerator = () => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [data, setData] = useState<YouTubeResponse | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (level: LogEntry['level'], stage: string, message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${stage}]`, message, data || '');
    
    setLogs(prevLogs => [...prevLogs, {
      timestamp,
      level,
      stage,
      message,
      data
    }]);
  };

  const generateErrorId = () => {
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    addLog('info', 'ERROR_ID', `Generated new error ID: ${errorId}`);
    return errorId;
  };

  const logAPIError = async (errorLog: APIErrorLog) => {
    addLog('error', 'ERROR_LOGGING', 'API Error occurred', errorLog);

    try {
      const errorLogs = JSON.parse(localStorage.getItem('apiErrorLogs') || '[]');
      errorLogs.push(errorLog);
      localStorage.setItem('apiErrorLogs', JSON.stringify(errorLogs));
      addLog('info', 'ERROR_STORAGE', 'Error stored in localStorage');
    } catch (e) {
      addLog('error', 'ERROR_STORAGE', 'Failed to store error in localStorage', e);
    }
  };

  const makeRequest = async (
    requestData: RequestData, 
    retryCount: number = 0
  ): Promise<YouTubeResponse> => {
    addLog('info', 'REQUEST', `Starting request (Attempt ${retryCount + 1}/${MAX_RETRIES + 1})`, requestData);

    const startTime = performance.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      addLog('warning', 'TIMEOUT', `Request timed out after ${TIMEOUT_DURATION}ms`);
      controller.abort();
    }, TIMEOUT_DURATION);

    try {
      addLog('info', 'FETCH', 'Initiating fetch request', {
        url: 'http://3.129.88.226:5000/youtube',
        method: 'POST',
        data: requestData
      });

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

      addLog('info', 'RESPONSE', 'Received response', {
        status: response.status,
        duration: `${duration.toFixed(2)}ms`
      });

      if (!response.ok) {
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
          },
          requestDuration: duration,
          retryCount
        };

        await logAPIError(errorLog);

        if ([429, 503, 504].includes(response.status) && retryCount < MAX_RETRIES) {
          const delay = Math.pow(2, retryCount) * 1000;
          addLog('warning', 'RETRY', `Retrying after ${delay}ms delay`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return makeRequest(requestData, retryCount + 1);
        }

        throw new Error(errorLog.errorMessage);
      }

      addLog('info', 'PARSING', 'Parsing response');
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      addLog('success', 'SUCCESS', 'Request completed successfully', result);
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
        }
      }

      await logAPIError(errorLog);
      throw new Error(errorLog.errorMessage);
    }
  };

  const generateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLogs([]); // Clear previous logs
    addLog('info', 'SUBMIT', 'Form submitted', { inputText });
    
    if (!inputText.trim()) {
      addLog('error', 'VALIDATION', 'Empty input text detected');
      return;
    }

    setLoading(true);
    const requestData: RequestData = { input_text: inputText };

    try {
      const result = await makeRequest(requestData);
      setData(result);
      addLog('success', 'COMPLETE', 'Content generated successfully', result);
    } catch (err) {
      addLog('error', 'ERROR', 'Content generation failed', err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const renderLogEntry = (log: LogEntry, index: number) => {
    const levelColors = {
      info: 'text-blue-400',
      error: 'text-red-400',
      success: 'text-green-400',
      warning: 'text-yellow-400'
    };

    return (
      <div key={index} className="font-mono text-sm mb-1">
        <span className="text-gray-500">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
        <span className={`ml-2 ${levelColors[log.level]}`}>[{log.stage}]</span>
        <span className="ml-2 text-gray-300">{log.message}</span>
        {log.data && (
          <pre className="ml-8 text-xs text-gray-400 overflow-x-auto">
            {JSON.stringify(log.data, null, 2)}
          </pre>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <h1 className="text-xl font-mono font-bold mb-4">YouTube Content Generator Terminal</h1>
          
          <form onSubmit={generateContent} className="space-y-4">
            <div className="flex items-center space-x-2 font-mono">
              <span className="text-green-400">$</span>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-2 
                         text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter topic for YouTube content..."
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded
                         hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed
                         flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Generate</span>
                )}
              </button>
            </div>
          </form>
        </div>

        <div 
          ref={terminalRef}
          className="bg-gray-800 border border-gray-700 rounded-lg p-4 h-[400px] overflow-y-auto"
        >
          {logs.map((log, index) => renderLogEntry(log, index))}
        </div>

        {data && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 font-mono">
            <h2 className="text-lg font-bold mb-4">Generated Content</h2>
            {data.title && (
              <div className="mb-4">
                <p className="text-green-400">$ Title:</p>
                <p className="ml-4 text-gray-300">{data.title}</p>
              </div>
            )}
            {data.description && (
              <div className="mb-4">
                <p className="text-green-400">$ Description:</p>
                <p className="ml-4 text-gray-300 whitespace-pre-wrap">{data.description}</p>
              </div>
            )}
            {data.thumbnail && (
              <div>
                <p className="text-green-400">$ Thumbnail:</p>
                <pre className="ml-4 text-gray-300 overflow-x-auto">
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

export default TerminalYouTubeGenerator;