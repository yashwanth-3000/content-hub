'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Linkedin, PenLine, MessageSquare, FileText, Terminal, Send, ThumbsUp, MessageCircle, Share2, Bookmark, MoreHorizontal, Save, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
)

type TerminalLog = {
  message: string;
  timestamp: string;
  type: 'info' | 'process' | 'success' | 'error' | 'warning';
};

export default function Component() {
  const [userPrompt, setUserPrompt] = useState("")
  const [generatedContent, setGeneratedContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>([])
  const [generatedImage, setGeneratedImage] = useState("https://i.imgur.com/4Z3mGfU.jpeg")
  const terminalRef = useRef<HTMLDivElement | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalLogs])

  const addLog = (message: string, type: 'info' | 'process' | 'success' | 'error' | 'warning' = 'info') => {
    const timestamp = new Date().toLocaleTimeString()
    const logEntry = { message, timestamp, type }
    setTerminalLogs(prev => [...prev, logEntry])
    console.log(`[${timestamp}] ${type.toUpperCase()}: ${message}`)
  }

  const handleGenerate = async () => {
    if (userPrompt.trim()) {
      setIsLoading(true)
      setError(null)
      setTerminalLogs([])
      setGeneratedContent("")
      setGeneratedImage("")

      try {
        addLog('Initializing generation process...', 'process')
        addLog(`Sending prompt: "${userPrompt}"`, 'info')
        
        // Call the LinkedIn content generation API
        const linkedinResponse = await fetch('http://3.129.88.226:5000/linkedin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ input_text: userPrompt }),
        })

        if (!linkedinResponse.ok) {
          throw new Error(`HTTP error! status: ${linkedinResponse.status}`)
        }

        addLog('Received response from API', 'info')
        const linkedinResult = await linkedinResponse.json()
        addLog('Parsed API response', 'info')

        if (linkedinResult.error) {
          throw new Error(linkedinResult.error)
        }

        addLog('LinkedIn content generated successfully', 'success')

        if (linkedinResult.linkedin_text) {
          setGeneratedContent(linkedinResult.linkedin_text)
          addLog('Generated content:', 'info')
          addLog(linkedinResult.linkedin_text, 'info')
        } else {
          addLog('No content was generated', 'warning')
        }

        // Generate image
        if (linkedinResult.image_description) {
          addLog('Generating image...', 'process')
          addLog(`Image prompt: "${linkedinResult.image_description}"`, 'info')
          const imageResponse = await fetch('http://3.129.88.226:5000/generate_image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: linkedinResult.image_description }),
          })

          if (!imageResponse.ok) {
            throw new Error(`HTTP error! status: ${imageResponse.status}`)
          }

          const imageResult = await imageResponse.json()
          setGeneratedImage(imageResult.image_url)
          addLog('Image generated successfully', 'success')
          addLog(`Image URL: ${imageResult.image_url}`, 'info')
        } else {
          addLog('No image description provided, skipping image generation', 'info')
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
        addLog('Generation process completed', 'info')
      }
    }
  }

  const handleContentChange = (newContent: string) => {
    setGeneratedContent(newContent)
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
            platform: 'LinkedIn',
            caption: generatedContent,
            url: generatedImage,
            user_name: 'LinkedIn User', // You might want to make this dynamic
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
    setGeneratedContent('')
    setGeneratedImage('')
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
      backgroundColor: '#0a66c2',
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
    textarea: {
      width: '100%',
      height: '100px',
      backgroundColor: '#262626',
      border: '1px solid #404040',
      borderRadius: '8px',
      color: '#e5e5e5',
      padding: '12px',
      fontSize: '14px',
      resize: 'none' as const,
    },
    saveButton: {
      backgroundColor: '#0a66c2',
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

  const InputSection = ({ icon, title, value, onChange, placeholder, disabled }: {
    icon: React.ReactNode;
    title: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    disabled: boolean;
  }) => {
    const [localValue, setLocalValue] = useState(value);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onChange(localValue);
      }
    };

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
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => onChange(localValue)}
          placeholder={placeholder}
          style={styles.textarea}
          disabled={disabled}
        />
      </div>
    )
  }

  const LinkedInPreview = ({ content, imageUrl, isLoading, onContentChange, onSave, onDiscard }: {
    content: string;
    imageUrl: string;
    isLoading: boolean;
    onContentChange: (newContent: string) => void;
    onSave: () => void;
    onDiscard: () => void;
  }) => {
    const [interactions, setInteractions] = useState({
      liked: false,
      commented: false,
      reposted: false,
      shared: false,
      stats: {
        likes: 243,
        comments: 45,
        reposts: 12
      }
    });
    const [username, setUsername] = useState("LinkedIn User");
    const [description, setDescription] = useState("Professional | Innovator | Thought Leader");
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [isEditingContent, setIsEditingContent] = useState(false);
    const [editingContent, setEditingContent] = useState(content);
    const [displayedContent, setDisplayedContent] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
      if (content && !isTyping) {
        setIsTyping(true);
        let i = 0;
        const typingInterval = setInterval(() => {
          if (i < content.length) {
            setDisplayedContent(content.slice(0, i + 1));
            i++;
          } else {
            clearInterval(typingInterval);
            setIsTyping(false);
          }
        }, 20); // Adjust the typing speed here
        return () => clearInterval(typingInterval);
      }
    }, [content]);

    const handleInteraction = (type: 'liked' | 'commented' | 'reposted' | 'shared') => {
      setInteractions(prev => ({
        ...prev,
        [type]: !prev[type],
        stats: {
          ...prev.stats,
          [type === 'reposted' ? 'reposts' : `${type.replace('ed', '')}s`]: prev[type] ?
            prev.stats[type === 'reposted' ? 'reposts' : `${type.replace('ed', '')}s` as keyof typeof prev.stats] - 1 :
            prev.stats[type === 'reposted' ? 'reposts' : `${type.replace('ed', '')}s` as keyof typeof prev.stats] + 1
        }
      }))
    }

    const handleUsernameChange = (newUsername: string) => {
      setUsername(newUsername);
      setIsEditingUsername(false);
    };

    const handleDescriptionChange = (newDescription: string) => {
      setDescription(newDescription);
      setIsEditingDescription(false);
    };

    const handleSaveContent = () => {
      onContentChange(editingContent);
      setIsEditingContent(false);
    };

    const styles = {
      container: {
        backgroundColor: '#000000',
        borderRadius: '12px',
        overflow: 'hidden',
        color: '#e5e5e5',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        opacity: isLoading ? 0.7 : 1,
        transition: 'opacity 0.2s',
        border: '1px solid #333333'
      },
      header: {
        padding: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      },
      avatar: {
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        overflow: 'hidden',
        backgroundColor: '#0a66c2',
        border: '1px solid #0a66c2'
      },
      content: {
        padding: '0 16px 16px',
        fontSize: '14px',
        lineHeight: '1.5',
        whiteSpace: 'pre-wrap' as const
      },
      stats: {
        padding: '8px 12px',
        display: 'flex',
        gap: '24px',
        color: '#71767b',
        fontSize: '12px',
        borderTop: '1px solid #333333'
      },
      actions: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '4px 12px',
        borderTop: '1px solid #333333'
      },
      actionButton: (type: 'liked' | 'commented' | 'reposted' | 'shared') => ({
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: interactions[type] ? '#0a66c2' : '#71767b',
        padding: '8px',
        borderRadius: '4px',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        border: 'none',
        transition: 'all 0.2s'
      }),
      image: {
        padding: '0 16px 16px',
      },
      imageStyle: {
        width: '100%',
        borderRadius: '8px',
        border: '1px solid #333333'
      }
    }

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.avatar}>
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#0a66c2',
              borderRadius: '50%',
            }}>
              <Linkedin size={32} color="#ffffff" />
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {isEditingUsername ? (
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onBlur={() => handleUsernameChange(username)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid #0a66c2',
                    color: '#e5e5e5',
                    fontSize: '14px',
                    fontWeight: '700',
                    padding: '2px',
                  }}
                  autoFocus
                />
              ) : (
                <span style={{ fontWeight: '700', cursor: 'pointer' }} onClick={() => setIsEditingUsername(true)}>
                  {username}
                </span>
              )}
            </div>
            {isEditingDescription ? (
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => handleDescriptionChange(description)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid #0a66c2',
                  color: '#71767b',
                  fontSize: '12px',
                  padding: '2px',
                  width: '100%',
                }}
                autoFocus
              />
            ) : (
              <span style={{ color: '#71767b', fontSize: '12px', cursor: 'pointer' }} onClick={() => setIsEditingDescription(true)}>
                {description}
              </span>
            )}
          </div>
        </div>

        <div style={styles.content} onClick={() => setIsEditingContent(true)}>
          <AnimatePresence>
            {isEditingContent ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <textarea
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    color: '#e5e5e5',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    resize: 'none',
                  }}
                  autoFocus
                />
                <button
                  onClick={handleSaveContent}
                  style={{
                    backgroundColor: '#0a66c2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginTop: '8px',
                  }}
                >
                  Save
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {isLoading ? 'Generating content...' : displayedContent}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {imageUrl && (
          <div style={styles.image}>
            <img src={imageUrl} alt="Generated content" style={styles.imageStyle} />
          </div>
        )}

        <div style={styles.stats}>
          <span><strong>{interactions.stats.likes}</strong> Likes</span>
          <span><strong>{interactions.stats.comments}</strong> Comments</span>
          <span><strong>{interactions.stats.reposts}</strong> Reposts</span>
        </div>

        <div style={styles.actions}>
          {[
            { type: 'liked' as const, icon: ThumbsUp, label: 'Like' },
            { type: 'commented' as const, icon: MessageCircle, label: 'Comment' },
            { type: 'reposted' as const, icon: Share2, label: 'Repost' },
            { type: 'shared' as const, icon: Share2, label: 'Share' }
          ].map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              style={styles.actionButton(type)}
              onClick={() => handleInteraction(type)}
            >
              <Icon size={20} />
              {label}
            </button>
          ))}
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '16px',
          padding: '0 16px 16px'
        }}>
          <button
            onClick={onSave}
            style={{
              backgroundColor: '#0a66c2',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Save
          </button>
          <button
            onClick={onDiscard}
            style={{
              backgroundColor: '#000000',
              color: '#ff4444',
              border: '1px solid #ff4444',
              borderRadius: '16px',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Discard
          </button>
        </div>
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
      message: (type: 'info' | 'process' | 'success' | 'error' | 'warning') => ({
        color: {
          info: '#e5e5e5',
          process: '#60a5fa',
          success: '#34d399',
          error: '#ef4444',
          warning: '#fbbf24'
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
          <Linkedin size={32} color="#0a66c2" />
          LinkedIn Post Generator
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
                onChange={setUserPrompt}
                placeholder="Enter your LinkedIn post content..."
                disabled={isLoading}
              />
              
              <InputSection
                icon={<MessageSquare size={20} />}
                title="Generated Content (click to edit)"
                value={generatedContent}
                onChange={handleContentChange}
                placeholder="Your generated LinkedIn post will appear here..."
                disabled={false}
              />

              <motion.button 
                onClick={handleGenerate} 
                style={{
                  ...styles.button,
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                }}
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoading ? 'Generating...' : 'Generate Post'}
                <Send size={18} style={{ marginLeft: '8px' }} />
              </motion.button>
            </div>
            <TerminalWindow />
          </div>

          <div style={styles.section}>
            <LinkedInPreview 
              content={generatedContent}
              imageUrl={generatedImage}
              isLoading={isLoading}
              onContentChange={handleContentChange}
              onSave={handleSave}
              onDiscard={handleDiscard}
            />
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