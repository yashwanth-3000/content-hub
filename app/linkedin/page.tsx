'use client'

import React, { useState, useRef, useEffect } from 'react'
import { 
  ThumbsUp, 
  MessageCircle, 
  Share2, 
  Send, 
  Linkedin,
  PenLine,
  MessageSquare,
  Image as ImageIcon,
  Globe,
  MoreHorizontal,
  Repeat,
  Terminal
} from 'lucide-react'

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
    overflowY: 'auto',
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
  message: (type: string) => ({
    color: {
      info: '#e5e5e5',
      process: '#60a5fa',
      success: '#34d399',
      error: '#ef4444'
    }[type]
  })
}
// TerminalWindow component
const TerminalWindow = ({ terminalRef, terminalLogs }: { terminalRef: React.RefObject<HTMLDivElement>, terminalLogs: any[] }) => {
  return (
    <div style={terminalStyles.container}>
      <div style={terminalStyles.header}>
        <Terminal size={16} color="#e5e5e5" />
        <span style={terminalStyles.title}>Terminal Output</span>
      </div>
      <div style={{...terminalStyles.content, overflowY: 'auto' as const}} ref={terminalRef}>
        {terminalLogs.map((log, index) => (
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

export default function Component() {
  const [userPrompt, setUserPrompt] = useState("")
  const [generatedContent, setGeneratedContent] = useState("Share your professional journey—inspire others with your story.")
  const [generatedImage, setGeneratedImage] = useState("/api/placeholder/600/400")
  const [isLoading, setIsLoading] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [terminalLogs, setTerminalLogs] = useState<{ message: string; timestamp: string; type: string }[]>([])
  const terminalRef = useRef(null)

  useEffect(() => {
    if (terminalRef.current) {
      (terminalRef.current as HTMLElement).scrollTop = (terminalRef.current as HTMLElement).scrollHeight
    }
  }, [terminalLogs])

  const addLog = (message: string, type: string = 'info') => {
    const timestamp = new Date().toLocaleTimeString()
    setTerminalLogs(prevLogs => [...prevLogs, { message, timestamp, type }])
  }

  const generateImage = async (imageDescription: string) => {
    try {
      addLog('Starting image generation...', 'process')
      const imageResponse = await fetch('http://localhost:5001/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          image_description: imageDescription
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

        const analyzeResponse = await fetch('http://localhost:5001/analyze_Linkedin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ search_results: searchResults })
        })

        if (!analyzeResponse.ok) {
          throw new Error(`Analysis request failed: ${analyzeResponse.statusText}`)
        }

        const analysisResult = await analyzeResponse.json()
        addLog('Content analysis completed ✓', 'success')

        if (analysisResult.linkedin_text) {
          setGeneratedContent(analysisResult.linkedin_text)
          setIsLoading(false)
          addLog('LinkedIn post generated successfully ✓', 'success')
        } else {
          throw new Error('No content text received from analysis')
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
          addLog(`Error: Unknown error occurred`, 'error')
          setError('Unknown error occurred')
        }
        setGeneratedContent("Share your professional journey—inspire others with your story.")
        setGeneratedImage("/api/placeholder/600/400")
        setIsLoading(false)
        setIsImageLoading(false)
      }
    }
  }

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#000000',
    padding: '20px'
  }

  const buttonStyle = {
    backgroundColor: '#0a66c2',
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
  }

  const textareaStyle = {
    width: '100%',
    height: '100px',
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '8px',
    color: '#ffffff',
    padding: '12px',
    fontSize: '14px',
    resize: 'none' as const
  }

  const disabledTextareaStyle = {
    ...textareaStyle,
    backgroundColor: '#262626',
    cursor: 'not-allowed'
  }

  return (
    <div style={containerStyle}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
          <Linkedin size={32} color="#0a66c2" />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ffffff' }}>
            LinkedIn Content Generator
          </h1>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '400px 400px', gap: '40px', justifyContent: 'center' }}>
          <div>
            <InputSection
              title="Your Prompt"
              icon={<PenLine size={20} color="#ffffff" />}
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              disabled={false}
              placeholder="Enter your content idea or topic..."
              textareaStyle={textareaStyle}
            />
            <InputSection
              title="Generated Content"
              icon={<MessageSquare size={20} color="#ffffff" />}
              value={generatedContent}
              onChange={() => {}}
              placeholder="Your generated content will appear here..."
              textareaStyle={disabledTextareaStyle}
              disabled={true}
            />
            <InputSection
              title="Image Generation"
              icon={<ImageIcon size={20} color="#ffffff" />}
              value={generatedImage}
              onChange={() => {}}
              placeholder="Your image URL will appear here..."
              textareaStyle={disabledTextareaStyle}
              disabled={true}
            />
            <button 
              onClick={handleGenerate}
              disabled={isLoading || isImageLoading}
              style={{
                ...buttonStyle,
                backgroundColor: isLoading || isImageLoading ? '#666666' : '#0a66c2',
                cursor: isLoading || isImageLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading || isImageLoading ? 0.7 : 1,
                gap: '8px'
              }}
              onMouseOver={e => !isLoading && !isImageLoading && (e.currentTarget.style.backgroundColor = '#084e96')}
              onMouseOut={e => !isLoading && !isImageLoading && (e.currentTarget.style.backgroundColor = '#0a66c2')}
            >
              {isLoading || isImageLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Generating...
                </>
              ) : (
                <>
                  Generate Content
                  <Send size={16} style={{ marginLeft: '8px' }} />
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
          <LinkedInPreview content={generatedContent} imageUrl={generatedImage} />
        </div>
      </div>
    </div>
  )
}

function InputSection({ title, icon, value, onChange, placeholder, textareaStyle, disabled }: { 
    title: string; 
    icon: React.ReactNode; 
    value: string; 
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; 
    placeholder: string; 
    textareaStyle: React.CSSProperties; 
    disabled: boolean; 
}) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        {icon}
        <h2 style={{ fontSize: '0.875rem', fontWeight: 'semibold', color: '#ffffff' }}>{title}</h2>
      </div>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={textareaStyle}
        disabled={disabled}
      />
    </div>
  )
}

function LinkedInPreview({ content, imageUrl }: { content: string; imageUrl: string }) {
  const [isLiked, setIsLiked] = useState(false)
  const [isReposted, setIsReposted] = useState(false)
  const [commentCount, setCommentCount] = useState(45)
  const [repostCount, setRepostCount] = useState(12)
  const [likeCount, setLikeCount] = useState(243)

  const previewStyle = {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '8px',
    overflow: 'hidden',
    width: '400px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
  }

  function IconButton({ Icon, label, onClick, isActive, activeColor = '#0a66c2', style }: { 
    Icon: React.FC; 
    label: string; 
    onClick: () => void; 
    isActive: boolean; 
    activeColor?: string; 
    style?: React.CSSProperties;
  }) {
    const [isHovered, setIsHovered] = useState(false)
    
    return (
      <button 
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '12px',
          border: 'none',
          backgroundColor: 'transparent',
          color: isActive ? activeColor : '#999',
          cursor: 'pointer',
          borderRadius: '4px',
          transition: 'background-color 0.2s',
          fontSize: '12px',
          fontWeight: '600',
          ...style
        }}
      >
        <Icon 
          // Remove fill if not supported
          // fill={isActive ? activeColor : 'none'} 
        />
        {label}
      </button>
    )
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
  }

  const handleRepost = () => {
    setIsReposted(!isReposted)
    setRepostCount(prev => isReposted ? prev - 1 : prev + 1)
  }

  return (
    <div style={previewStyle}>
      <div style={{ padding: '16px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#333' }}></div>
          <div>
            <div style={{ fontWeight: '600', color: '#ffffff', fontSize: '14px', marginBottom: '4px' }}>John Doe</div>
            <div style={{ color: '#999', fontSize: '12px', marginBottom: '4px' }}>Senior Product Manager | Tech Enthusiast</div>
            <div style={{ color: '#999', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>1d</span>
              <span>•</span>
              <Globe size={12} />
            </div>
          </div>
        </div>
        <button style={{ 
          backgroundColor: 'transparent', 
          border: 'none', 
          cursor: 'pointer',
          padding: '4px'
        }}>
          <MoreHorizontal size={20} color="#999" />
        </button>
      </div>
  
      <div style={{ padding: '0 16px 16px', color: '#ffffff', fontSize: '14px', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
        {content}
      </div>
  
      {imageUrl && (
        <div style={{ width: '100%', aspectRatio: '4/3', backgroundColor: '#333', overflow: 'hidden' }}>
          <img 
            src={imageUrl} 
            alt="Generated content" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover' 
            }} 
          />
        </div>
      )}
  
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #333' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#999', fontSize: '12px' }}>
          <span>{likeCount} likes</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span>{commentCount} comments</span>
            <span>{repostCount} reposts</span>
          </div>
        </div>
      </div>
  
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        borderBottom: '1px solid #333',
        padding: '4px'
      }}>
        <IconButton 
          Icon={ThumbsUp} 
          label="Like"
          onClick={handleLike}
          isActive={isLiked}
          activeColor="#0a66c2"
        />
        <IconButton 
          Icon={MessageCircle} 
          label="Comment"
          onClick={() => setCommentCount(prev => prev + 1)}
          isActive={false}
        />
        <IconButton 
          Icon={Repeat} 
          label="Repost"
          onClick={handleRepost}
          isActive={isReposted}
        />
        <IconButton 
          Icon={Share2} 
          label="Share"
          onClick={() => {}}
          isActive={false}
        />
      </div>
  
      <div style={{ padding: '16px' }}>
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          alignItems: 'flex-start'
        }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            backgroundColor: '#333',
            flexShrink: 0
          }}></div>
          <div style={{ 
            flex: 1,
            backgroundColor: '#262626',
            borderRadius: '20px',
            padding: '12px 16px',
            color: '#999',
            fontSize: '14px'
          }}>
            Add a comment...
          </div>
        </div>
      </div>
    </div>
  )
};