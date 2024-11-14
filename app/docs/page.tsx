'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Instagram, PenLine, MessageSquare, Image, Terminal } from 'lucide-react'

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
    backgroundColor: '#E1306C',
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
    resize: 'none'
  },
  disabledTextarea: {
    width: '100%',
    height: '100px',
    backgroundColor: '#1e1e1e',
    border: '1px solid #404040',
    borderRadius: '8px',
    color: '#e5e5e5',
    padding: '12px',
    fontSize: '14px',
    resize: 'none',
    cursor: 'not-allowed',
    opacity: 0.7
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
    backgroundColor: '#000000',
    border: '1px solid #363636',
    borderRadius: '12px',
    overflow: 'hidden',
    width: '400px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.05)'
  },
  header: {
    padding: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #262626'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#262626'
  },
  imageContainer: {
    width: '400px',
    height: '400px',
    backgroundColor: '#262626',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  actions: {
    padding: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  leftActions: {
    display: 'flex',
    gap: '16px'
  },
  content: {
    padding: '12px',
    color: '#e5e5e5',
    fontSize: '14px',
    lineHeight: '1.5',
    whiteSpace: 'pre-wrap'
  }
}

// IconButton component
const IconButton: React.FC<{
  Icon: React.FC<React.SVGProps<SVGSVGElement>> & { size?: number };
  onClick: () => void;
  isActive: boolean;
  activeColor: string;
}> = ({ Icon, onClick, isActive, activeColor }) => {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <div 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        cursor: 'pointer',
        transition: 'transform 0.2s',
        transform: isHovered ? 'scale(1.1)' : 'scale(1)'
      }}
    >
      <Icon 
        style={{ 
          strokeWidth: 2,
          color: isActive ? activeColor : '#e5e5e5',
          fill: isActive ? activeColor : 'none',
          transition: 'all 0.2s'
        }} 
      />
    </div>
  )
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
        style={{
          width: '100%',
          height: '120px',
          backgroundColor: '#1E1E1E',
          border: '1px solid #404040',
          borderRadius: '8px',
          color: '#FFFFFF',
          padding: '16px',
          fontSize: '16px'
        }}
      />
    </div>
  )
}

// InstagramPreview component
const InstagramPreview: React.FC<{
  content: string;
  imageUrl: string;
}> = ({ content, imageUrl }) => {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(9311)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  return (
    <div style={previewStyles.container}>
      <div style={previewStyles.header}>
        <div style={previewStyles.userInfo}>
          <div style={previewStyles.avatar}></div>
          <span style={{ color: '#e5e5e5', fontWeight: '600' }}>username</span>
        </div>
        <MoreHorizontal size={20} color="#e5e5e5" style={{ cursor: 'pointer' }} />
      </div>

      <div style={previewStyles.imageContainer}>
        <img 
          src={imageUrl} 
          alt="Generated content" 
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} 
        />
      </div>

      <div style={previewStyles.actions}>
        <div style={previewStyles.leftActions}>
          <IconButton Icon={Heart} onClick={handleLike} isActive={isLiked} activeColor="#E1306C" />
          <IconButton Icon={MessageCircle} onClick={() => {}} isActive={false} activeColor="#e5e5e5" />
          <IconButton Icon={Send} onClick={() => {}} isActive={false} activeColor="#e5e5e5" />
        </div>
        <IconButton Icon={Bookmark} onClick={handleBookmark} isActive={isBookmarked} activeColor="#e5e5e5" />
      </div>

      <div style={{ padding: '0 12px' }}>
        <div style={{ color: '#e5e5e5', fontWeight: '600', marginBottom: '4px' }}>
          {likeCount.toLocaleString()} likes
        </div>
      </div>

      <div style={previewStyles.content}>{content}</div>
    </div>
  )
}

// TerminalWindow component
const TerminalWindow: React.FC<{
  terminalRef: React.RefObject<HTMLDivElement>;
  terminalLogs: { message: string; timestamp: string; type: 'info' | 'process' | 'success' | 'error' }[];
}> = ({ terminalRef, terminalLogs }) => {
  return (
    <div style={terminalStyles.container}>
      <div style={terminalStyles.header}>
        <Terminal size={16} color="#e5e5e5" />
        <span style={terminalStyles.title}>Terminal Output</span>
      </div>
      <div style={terminalStyles.content} ref={terminalRef}>
        {terminalLogs.map((log: { message: string; timestamp: string; type: 'info' | 'process' | 'success' | 'error' }, index: number) => (
          <div key={index} style={terminalStyles.logEntry}>
            <span style={terminalStyles.timestamp}>[{log.timestamp}]</span>
            <span style={terminalStyles.message(log.type)}>{log.message}</span>
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
  const [userPrompt, setUserPrompt] = useState("")
  const [generatedContent, setGeneratedContent] = useState("Share your story—capture moments that matter.")
  const [generatedImage, setGeneratedImage] = useState("/api/placeholder/600/600")
  const [isLoading, setIsLoading] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [terminalLogs, setTerminalLogs] = useState<{ message: string; timestamp: string; type: 'info' | 'process' | 'success' | 'error' }[]>([])
  const terminalRef = useRef<HTMLDivElement | null>(null)
  const style = "instagram"

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
    } catch (error: any) {
      addLog(`Image generation failed: ${error.message}`, 'error')
      setError(`Image generation error: ${error.message}`)
    } finally {
      setIsImageLoading(false)
    }
  }

  const handleGenerate = async () => {
    if (userPrompt.trim()) {
      setIsLoading(true)
      setIsImageLoading(true)
      setError(null)
      setTerminalLogs([])
      
      try {
        addLog('Initializing generation process...', 'process')
        
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

        const analyzeResponse = await fetch('http://localhost:5001/analyze_instagram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ search_results: searchResults })
        })

        if (!analyzeResponse.ok) {
          throw new Error(`Analysis request failed: ${analyzeResponse.statusText}`)
        }

        const analysisResult = await analyzeResponse.json()
        addLog('Content analysis completed ✓', 'success')

        if (analysisResult.post_caption) {
          setGeneratedContent(analysisResult.post_caption + '\n\n' + analysisResult.hashtags)
          setIsLoading(false)
          addLog('Instagram caption generated successfully ✓', 'success')
        } else {
          throw new Error('No caption text received from analysis')
        }

        if (analysisResult.image_description) {
          generateImage(analysisResult.image_description)
        } else {
          setIsImageLoading(false)
        }

      } catch (error: unknown) {
        if (error instanceof Error) {
          addLog(`Error: ${error.message}`, 'error');
          setError(error.message);
        } else {
          addLog('An unknown error occurred', 'error');
          setError('An unknown error occurred');
        }
        setGeneratedContent("Share your story—capture moments that matter.")
        setGeneratedImage("/api/placeholder/600/600")
        setIsLoading(false)
        setIsImageLoading(false)
      }
    }
  }

  return (
    <div style={styles.container}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={styles.titleContainer}>
          <Instagram size={32} color="#E1306C" />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e5e5e5' }}>
            Instagram Content Generator
          </h1>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '400px 400px', gap: '40px', justifyContent: 'center' }}>
          <div>
            {/* Simplified input sections */}
            <InputSection
              title="What's on your mind?"
              icon={<PenLine size={20} color="#E1306C" />}
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Type your content idea here"
            />
            
            <InputSection
              title="Generated Caption"
              icon={<MessageSquare size={20} color="#E1306C" />}
              value={generatedContent}
              onChange={() => {}}
              placeholder="Your generated caption will appear here..."
            />


            <button
              onClick={handleGenerate}
              disabled={isLoading || isImageLoading}
              style={{
                ...styles.button,
                backgroundColor: isLoading || isImageLoading ? '#666666' : '#E1306C',
                cursor: isLoading || isImageLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading || isImageLoading ? 0.7 : 1,
                gap: '8px'
              }}
            >
              {isLoading || isImageLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Generating...
                </>
              ) : (
                <>
                  <Image size={16} />
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

            <TerminalWindow 
              terminalRef={terminalRef}
              terminalLogs={terminalLogs}
            />
          </div>

          <div style={{ position: 'sticky', top: '20px' }}>
            <InstagramPreview 
              content={generatedContent}
              imageUrl={generatedImage}
            />
          </div>
        </div>
      </div>
    </div>
  )
}