"use client"

import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, Repeat2, Heart, BarChart2, Share, Send, Image, FileText, Twitter, Terminal } from 'lucide-react'

type TerminalLog = {
  message: string;
  timestamp: string;
  type: 'info' | 'process' | 'success' | 'error';
};

const TwitterPostGenerator = () => {
  const [userPrompt, setUserPrompt] = useState("")
  const [generatedContent, setGeneratedContent] = useState("")
  const [generatedImage, setGeneratedImage] = useState("/api/placeholder/800/800")
  const [isLoading, setIsLoading] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>([])
  const terminalRef = useRef<HTMLDivElement | null>(null)
  const style = "twitter"

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalLogs])

  const addLog = (message: string, type: 'info' | 'process' | 'success' | 'error' = 'info') => {
    const timestamp = new Date().toLocaleTimeString()
    setTerminalLogs(prev => [...prev, { message, timestamp, type }])
  }

  const generateImage = async (imageDescription: string) => {
    try {
      addLog('Starting image generation...', 'process')
      const imageResponse = await fetch('http://localhost:5001/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          image_description: imageDescription,
          style: style
        })
      })

      if (!imageResponse.ok) {
        throw new Error(`Image generation failed: ${imageResponse.statusText}`)
      }

      const imageResult = await imageResponse.json()
      if (imageResult.image_url) {
        addLog('Image generated successfully ✓', 'success')
        setGeneratedImage(imageResult.image_url)
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        addLog(`Image generation failed: ${error.message}`, 'error')
        setError(`Image generation error: ${error.message}`)
      } else {
        addLog('Image generation failed: Unknown error', 'error')
        setError('Image generation error: Unknown error')
      }
    } finally {
      setIsImageLoading(false)
    }
  }

  const handleGenerate = async () => {
    if (userPrompt.trim()) {
      setIsLoading(true)
      setIsImageLoading(true)
      setError(null)
      setTerminalLogs([]) // Clear previous logs
      
      try {
        addLog('Initializing generation process...', 'process')
        
        // Step 1: Vector Search
        addLog('Starting vector search...', 'process')
        const searchResponse = await fetch('http://localhost:5001/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query_text: userPrompt })
        })
        
        if (!searchResponse.ok) {
          throw new Error(`Search request failed: ${searchResponse.statusText}`)
        }
        
        const searchResults = await searchResponse.json()
        addLog('Vector search completed ✓', 'success')

        // Step 2: Analyze Results
        addLog('Starting content analysis...', 'process')
        const analyzeResponse = await fetch('http://localhost:5001/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ search_results: searchResults })
        })

        if (!analyzeResponse.ok) {
          throw new Error(`Analysis request failed: ${analyzeResponse.statusText}`)
        }

        const analysisResult = await analyzeResponse.json()
        addLog('Content analysis completed ✓', 'success')

        if (analysisResult.tweet_text) {
          setGeneratedContent(analysisResult.tweet_text)
          setIsLoading(false)
          addLog('Tweet content generated successfully ✓', 'success')
        } else {
          throw new Error('No tweet text received from analysis')
        }

        if (analysisResult.image_description) {
          generateImage(analysisResult.image_description)
        } else {
          setIsImageLoading(false)
        }

      } catch (error: unknown) {
        if (error instanceof Error) {
          addLog(`Error: ${error.message}`, 'error')
          setError(error.message)
        } else {
          addLog('Error: Unknown error', 'error')
          setError('Unknown error')
        }
        setGeneratedContent("")
        setGeneratedImage("/api/placeholder/800/800")
        setIsLoading(false)
        setIsImageLoading(false)
      }
    }
  }

  const TerminalWindow = () => {
    const styles = {
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
        overflowY: 'auto' as const,
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

  // Styles
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#000000',
      color: 'white',
      padding: '32px 20px'
    },
    wrapper: {
      maxWidth: '1200px',
      margin: '0 auto'
    },
    header: {
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: '40px',
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
      gap: '40px',
      alignItems: 'start'
    },
    section: {
      backgroundColor: '#16181c',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #2f3336'
    },
    button: {
      backgroundColor: '#1d9bf0',
      color: 'white',
      padding: '14px 28px',
      border: 'none',
      borderRadius: '24px',
      cursor: isLoading ? 'not-allowed' : 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      marginTop: '24px',
      fontSize: '16px',
      fontWeight: '600',
      transition: 'all 0.2s',
      opacity: isLoading ? 0.7 : 1
    },
    errorMessage: {
      color: '#ff4444',
      marginTop: '12px',
      fontSize: '14px',
      textAlign: 'center' as const
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <h1 style={styles.header}>
          <Twitter size={32} color="#1d9bf0" />
          Twitter Post Generator
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
                icon={<Send size={20} />}
                title="Your Prompt"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Enter your tweet content..."
                disabled={isLoading}
              />
              
              <InputSection
                icon={<FileText size={20} />}
                title="Generated Content"
                value={generatedContent}
                onChange={() => {}}
                placeholder="Your generated tweet will appear here..."
                disabled={true}
              />

              <button 
                onClick={handleGenerate} 
                style={styles.button}
                disabled={isLoading}
                onMouseOver={e => !isLoading && ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1a8cd8')}
                onMouseOut={e => !isLoading && ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1d9bf0')}
              >
                {isLoading ? 'Generating...' : 'Generate Tweet'}
                <Send size={18} style={{ marginLeft: '8px' }} />
              </button>
            </div>
            <TerminalWindow />
          </div>

          <div style={styles.section}>
            <TwitterPreview 
              content={generatedContent} 
              imageUrl={generatedImage}
              isLoading={isLoading}
              isImageLoading={isImageLoading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const InputSection = ({ icon, title, value, onChange, placeholder, disabled }: {
  icon: React.ReactNode;
  title: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
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
      height: '120px',
      backgroundColor: disabled ? '#1e1e1e' : '#262626',
      border: '1px solid #404040',
      borderRadius: '12px',
      color: '#e5e5e5',
      padding: '16px',
      fontSize: '15px',
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
        onChange={onChange}
        placeholder={placeholder}
        style={styles.textarea}
        disabled={disabled}
      />
    </div>
  )
}

const TwitterPreview = ({ content, imageUrl, isLoading, isImageLoading }: {
  content: string;
  imageUrl: string;
  isLoading: boolean;
  isImageLoading: boolean;
}) => {
  const [interactions, setInteractions] = useState<{
    quoted: boolean;
    reposted: boolean;
    liked: boolean;
    viewed: boolean;
    stats: {
      quotes: number;
      reposts: number;
      likes: number;
      views: number;
    };
  }>({
    quoted: false,
    reposted: false,
    liked: false,
    viewed: false,
    stats: {
      quotes: 93,
      reposts: 190,
      likes: 939,
      views: 63000
    }
  });

  const handleInteraction = (type: 'quote' | 'repost' | 'like' | 'view' | 'share') => {
    setInteractions(prev => ({
      ...prev,
      [type === 'quote' ? 'quoted' : type]: !prev[type === 'quote' ? 'quoted' : type as keyof typeof prev],
      stats: {
        ...prev.stats,
        [type + 's']: prev[type === 'quote' ? 'quoted' : type as keyof typeof prev] ?
          prev.stats[type + 's' as keyof typeof prev.stats] - 1 :
          prev.stats[type + 's' as keyof typeof prev.stats] + 1
      }
    }))
  }

  const styles = {
    container: {
      backgroundColor: '#16181c',
      borderRadius: '16px',
      overflow: 'hidden',
      color: '#e7e9ea',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      opacity: isLoading ? 0.7 : 1,
      transition: 'opacity 0.2s'
    },
    header: {
      padding: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    avatar: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      overflow: 'hidden',
      backgroundColor: '#2f3336',
      border: '1px solid #2f3336'
    },
    content: {
      padding: '0 16px',
      fontSize: '15px',
      lineHeight: '1.5',
      whiteSpace: 'pre-wrap' as const
    },
    image: {
      padding: '16px',
      position: 'relative' as const,
      '& img': {
        width: '100%',
        borderRadius: '16px',
        border: '1px solid #2f3336'
      }
    },
    imageOverlay: {
      position: 'absolute',
      top: '16px',
      left: '16px',
      right: '16px',
      bottom: '16px',
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '16px'
    },
    stats: {
      padding: '12px 16px',
      display: 'flex',
      gap: '24px',
      color: '#71767b',
      fontSize: '13px',
      borderBottom: '1px solid #2f3336'
    },
    actions: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '8px 16px'
    },
    actionButton: (isActive: boolean, color: string) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: isActive ? color : '#71767b',
      padding: '8px',
      borderRadius: '50%',
      cursor: 'pointer',
      backgroundColor: 'transparent',
      border: 'none',
      transition: 'all 0.2s'
    })
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.avatar}>
          <img 
            src="/api/placeholder/48/48" 
            alt="Profile"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontWeight: '700' }}>NEAR Protocol</span>
            <span style={{ color: '#1d9bf0' }}>✓</span>
          </div>
          <span style={{ color: '#71767b' }}>@NEARProtocol</span>
        </div>
      </div>

      <div style={styles.content}>
        {isLoading ? 'Generating tweet...' : content}
      </div>

      <div style={styles.image}>
        <img src={imageUrl} alt="Post content" />
        {isImageLoading && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
            Generating image...
          </div>
        )}
      </div>

      <div style={styles.stats}>
        <span><strong>{interactions.stats.quotes}</strong> Quotes</span>
        <span><strong>{interactions.stats.reposts}</strong> Reposts</span>
        <span><strong>{interactions.stats.likes}</strong> Likes</span>
        <span><strong>{(interactions.stats.views / 1000).toFixed(1)}K</strong> Views</span>
      </div>

      <div style={styles.actions}>
        {[
          { type: 'quote', icon: MessageCircle, color: '#1d9bf0' },
          { type: 'repost', icon: Repeat2, color: '#00ba7c' },
          { type: 'like', icon: Heart, color: '#f91880' },
          { type: 'view', icon: BarChart2, color: '#1d9bf0' },
          { type: 'share', icon: Share, color: '#1d9bf0' }
        ].map(({ type, icon: Icon, color }) => (
          <button
            key={type}
            style={styles.actionButton(interactions[type === 'quote' ? 'quoted' : type as keyof typeof interactions] as boolean, color)}
            onClick={() => handleInteraction(type as "quote" | "repost" | "like" | "view" | "share")}
            onMouseOver={e => (e.currentTarget.style as any).backgroundColor = `${color}15`}
            onMouseOut={e => (e.currentTarget.style as any).backgroundColor = 'transparent'}
          >
            <Icon
              size={20}
              color={interactions[type === 'quote' ? 'quoted' : type as keyof typeof interactions] ? color : '#71767b'}
              fill={type === 'like' && interactions.liked ? color : 'none'}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export default TwitterPostGenerator