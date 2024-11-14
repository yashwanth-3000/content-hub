'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Instagram, PenLine, MessageSquare, Terminal, Check } from 'lucide-react'
import { motion } from 'framer-motion'

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#000000',
    color: 'white',
    fontFamily: 'Roboto, Arial, sans-serif',
    padding: '20px',
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '20px',
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
    transition: 'background-color 0.2s',
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
    resize: 'none' as 'none',
  },
  input: {
    width: '100%',
    backgroundColor: '#262626',
    border: '1px solid #404040',
    borderRadius: '8px',
    color: '#e5e5e5',
    padding: '12px',
    fontSize: '14px',
  },
}

const terminalStyles = {
  container: {
    backgroundColor: '#1a1b1e',
    borderRadius: '8px',
    border: '1px solid #2f3336',
    marginTop: '24px',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#2f3336',
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  title: {
    color: '#e5e5e5',
    fontSize: '14px',
    fontWeight: '500',
  },
  content: {
    padding: '16px',
    maxHeight: '300px',
    overflowY: 'auto' as 'auto',
    fontFamily: 'monaco, Consolas, "Courier New", monospace',
    fontSize: '13px',
    lineHeight: '1.6',
  },
  logEntry: {
    marginBottom: '8px',
    display: 'flex',
    gap: '8px',
  },
  timestamp: {
    color: '#6b7280',
    minWidth: '85px',
  },
  message: (type: 'info' | 'process' | 'success' | 'error') => ({
    color: {
      info: '#e5e5e5',
      process: '#60a5fa',
      success: '#34d399',
      error: '#ef4444',
    }[type],
  }),
}

const previewStyles = {
  container: {
    backgroundColor: '#000000',
    border: '1px solid #363636',
    borderRadius: '12px',
    overflow: 'hidden',
    width: '400px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.05)',
  },
  header: {
    padding: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #262626',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#262626',
  },
  imageContainer: {
    width: '400px',
    height: '400px',
    backgroundColor: '#262626',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    padding: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftActions: {
    display: 'flex',
    gap: '16px',
  },
  content: {
    padding: '12px',
    color: '#e5e5e5',
    fontSize: '14px',
    lineHeight: '1.5',
    whiteSpace: 'pre-wrap',
  },
}

const IconButton: React.FC<{
  Icon: React.FC<React.SVGProps<SVGSVGElement>> & { size?: number };
  onClick: () => void;
  isActive: boolean;
  activeColor: string;
}> = ({ Icon, onClick, isActive, activeColor }) => {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <motion.div 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        cursor: 'pointer',
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon 
        style={{ 
          strokeWidth: 2,
          color: isActive ? activeColor : '#e5e5e5',
          fill: isActive ? activeColor : 'none',
          transition: 'all 0.2s',
        }} 
      />
    </motion.div>
  )
}

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

const InstagramPreview: React.FC<{
  content: string;
  imageUrl: string;
  username: string;
  onUsernameChange: (name: string) => void;
  onContentChange: (content: string) => void;
}> = ({ content, imageUrl, username, onUsernameChange, onContentChange }) => {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(9311)
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [tempUsername, setTempUsername] = useState(username)
  const [isEditingContent, setIsEditingContent] = useState(false)
  const [tempContent, setTempContent] = useState(content)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  const handleUsernameEdit = () => {
    setIsEditingUsername(true)
  }

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUsernameChange(tempUsername)
    setIsEditingUsername(false)
  }

  const handleContentEdit = () => {
    setIsEditingContent(true)
  }

  const handleContentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onContentChange(tempContent)
    setIsEditingContent(false)
  }

  return (
    <div style={previewStyles.container}>
      <div style={previewStyles.header}>
        <div style={previewStyles.userInfo}>
          <div style={previewStyles.avatar}></div>
          {isEditingUsername ? (
            <form onSubmit={handleUsernameSubmit}>
              <input
                type="text"
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                style={{
                  ...styles.input,
                  fontSize: '14px',
                  fontWeight: '600',
                  padding: '4px 8px',
                  width: '120px',
                }}
                autoFocus
              />
            </form>
          ) : (
            <span 
              style={{ color: '#e5e5e5', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} 
              onClick={handleUsernameEdit}
            >
              {username}
              <Check size={16} color="#AAAAAA" />
            </span>
          )}
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

      <div style={previewStyles.content}>
        {isEditingContent ? (
          <form onSubmit={handleContentSubmit}>
            <textarea
              value={tempContent}
              onChange={(e) => setTempContent(e.target.value)}
              style={{
                ...styles.textarea,
                minHeight: '100px',
                width: '100%',
                marginTop: '10px',
              }}
              autoFocus
            />
            <motion.button 
              type="submit" 
              style={{...styles.button, marginTop: '10px', width: 'auto', padding: '8px 16px'}}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Save
            </motion.button>
          </form>
        ) : (
          <div onClick={handleContentEdit} style={{whiteSpace: 'pre-wrap', cursor: 'pointer'}}>
            {content}
          </div>
        )}
      </div>
    </div>
  )
}

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
  const [generatedContent, setGeneratedContent] = useState("Share your story—capture moments that matter.")
  const [generatedImage, setGeneratedImage] = useState("https://picsum.photos/400/400")
  const [isLoading, setIsLoading] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [terminalLogs, setTerminalLogs] = useState<{ message: string; timestamp: string; type: 'info' | 'process' | 'success' | 'error' }[]>([])
  const terminalRef = useRef<HTMLDivElement | null>(null)
  const [username, setUsername] = useState("instagrammer")
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
    addLog('Starting image generation...', 'process')
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API delay
    const dummyImageUrl = `https://picsum.photos/seed/${Math.random()}/400/400`
    addLog('Image generated successfully ✓', 'success')
    setGeneratedImage(dummyImageUrl)
    setIsImageLoading(false)
  }

  const handleGenerate = async () => {
    if (userPrompt.trim()) {
      setIsLoading(true)
      setIsImageLoading(true)
      setError(null)
      setTerminalLogs([])
      
      try {
        addLog('Initializing generation process...', 'process')
        await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API delay
        
        addLog('Analyzing content...', 'process')
        await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API delay

        const dummyCaption = `📸 Capturing life's beautiful moments!\n\n${userPrompt}\n\nWhat's your favorite way to make memories? Share in the comments below! 👇\n\n#LifeMoments #InstaInspiration #DailyJoy`
        setGeneratedContent(dummyCaption)
        setIsLoading(false)
        addLog('Instagram caption generated successfully ✓', 'success')

        generateImage(userPrompt)

      } catch (error: unknown) {
        if (error instanceof Error) {
          addLog(`Error: ${error.message}`, 'error')
          setError(error.message)
        } else {
          addLog('An unknown error occurred', 'error')
          setError('An unknown error occurred')
        }
        setGeneratedContent("Share your story—capture moments that matter.")
        setGeneratedImage("/placeholder.svg?height=400&width=400")
        setIsLoading(false)
        setIsImageLoading(false)
      }
    }
  }

  const handleUsernameChange = (newUsername: string) => {
    setUsername(newUsername)
  }

  const handleContentChange = (newContent: string) => {
    setGeneratedContent(newContent)
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px', justifyContent: 'center' }}>
          <div>
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
              onChange={(e) => setGeneratedContent(e.target.value)}
              placeholder="Your generated caption will appear here..."
            />

            <motion.button
              onClick={handleGenerate}
              disabled={isLoading || isImageLoading}
              style={{
                ...styles.button,
                backgroundColor: isLoading || isImageLoading ? '#666666' : '#E1306C',
                cursor: isLoading || isImageLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading || isImageLoading ? 0.7 : 1,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLoading || isImageLoading ? 'Generating...' : 'Generate Content'}
            </motion.button>

            {error && (
              <div style={{ 
                marginTop: '16px', 
                padding: '12px', 
                backgroundColor: '#ef44441a', 
                borderRadius: '8px', 
                color: '#ef4444',
                fontSize: '14px',
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
              username={username}
              onUsernameChange={handleUsernameChange}
              onContentChange={handleContentChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}