'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Youtube, PenLine, MessageSquare, FileText, Terminal } from 'lucide-react'

// Styles object
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#000000',
    color: 'white',
    padding: '20px'
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '20px'
  },
  button: {
    backgroundColor: '#FF0000',
    color: 'white',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '24px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: '20px',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'background-color 0.2s'
  },
  textarea: {
    width: '100%',
    height: '100px',
    backgroundColor: '#262626',
    border: '1px solid #404040',
    borderRadius: '8px',
    color: '#e5e5e5',
    padding: '12px',
    fontSize: '14px',
    resize: 'none' as 'none'
  }
}

// Terminal styles
const terminalStyles = {
  container: {
    backgroundColor: '#1a1b1e',
    borderRadius: '8px',
    border: '1px solid #2f3336',
    marginTop: '24px',
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
    maxHeight: '300px',
    overflowY: 'auto' as 'auto',
    fontFamily: 'monaco, Consolas, "Courier New", monospace',
    fontSize: '13px',
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

// Preview styles
const previewStyles = {
  container: {
    backgroundColor: '#0F0F0F',
    border: '1px solid #363636',
    borderRadius: '12px',
    overflow: 'hidden',
    width: '400px',
    fontFamily: 'Roboto, Arial, sans-serif',
    boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.05)'
  },
  videoContainer: {
    width: '400px',
    height: '225px',
    backgroundColor: '#262626',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    padding: '12px',
    color: '#e5e5e5'
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '8px'
  },
  description: {
    fontSize: '14px',
    color: '#AAAAAA',
    whiteSpace: 'pre-wrap'
  }
}

// InputSection component
const InputSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
}> = ({ title, icon, value, onChange, placeholder }) => {
  return (
    <div style={{ marginBottom: '24px' }}>
      <label style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        {icon}
        {title}
      </label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={styles.textarea}
      />
    </div>
  )
}

// YouTubePreview component
const YouTubePreview: React.FC<{
  title: string;
  description: string;
}> = ({ title, description }) => {
  return (
    <div style={{...previewStyles.container, width: '100%'}}>
      <div style={{...previewStyles.videoContainer, width: '100%'}}>
        <img src="/placeholder.svg?height=225&width=400" alt="Video thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: 'rgba(0, 0, 0, 0.8)', padding: '2px 4px', borderRadius: '2px', fontSize: '12px' }}>10:15</div>
      </div>
      <div style={previewStyles.content}>
        <div style={previewStyles.title}>{title || 'Your video title'}</div>
        <div style={{ fontSize: '14px', color: '#AAAAAA', marginTop: '4px' }}>123K views • 2 days ago</div>
        <div style={previewStyles.description}>{description || 'Your video description'}</div>
      </div>
    </div>
  )
}

// TerminalWindow component
const TerminalWindow: React.FC<{
  terminalRef: React.RefObject<HTMLDivElement>;
  terminalLogs: { message: string; timestamp: string; type: string }[];
}> = ({ terminalRef, terminalLogs }) => {
  return (
    <div style={terminalStyles.container}>
      <div style={terminalStyles.header}>
        <Terminal size={16} color="#e5e5e5" />
        <span style={terminalStyles.title}>Terminal Output</span>
      </div>
      <div style={terminalStyles.content} ref={terminalRef}>
        {terminalLogs.map((log, index) => (
          <div key={index} style={terminalStyles.logEntry}>
            <span style={terminalStyles.timestamp}>[{log.timestamp}]</span>
            <span style={terminalStyles.message(log.type as 'info' | 'process' | 'success' | 'error')}>{log.message}</span>
          </div>
        ))}
        {terminalLogs.length === 0 && (
          <div style={{ color: '#6b7280' }}>Waiting for generation process to start...</div>
        )}
      </div>
    </div>
  )
}

// Main component
export default function Component() {
  const [userPrompt, setUserPrompt] = useState("Explain the basics of blockchain technology")
  const [generatedTitle, setGeneratedTitle] = useState("Blockchain 101: Understanding the Foundation of Cryptocurrencies")
  const [generatedDescription, setGeneratedDescription] = useState("Dive into the world of blockchain technology, the backbone of cryptocurrencies like Bitcoin and Ethereum. This video breaks down complex concepts into easy-to-understand explanations, perfect for beginners and tech enthusiasts alike.")
  const [generatedScript, setGeneratedScript] = useState(`Introduction:
Welcome to our channel, tech explorers! Today, we're demystifying blockchain technology, the revolutionary concept behind cryptocurrencies and so much more.

What is Blockchain?
At its core, a blockchain is a distributed digital ledger. Imagine a giant, digital spreadsheet that's duplicated thousands of times across a network of computers. This network is designed to regularly update this spreadsheet, and that's our blockchain.

Key Features:
1. Decentralization: Unlike traditional databases, blockchains are not controlled by any single entity.
2. Transparency: All transactions are visible to anyone on the network.
3. Immutability: Once data is recorded, it's extremely difficult to change or delete.

How It Works:
1. Transaction Initiation: A user requests a transaction.
2. Block Creation: The transaction is grouped with others into a 'block'.
3. Verification: The block is sent to every node in the network for validation.
4. Chaining: Once verified, the block is added to the existing chain.
5. Transaction Complete: The transaction is now permanent and unalterable.

Real-World Applications:
- Cryptocurrencies like Bitcoin
- Smart Contracts
- Supply Chain Management
- Voting Systems

Conclusion:
Blockchain technology is reshaping how we think about trust, transparency, and security in the digital world. As we continue to explore its potential, we're likely to see even more innovative applications emerge.

Don't forget to like, subscribe, and hit the notification bell to stay updated on the latest in tech and crypto. Thanks for watching!`)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [terminalLogs, setTerminalLogs] = useState<{ message: string; timestamp: string; type: 'info' | 'process' | 'success' | 'error' }[]>([])
  const terminalRef = useRef<HTMLDivElement | null>(null)

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
        addLog('Initializing generation process...', 'process')

        // Simulating API calls for YouTube content generation
        await new Promise(resolve => setTimeout(resolve, 2000))
        addLog('Analyzing user prompt...', 'process')
        await new Promise(resolve => setTimeout(resolve, 1500))
        addLog('Generating YouTube content...', 'process')
        await new Promise(resolve => setTimeout(resolve, 2500))

        // Simulated generated content
        const simulatedTitle = "10 Mind-Blowing Facts About the Universe"
        const simulatedDescription = "Embark on a cosmic journey as we explore 10 incredible facts about our universe. From black holes to dark matter, prepare to have your mind expanded!"
        const simulatedScript = "Introduction:\nWelcome, space enthusiasts! Today, we're diving into the depths of the cosmos to uncover 10 mind-blowing facts about our universe.\n\nFact 1: The Observable Universe\nDid you know that the observable universe is about 93 billion light-years in diameter? That's a distance so vast, it's almost impossible to comprehend!\n\n[Continue with 8 more facts...]\n\nConclusion:\nThank you for joining us on this cosmic journey. If you enjoyed this video, don't forget to like, subscribe, and share your thoughts in the comments below. Until next time, keep looking up and wondering!"

        setGeneratedTitle(simulatedTitle)
        setGeneratedDescription(simulatedDescription)
        setGeneratedScript(simulatedScript)
        addLog('YouTube content generated successfully ✓', 'success')
      } catch (error: unknown) {
        if (error instanceof Error) {
          addLog(`Error: ${error.message}`, 'error')
          setError(error.message)
        } else {
          addLog('An unknown error occurred', 'error')
          setError('An unknown error occurred')
        }
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div style={styles.container}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={styles.titleContainer}>
          <Youtube size={32} color="#FF0000" />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e5e5e5' }}>
            YouTube Content Generator
          </h1>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px', justifyContent: 'center' }}>
          <div>
            <InputSection
              title="What's your video idea?"
              icon={<PenLine size={20} color="#FF0000" />}
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Type your video idea here"
            />
            
            <InputSection
              title="Generated Title"
              icon={<MessageSquare size={20} color="#FF0000" />}
              value={generatedTitle}
              onChange={() => {}}
              placeholder="Your generated title will appear here..."
            />

            <InputSection
              title="Generated Description"
              icon={<MessageSquare size={20} color="#FF0000" />}
              value={generatedDescription}
              onChange={() => {}}
              placeholder="Your generated description will appear here..."
            />

            <InputSection
              title="Generated Script"
              icon={<FileText size={20} color="#FF0000" />}
              value={generatedScript}
              onChange={() => {}}
              placeholder="Your generated script will appear here..."
            />

            <button
              onClick={handleGenerate}
              disabled={isLoading}
              style={{
                ...styles.button,
                backgroundColor: isLoading ? '#666666' : '#FF0000',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                gap: '8px'
              }}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Generating...
                </>
              ) : (
                <>
                  <Youtube size={16} />
                  Generate Content
                </>
              )}
            </button>

            {error && (
              <div style={{ 
                marginTop: '16px', 
                padding: '12px', 
                backgroundColor: '#ef44441a', 
                borderRadius: '8px', 
                color: '#ef4444',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}
          </div>

          <div>
            <div style={{ position: 'sticky', top: '20px' }}>
              <YouTubePreview 
                title={generatedTitle}
                description={generatedDescription}
              />
            </div>
            <div style={{ marginTop: '20px' }}>
              <TerminalWindow 
                terminalRef={terminalRef}
                terminalLogs={terminalLogs}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}