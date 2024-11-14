'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Youtube, PenLine, MessageSquare, FileText, Terminal, Check, ThumbsUp, ThumbsDown, Share2, Scissors, Bookmark, MoreHorizontal } from 'lucide-react'
import { motion } from 'framer-motion'

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#000000', // Changed from '#0F0F0F' to '#000000'
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
  videoContainer: {
    position: 'relative' as const,
    width: '100%',
    paddingTop: '56.25%', // 16:9 aspect ratio
    borderRadius: '12px',
    overflow: 'hidden',
  },
  videoImage: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  },
  videoTitle: {
    fontSize: '18px',
    fontWeight: 'bold' as const,
    margin: '15px 0',
    cursor: 'pointer',
  },
  channelInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '15px',
  },
  channelDetails: {
    display: 'flex',
    alignItems: 'center',
  },
  channelLogo: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#FF0000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '10px',
  },
  channelName: {
    fontWeight: 'bold' as const,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer',
  },
  subscribeButton: {
    backgroundColor: '#CC0000',
    color: 'white',
    border: 'none',
    borderRadius: '18px',
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: 'bold' as const,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  interactionButtons: {
    display: 'flex',
    gap: '10px',
    marginBottom: '15px',
  },
  interactionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    borderRadius: '18px',
    padding: '6px 12px',
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  description: {
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#AAAAAA',
    cursor: 'pointer',
  },
  descriptionTextarea: {
    width: '100%',
    minHeight: '100px',
    backgroundColor: '#262626',
    border: '1px solid #404040',
    borderRadius: '8px',
    color: '#e5e5e5',
    padding: '12px',
    fontSize: '14px',
    resize: 'vertical' as 'vertical',
    marginTop: '10px',
  },
  terminalContainer: {
    backgroundColor: '#1a1b1e',
    borderRadius: '8px',
    border: '1px solid #2f3336',
    marginTop: '24px',
    overflow: 'hidden',
  },
  terminalHeader: {
    backgroundColor: '#2f3336',
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  terminalTitle: {
    color: '#e5e5e5',
    fontSize: '14px',
    fontWeight: '500',
  },
  terminalContent: {
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

const InputSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  isTyping: boolean;
}> = ({ title, icon, value, onChange, placeholder, isTyping }) => {
  const [displayedValue, setDisplayedValue] = useState('')

  useEffect(() => {
    if (isTyping) {
      let i = 0
      const interval = setInterval(() => {
        setDisplayedValue(value.slice(0, i))
        i++
        if (i > value.length) {
          clearInterval(interval)
        }
      }, 20)
      return () => clearInterval(interval)
    } else {
      setDisplayedValue(value)
    }
  }, [value, isTyping])

  return (
    <div style={{ marginBottom: '24px' }}>
      <label style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        {icon}
        {title}
      </label>
      <textarea
        value={displayedValue}
        onChange={onChange}
        placeholder={placeholder}
        style={styles.textarea}
        readOnly={isTyping}
      />
    </div>
  )
}

const YouTubePreview: React.FC<{
  title: string;
  description: string;
  channelName: string;
  onChannelNameChange: (name: string) => void;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
}> = ({ title, description, channelName, onChannelNameChange, onTitleChange, onDescriptionChange }) => {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [likes, setLikes] = useState(3300)
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)
  const [isEditingChannel, setIsEditingChannel] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [tempChannelName, setTempChannelName] = useState(channelName)
  const [tempTitle, setTempTitle] = useState(title)
  const [tempDescription, setTempDescription] = useState(description)

  useEffect(() => {
    setTempTitle(title)
  }, [title])

  useEffect(() => {
    setTempDescription(description)
  }, [description])

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed)
  }

  const handleLike = () => {
    if (!isLiked) {
      setLikes(likes + 1)
      setIsLiked(true)
      setIsDisliked(false)
    } else {
      setLikes(likes - 1)
      setIsLiked(false)
    }
  }

  const handleDislike = () => {
    setIsDisliked(!isDisliked)
    if (isLiked) {
      setLikes(likes - 1)
      setIsLiked(false)
    }
  }

  const handleChannelNameEdit = () => {
    setIsEditingChannel(true)
  }

  const handleChannelNameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onChannelNameChange(tempChannelName)
    setIsEditingChannel(false)
  }

  const handleTitleEdit = () => {
    setIsEditingTitle(true)
  }

  const handleTitleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onTitleChange(tempTitle)
    setIsEditingTitle(false)
  }

  const handleDescriptionEdit = () => {
    setIsEditingDescription(true)
  }

  const handleDescriptionSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onDescriptionChange(tempDescription)
    setIsEditingDescription(false)
  }

  return (
    <div>
      <div style={styles.videoContainer}>
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-11-14%20at%207.39.07%E2%80%AFPM-OS69giPdyDl9HY3Lb64CShH9UsSrt6.png"
          alt="Video thumbnail"
          style={styles.videoImage}
        />
      </div>
      {isEditingTitle ? (
        <form onSubmit={handleTitleSubmit}>
          <input
            type="text"
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            style={{...styles.input, fontSize: '18px', fontWeight: 'bold', margin: '15px 0'}}
            autoFocus
          />
        </form>
      ) : (
        <h1 style={styles.videoTitle} onClick={handleTitleEdit}>{title}</h1>
      )}
      <div style={styles.channelInfo}>
        <div style={styles.channelDetails}>
          <div style={styles.channelLogo}>
            <Youtube size={24} color="white" />
          </div>
          <div>
            {isEditingChannel ? (
              <form onSubmit={handleChannelNameSubmit}>
                <input
                  type="text"
                  value={tempChannelName}
                  onChange={(e) => setTempChannelName(e.target.value)}
                  style={styles.input}
                  autoFocus
                />
              </form>
            ) : (
              <div style={styles.channelName} onClick={handleChannelNameEdit}>
                {channelName}
                <Check size={16} color="#AAAAAA" />
              </div>
            )}
            <div style={{ fontSize: '12px', color: '#AAAAAA' }}>41.9M subscribers</div>
          </div>
        </div>
        <motion.button
          style={{
            ...styles.subscribeButton,
            backgroundColor: isSubscribed ? '#AAAAAA' : '#CC0000',
          }}
          onClick={handleSubscribe}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isSubscribed ? 'Subscribed' : 'Subscribe'}
        </motion.button>
      </div>
      <div style={styles.interactionButtons}>
        <motion.button
          style={{
            ...styles.interactionButton,
            backgroundColor: isLiked ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
          }}
          onClick={handleLike}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ThumbsUp size={18} /> {likes}
        </motion.button>
        <motion.button
          style={{
            ...styles.interactionButton,
            backgroundColor: isDisliked ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
          }}
          onClick={handleDislike}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ThumbsDown size={18} />
        </motion.button>
        <motion.button
          style={styles.interactionButton}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Share2 size={18} /> Share
        </motion.button>
        <motion.button
          style={styles.interactionButton}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Scissors size={18} /> Clip
        </motion.button>
        <motion.button
          style={styles.interactionButton}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Bookmark size={18} /> Save
        </motion.button>
        <motion.button
          style={styles.interactionButton}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MoreHorizontal size={18} />
        </motion.button>
      </div>
      <div style={styles.description}>
        <p>48K views • 3 years ago</p>
        {isEditingDescription ? (
          <form onSubmit={handleDescriptionSubmit}>
            <textarea
              value={tempDescription}
              onChange={(e) => setTempDescription(e.target.value)}
              style={{...styles.descriptionTextarea}}
              autoFocus
            />
            <button type="submit" style={{...styles.button, marginTop: '10px', width: 'auto', padding: '8px 16px'}}>
              Save
            </button>
          </form>
        ) : (
          <p onClick={handleDescriptionEdit} style={{whiteSpace: 'pre-wrap'}}>{description}</p>
        )}
      </div>
    </div>
  )
}

const TerminalWindow: React.FC<{
  terminalRef: React.RefObject<HTMLDivElement>;
  terminalLogs: { message: string; timestamp: string; type: string }[];
}> = ({ terminalRef, terminalLogs }) => {
  return (
    <div style={styles.terminalContainer}>
      <div style={styles.terminalHeader}>
        <Terminal size={16} color="#e5e5e5" />
        <span style={styles.terminalTitle}>Terminal Output</span>
      </div>
      <div style={styles.terminalContent} ref={terminalRef}>
        {terminalLogs.map((log, index) => (
          <div key={index} style={styles.logEntry}>
            <span style={styles.timestamp}>[{log.timestamp}]</span>
            <span style={styles.message(log.type as 'info' | 'process' | 'success' | 'error')}>{log.message}</span>
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
  const [userPrompt, setUserPrompt] = useState("Moving away from competition can get you to the top | Varun Mayya | TEDxDSC")
  const [generatedTitle, setGeneratedTitle] = useState("")
  const [generatedScript, setGeneratedScript] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [terminalLogs, setTerminalLogs] = useState<{ message: string; timestamp: string; type: 'info' | 'process' | 'success' | 'error' }[]>([])
  const terminalRef = useRef<HTMLDivElement | null>(null)
  const [description, setDescription] = useState("")
  const [channelName, setChannelName] = useState("TEDx Talks")
  const [isTyping, setIsTyping] = useState(false)

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
      setGeneratedTitle("")
      setGeneratedScript("")
      setDescription("")

      try {
        addLog('Initializing generation process...', 'process')
        await new Promise(resolve => setTimeout(resolve, 2000))
        addLog('Analyzing user prompt...', 'process')
        await new Promise(resolve => setTimeout(resolve, 1500))
        addLog('Generating YouTube content...', 'process')
        await new Promise(resolve => setTimeout(resolve, 2500))

        setIsTyping(true)
        setGeneratedTitle(userPrompt)
        setGeneratedScript(`In this inspiring TEDx talk, Varun Mayya, one of the youngest entrepreneurs in India to raise venture capital funding, shares his insights on achieving success by moving away from competition. Here are the key points from his talk:

1. Importance of exploration: Varun emphasizes the need to explore different fields and industries to find unique opportunities.

2. Choosing the right path: He discusses how to identify and choose the most promising direction for your career or business.

3. Obsession and focus: Varun stresses the importance of becoming obsessed with your chosen path and focusing intensely on it.

4. Career growth strategy: He explains how moving away from competition can accelerate your career growth and lead you to the top of your field.

5. Freelancing and industry mashups: Varun shares his views on how freelancing and combining different industries will shape the future of work.

6. Personal experience: Throughout the talk, he uses his own life experiences as examples to illustrate his points.

7. Book insights: Varun touches upon ideas from his book, "Pyjama Profit," which likely contains more detailed strategies on career growth and entrepreneurship.

8. Future of work: He discusses how the landscape of work is changing and how individuals can position themselves for success in this evolving environment.

This talk is particularly relevant for young professionals, aspiring entrepreneurs, and anyone looking to accelerate their career growth by thinking differently about competition and opportunity.`)
        setDescription("Varun Mayya, one of the youngest entrepreneurs in India to raise venture capital funding, draws a path for all those who want to succeed. Previously having found JobSpire, and currently the CEO of Avalon Labs, Varun takes his own life as an example in the talk. He goes on to explain the same by focusing on the importance of exploring, choosing, and then obsessing about that one step that can boost your career growth. His talk revolves around his recently authored book, Pyjama Profit. He gives insights on how freelancing and mashing of industries are expected to be the future. He points out how moving away from competition can get you to the top.")

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
        setTimeout(() => setIsTyping(false), 5000) // Stop typing effect after 5 seconds
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
              title="What's your video title?"
              icon={<PenLine size={20} color="#FF0000" />}
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Type your video title here"
              isTyping={false}
            />

            <InputSection
              title="Generated Title"
              icon={<MessageSquare size={20} color="#FF0000" />}
              value={generatedTitle}
              onChange={() => {}}
              placeholder="Your generated title will appear here..."
              isTyping={isTyping}
            />

            <InputSection
              title="Generated Script"
              icon={<FileText size={20} color="#FF0000" />}
              value={generatedScript}
              onChange={() => {}}
              placeholder="Your generated script will appear here..."
              isTyping={isTyping}
            />

            <motion.button
              onClick={handleGenerate}
              disabled={isLoading}
              style={{
                ...styles.button,
                backgroundColor: isLoading ? '#666666' : '#FF0000',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                gap: '8px',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
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

          <div>
            <div style={{ position: 'sticky', top: '20px' }}>
              <YouTubePreview
                title={generatedTitle}
                description={description}
                channelName={channelName}
                onChannelNameChange={setChannelName}
                onTitleChange={setGeneratedTitle}
                onDescriptionChange={setDescription}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}