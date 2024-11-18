'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Youtube, PenLine, MessageSquare, FileText, Terminal, Check, ThumbsUp, ThumbsDown, Share2, Scissors, Bookmark, MoreHorizontal, Save, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
)

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
    paddingTop: '56.25%',
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
  generatedImage: {
    width: '100%',
    height: 'auto',
    borderRadius: '12px',
    marginTop: '20px',
  },
  saveDiscardContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  saveButton: {
    backgroundColor: '#065fd4',
    color: 'white',
    padding: '10px 16px',
    border: 'none',
    borderRadius: '18px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  discardButton: {
    backgroundColor: 'transparent',
    color: '#909090',
    padding: '10px 16px',
    border: '1px solid #909090',
    borderRadius: '18px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
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
  thumbnailUrl: string | null;
  isTypingTitle: boolean;
  isTypingDescription: boolean;
  isDescriptionVisible: boolean;
  setIsTypingTitle: (isTyping: boolean) => void;
  setIsTypingDescription: (isTyping: boolean) => void;
}> = ({ 
  title, 
  description, 
  channelName, 
  onChannelNameChange, 
  onTitleChange, 
  onDescriptionChange, 
  thumbnailUrl, 
  isTypingTitle, 
  isTypingDescription, 
  isDescriptionVisible,
  setIsTypingTitle,
  setIsTypingDescription 
}) => {
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
  const [displayedTitle, setDisplayedTitle] = useState('')
  const [displayedDescription, setDisplayedDescription] = useState('')

  useEffect(() => {
    setTempTitle(title)
  }, [title])

  useEffect(() => {
    setTempDescription(description)
  }, [description])

  useEffect(() => {
    if (isTypingTitle) {
      let i = 0
      const interval = setInterval(() => {
        setDisplayedTitle(title.slice(0, i))
        i++
        if (i > title.length) {
          clearInterval(interval)
          setIsTypingTitle(false)
        }
      }, 50)
      return () => clearInterval(interval)
    } else {
      setDisplayedTitle(title)
    }
  }, [title, isTypingTitle, setIsTypingTitle])

  useEffect(() => {
    if (isTypingDescription) {
      let i = 0
      const interval = setInterval(() => {
        setDisplayedDescription(description.slice(0, i))
        i++
        if (i > description.length) {
          clearInterval(interval)
          setIsTypingDescription(false)
        }
      }, 20)
      return () => clearInterval(interval)
    } else {
      setDisplayedDescription(description)
    }
  }, [description, isTypingDescription, setIsTypingDescription])

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
          src={thumbnailUrl || "https://i.imgur.com/4Z3mGfU.jpeg"}
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
        <h1 style={styles.videoTitle} onClick={handleTitleEdit}>{displayedTitle}</h1>
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
        {!isEditingDescription && (
          <p 
            onClick={handleDescriptionEdit} 
            style={{
              whiteSpace: 'pre-wrap',
              opacity: isDescriptionVisible ? 1 : 0,
              transition: 'opacity 0.5s ease-in-out'
            }}
          >
            {displayedDescription}
          </p>
        )}
        {isEditingDescription && (
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
  const [userPrompt, setUserPrompt] = useState("")
  const [generatedTitle, setGeneratedTitle] = useState("")
  const [generatedDescription, setGeneratedDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [terminalLogs, setTerminalLogs] = useState<{ message: string; timestamp: string; type: 'info' | 'process' | 'success' | 'error' }[]>([])
  const terminalRef = useRef<HTMLDivElement | null>(null)
  const [channelName, setChannelName] = useState("TEDx Talks")
  const [isTypingTitle, setIsTypingTitle] = useState(false)
  const [isTypingDescription, setIsTypingDescription] = useState(false)
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

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
      setGeneratedDescription("")
      setThumbnailUrl(null)
      setIsTypingTitle(false)
      setIsTypingDescription(false)
      setIsDescriptionVisible(false)

      try {
        addLog('Initializing generation process...', 'process')
        
        // Call the YouTube content generation API
        const youtubeResponse = await fetch('http://3.129.88.226:5000/youtube', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ input_text: userPrompt }),
        })

        if (!youtubeResponse.ok) {
          throw new Error(`HTTP error! status: ${youtubeResponse.status}`)
        }

        const youtubeResult = await youtubeResponse.json()

        if (youtubeResult.error) {
          throw new Error(youtubeResult.error)
        }

        addLog('YouTube content generated successfully', 'success')

        // Set the generated title and start its animation
        setGeneratedTitle(youtubeResult.title || "")
        setIsTypingTitle(true)

        // Set the generated description and start its animation after a short delay
        if (youtubeResult.description) {
          addLog('Description generated successfully', 'success')
          setTimeout(() => {
            setGeneratedDescription(youtubeResult.description || "")
            setIsTypingDescription(true)
            setIsDescriptionVisible(true)
          }, 1000) // Start description animation 1 second after title
        } else {
          addLog('No description was generated', 'info')
        }

        // Generate image
        if (youtubeResult.thumbnail) {
          addLog('Generating image...', 'process')
          const imageResponse = await fetch('http://3.129.88.226:5000/generate_image_yt', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: youtubeResult.thumbnail }),
          })

          if (!imageResponse.ok) {
            throw new Error(`HTTP error! status: ${imageResponse.status}`)
          }

          const imageResult = await imageResponse.json()
          setThumbnailUrl(imageResult.image_url)
          addLog('Image generated successfully', 'success')
        }

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

  const handleSave = () => {
    setShowDialog(true)
  }

  const handleConfirmSave = async () => {
    setIsSaving(true)
    addLog('Saving content to Supabase...', 'process')

    try {
      const { data, error } = await supabase
        .from('content_gallery')
        .insert([
          {
            platform: 'YouTube',
            caption: generatedTitle,
            description: generatedDescription,
            url: thumbnailUrl,
            user_name: channelName,
          },
        ])

      if (error) {
        throw error
      }

      addLog('Content saved successfully', 'success')
      setShowDialog(false)
    } catch (error: any) {
      addLog(`Error saving content: ${error.message}`, 'error')
      setError(`Error saving content: ${error.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelSave = () => {
    setShowDialog(false)
  }

  const handleDiscard = () => {
    setGeneratedTitle('')
    setGeneratedDescription('')
    setThumbnailUrl(null)
    setIsDescriptionVisible(false)
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
              isTyping={isTypingTitle}
            />

            <InputSection
              title="Generated Description"
              icon={<FileText size={20} color="#FF0000" />}
              value={generatedDescription}
              onChange={() => {}}
              placeholder="Your generated description will appear here..."
              isTyping={isTypingDescription}
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
                description={generatedDescription}
                channelName={channelName}
                onChannelNameChange={setChannelName}
                onTitleChange={setGeneratedTitle}
                onDescriptionChange={setGeneratedDescription}
                thumbnailUrl={thumbnailUrl}
                isTypingTitle={isTypingTitle}
                isTypingDescription={isTypingDescription}
                isDescriptionVisible={isDescriptionVisible}
                setIsTypingTitle={setIsTypingTitle}
                setIsTypingDescription={setIsTypingDescription}
              />
              <div style={styles.saveDiscardContainer}>
                <motion.button
                  onClick={handleSave}
                  style={styles.saveButton}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Save size={16} />
                  Save
                </motion.button>
                <motion.button
                  onClick={handleDiscard}
                  style={styles.discardButton}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X size={16} />
                  Discard
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: '#262626',
            padding: '24px',
            borderRadius: '8px',
            maxWidth: '400px',
            width: '100%',
          }}>
            <h2 style={{ color: '#e5e5e5', marginBottom: '16px' }}>Save to Gallery</h2>
            <p style={{ color: '#a0a0a0', marginBottom: '24px' }}>Are you sure you want to save this post to the gallery?</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <motion.button
                onClick={handleCancelSave}
                style={{
                  ...styles.discardButton,
                  padding: '8px 16px',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isSaving}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleConfirmSave}
                style={{
                  ...styles.saveButton,
                  padding: '8px 16px',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Confirm'}
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}