'use client'

import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, Repeat2, Heart, Share, Send, Twitter, Terminal, PenLine } from 'lucide-react'
import Image from 'next/image'

type Tweet = {
  id: number;
  content: string;
  image: string;
}

type TerminalLog = {
  message: string;
  timestamp: string;
  type: 'info' | 'process' | 'success' | 'error';
}

export default function Component() {
  const [userPrompt, setUserPrompt] = useState("")
  const [generatedThread, setGeneratedThread] = useState<Tweet[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>([])
  const terminalRef = useRef<HTMLDivElement | null>(null)

  const THREAD_LENGTH = 7

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalLogs])

  const addLog = (message: string, type: 'info' | 'process' | 'success' | 'error' = 'info') => {
    const timestamp = new Date().toLocaleTimeString()
    setTerminalLogs(prev => [...prev, { message, timestamp, type }])
  }

  const handleGenerate = async () => {
    if (userPrompt.trim()) {
      setIsLoading(true)
      setError(null)
      setTerminalLogs([])
      
      try {
        addLog('Initializing thread generation process...', 'process')
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        addLog('Analyzing content and generating thread...', 'process')
        await new Promise(resolve => setTimeout(resolve, 2000))

        const dummyThread = Array.from({ length: THREAD_LENGTH }, (_, index) => ({
          id: index + 1,
          content: index === 0 ? userPrompt : `Generated content for tweet ${index + 1} based on the prompt: "${userPrompt}"`,
          image: `/placeholder.svg?height=300&width=400&text=Image${index + 1}`
        }))

        setGeneratedThread(dummyThread)
        setIsLoading(false)
        addLog('Thread generated successfully ✓', 'success')
      } catch (error: unknown) {
        if (error instanceof Error) {
          addLog(`Error: ${error.message}`, 'error')
          setError(error.message)
        } else {
          addLog('An unknown error occurred', 'error')
          setError('An unknown error occurred')
        }
        setGeneratedThread([])
        setIsLoading(false)
      }
    }
  }

  const handlePromptChange = (newPrompt: string) => {
    setUserPrompt(newPrompt)
  }

  const handleSave = () => {
    console.log('Thread saved')
    addLog('Thread saved successfully', 'success')
  }

  const handleDiscard = () => {
    console.log('Thread discarded')
    setGeneratedThread([])
    setUserPrompt('')
    addLog('Thread discarded', 'info')
  }

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#000000',
      color: '#e5e5e5',
      padding: '16px 10px'
    },
    wrapper: {
      maxWidth: '900px',
      margin: '0 auto'
    },
    header: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '20px',
      textAlign: 'center' as const,
      color: '#e5e5e5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
      alignItems: 'start'
    },
    section: {
      backgroundColor: '#000000',
      borderRadius: '16px',
      padding: '16px',
      border: '1px solid #333333'
    },
    button: {
      backgroundColor: '#1d9bf0',
      color: '#ffffff',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '24px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      marginTop: '24px',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.2s',
    },
    errorMessage: {
      color: '#ff4444',
      marginTop: '12px',
      fontSize: '14px',
      textAlign: 'center' as const
    }
  }

  const InputSection = ({ icon, title, value, onChange, placeholder, disabled }: {
    icon: React.ReactNode;
    title: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    disabled: boolean;
  }) => {
    const styles = {
      container: {
        marginBottom: '24px'
      },
      header: {
        fontSize: '1.125rem',
        fontWeight: '600',
        marginBottom: '12px',
        color: '#d4d4d4',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      },
      textarea: {
        width: '100%',
        height: '100px',
        backgroundColor: disabled ? '#1e1e1e' : '#262626',
        border: '1px solid #404040',
        borderRadius: '12px',
        color: '#e5e5e5',
        padding: '16px',
        fontSize: '14px',
        resize: 'none' as const,
        transition: 'border-color 0.2s',
        cursor: disabled ? 'not-allowed' : 'text',
        opacity: disabled ? 0.7 : 1
      }
    }

    return (
      <div style={styles.container}>
        <h2 style={styles.header}>
          {icon}
          {title}
        </h2>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={styles.textarea}
          disabled={disabled}
        />
      </div>
    )
  }

  const TwitterThreadPreview = ({ thread }: { thread: Tweet[] }) => {
    return (
      <div className="space-y-1">
        {thread.map((tweet, index) => (
          <div key={tweet.id} className="relative">
            {index > 0 && (
              <div className="absolute left-6 -top-3 w-0.5 h-12 bg-gray-800" />
            )}
            <div className="bg-black border border-gray-800 rounded-xl p-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-800 relative">
                    <Image
                      src="/placeholder.svg?height=48&width=48&text=User"
                      alt="Profile"
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Twitter className="w-6 h-6 text-[#1d9bf0]" />
                    </div>
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="font-bold">Twitter User</span>
                    <span className="text-[#1d9bf0]">✓</span>
                    <span className="text-gray-500">@twitteruser</span>
                  </div>
                  <div className="text-[15px] mb-3 whitespace-pre-wrap">
                    {tweet.content}
                  </div>
                  <div className="mb-3">
                    <Image
                      src={tweet.image}
                      alt="Tweet image"
                      width={400}
                      height={300}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="flex justify-between">
                    <button className="p-2 hover:bg-[#1d9bf0]/10 rounded-full transition-colors">
                      <MessageCircle className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-[#00ba7c]/10 rounded-full transition-colors">
                      <Repeat2 className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-[#f91880]/10 rounded-full transition-colors">
                      <Heart className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-[#1d9bf0]/10 rounded-full transition-colors">
                      <Share className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const TerminalWindow = () => {
    const styles = {
      container: {
        backgroundColor: '#1a1b1e',
        borderRadius: '8px',
        border: '1px solid #2f3336',
        marginTop: '16px',
        overflow: 'hidden'
      },
      header: {
        backgroundColor: '#2f3336',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      },
      title: {
        color: '#e5e5e5',
        fontSize: '14px',
        fontWeight: '500'
      },
      content: {
        padding: '16px',
        maxHeight: '200px',
        overflowY: 'auto' as const,
        fontFamily: 'monaco, Consolas, "Courier New", monospace',
        fontSize: '12px',
        lineHeight: '1.6'
      },
      logEntry: {
        marginBottom: '8px',
        display: 'flex',
        gap: '8px'
      },
      timestamp: {
        color: '#6b7280',
        minWidth: '85px'
      },
      message: (type: 'info' | 'process' | 'success' | 'error') => ({
        color: {
          info: '#e5e5e5',
          process: '#60a5fa',
          success: '#34d399',
          error: '#ef4444'
        }[type]
      })
    }

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <Terminal size={16} color="#e5e5e5" />
          <span style={styles.title}>Terminal Output</span>
        </div>
        <div style={styles.content} ref={terminalRef}>
          {terminalLogs.map((log, index) => (
            <div key={index} style={styles.logEntry}>
              <span style={styles.timestamp}>[{log.timestamp}]</span>
              <span style={styles.message(log.type)}>{log.message}</span>
            </div>
          ))}
          {terminalLogs.length === 0 && (
            <div style={{ color: '#6b7280' }}>Waiting for generation process to start...</div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <h1 style={styles.header}>
          <Twitter size={32} color="#1d9bf0" />
          Twitter Thread Generator
        </h1>
        {error && (
          <div style={styles.errorMessage}>
            Error: {error}
          </div>
        )}

        <div style={styles.grid}>
          <div>
            <div style={styles.section}>
              <InputSection
                icon={<PenLine size={20} />}
                title="Your Prompt"
                value={userPrompt}
                onChange={handlePromptChange}
                placeholder="Enter your thread topic or first tweet..."
                disabled={isLoading}
              />
              
              <div className="text-gray-400 mb-4">
                Thread Length: {THREAD_LENGTH} tweets
              </div>

              <button 
                onClick={handleGenerate} 
                style={{
                  ...styles.button,
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                }}
                disabled={isLoading}
              >
                {isLoading ? 'Generating...' : 'Generate Thread'}
                <Send size={18} style={{ marginLeft: '8px' }} />
              </button>
            </div>
            <TerminalWindow />
          </div>

          <div style={styles.section}>
            <h2 className="text-xl font-semibold mb-4">Thread Preview</h2>
            {generatedThread.length > 0 ? (
              <>
                <TwitterThreadPreview thread={generatedThread} />
                <div className="flex justify-between mt-4">
                  <button
                    onClick={handleSave}
                    className="bg-[#1d9bf0] text-white px-4 py-2 rounded-full hover:bg-[#1a8cd8] transition-colors"
                  >
                    Save Thread
                  </button>
                  <button
                    onClick={handleDiscard}
                    className="bg-transparent text-[#ff4444] px-4 py-2 rounded-full border border-[#ff4444] hover:bg-[#ff4444]/10 transition-colors"
                  >
                    Discard
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 mt-8">
                Your generated thread will appear here
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}