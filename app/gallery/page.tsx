'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@supabase/supabase-js'
import { MessageCircle, Repeat2, Heart, BarChart2, Share, ThumbsUp, ThumbsDown, Send } from 'lucide-react'

const platformIcons = {
  twitter: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
    </svg>
  ),
  youtube: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
    </svg>
  ),
  linkedin: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
      <rect x="2" y="9" width="4" height="12"></rect>
      <circle cx="4" cy="4" r="2"></circle>
    </svg>
  )
}

interface ProfilePictureProps {
  platform: string;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ platform }) => {
  return (
    <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center relative overflow-hidden">
      <div className={`absolute inset-0 flex items-center justify-center text-${platform === 'youtube' ? 'red' : 'blue'}-500`}>
        {platformIcons[platform as keyof typeof platformIcons]()}
      </div>
    </div>
  )
}

interface TwitterPreviewProps {
  content: string;
  imageUrl?: string;
  username: string;
  handle: string;
  verified: boolean;
  stats: {
    quotes: number;
    reposts: number;
    likes: number;
    views: number;
  };
  isFullView?: boolean;
}

const TwitterPreview: React.FC<TwitterPreviewProps> = ({ content, imageUrl, username, handle, verified, stats, isFullView = false }) => {
  const [interactions, setInteractions] = useState({
    quoted: false,
    reposted: false,
    liked: false,
    viewed: false,
    stats: stats
  })

  const handleInteraction = (type: 'quoted' | 'reposted' | 'liked' | 'viewed') => {
    if (!isFullView) return
    setInteractions(prev => ({
      ...prev,
      [type]: !prev[type],
      stats: {
        ...prev.stats,
        [type === 'viewed' ? 'views' : `${type}s`]: prev[type] ? prev.stats[type === 'viewed' ? 'views' : `${type}s`] - 1 : prev.stats[type === 'viewed' ? 'views' : `${type}s`] + 1
      }
    }))
  }

  return (
    <div className="bg-black rounded-xl overflow-hidden text-gray-300 font-sans border border-gray-800">
      <div className="p-4 flex items-center gap-3">
        <ProfilePicture platform="twitter" />
        <div>
          <div className="flex items-center gap-1">
            <span className="font-bold text-white">{username}</span>
            {verified && <span className="text-blue-400">✓</span>}
          </div>
          <span className="text-gray-500">{handle}</span>
        </div>
      </div>

      <div className="px-4 pb-2 text-sm whitespace-pre-wrap text-white">{content}</div>

      {imageUrl && (
        <div className="px-4 pb-4">
          <img src={imageUrl} alt="Post content" className="w-full rounded-xl border border-gray-800" />
        </div>
      )}

      {isFullView && (
        <>
          <div className="px-4 py-2 flex gap-6 text-gray-500 text-sm border-t border-gray-800">
            <span><strong>{interactions.stats.quotes}</strong> Quotes</span>
            <span><strong>{interactions.stats.reposts}</strong> Reposts</span>
            <span><strong>{interactions.stats.likes}</strong> Likes</span>
            <span><strong>{(interactions.stats.views / 1000).toFixed(1)}K</strong> Views</span>
          </div>

          <div className="flex justify-between px-2 py-2 border-t border-gray-800">
            {[
              { type: 'quoted', icon: MessageCircle, color: '#1d9bf0' },
              { type: 'reposted', icon: Repeat2, color: '#00ba7c' },
              { type: 'liked', icon: Heart, color: '#f91880' },
              { type: 'viewed', icon: BarChart2, color: '#1d9bf0' },
              { type: 'share', icon: Share, color: '#1d9bf0' }
            ].map(({ type, icon: Icon, color }) => (
              <button
                key={type}
                className={`p-2 rounded-full transition-colors duration-200 ${
                  interactions[type as keyof typeof interactions] ? `text-${color}` : 'text-gray-500'
                } hover:bg-gray-800`}
                onClick={() => type !== 'share' ? handleInteraction(type as 'quoted' | 'reposted' | 'liked' | 'viewed') : undefined}
              >
                <Icon size={20} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

interface YouTubePreviewProps {
  title: string;
  description: string;
  channelName: string;
  subscribers: string;
  views: number;
  likes: number;
  dislikes: number;
  imageUrl: string;
}

const YouTubePreview: React.FC<YouTubePreviewProps> = ({ title, description, channelName, subscribers, views, likes, dislikes, imageUrl }) => {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)
  const [likeCount, setLikeCount] = useState(likes)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubscribe = () => setIsSubscribed(!isSubscribed)
  const handleLike = () => {
    if (!isLiked) {
      setLikeCount(likeCount + 1)
      setIsLiked(true)
      setIsDisliked(false)
    } else {
      setLikeCount(likeCount - 1)
      setIsLiked(false)
    }
  }
  const handleDislike = () => {
    setIsDisliked(!isDisliked)
    if (isLiked) {
      setLikeCount(likeCount - 1)
      setIsLiked(false)
    }
  }

  return (
    <div className="bg-black rounded-xl overflow-hidden w-full font-sans">
      <div className="relative w-full pt-[56.25%] rounded-xl overflow-hidden">
        <img src={imageUrl} alt="Video thumbnail" className="absolute top-0 left-0 w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h2 className="text-lg font-bold mb-2 text-white cursor-pointer">{title}</h2>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <ProfilePicture platform="youtube" />
            <div className="ml-2">
              <div className="font-bold text-sm flex items-center gap-1 text-white cursor-pointer">
                {channelName}
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#AAAAAA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div className="text-xs text-gray-400">{subscribers} subscribers</div>
            </div>
          </div>
          <button
            className={`px-3 py-1 text-xs font-bold rounded-full ${isSubscribed ? 'bg-gray-500' : 'bg-red-600'} text-white`}
            onClick={handleSubscribe}
          >
            {isSubscribed ? 'Subscribed' : 'Subscribe'}
          </button>
        </div>
        <div className="flex gap-2 mt-2">
          <button
            className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full ${isLiked ? 'bg-gray-300' : 'bg-gray-800'} text-white`}
            onClick={handleLike}
          >
            <ThumbsUp size={14} />
            {likeCount}
          </button>
          <button
            className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full ${isDisliked ? 'bg-gray-300' : 'bg-gray-800'} text-white`}
            onClick={handleDislike}
          >
            <ThumbsDown size={14} />
          </button>
          <button className="flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-gray-800 text-white">
            <Share size={14} />
            Share
          </button>
        </div>
        <div className="mt-2 text-sm text-gray-400">
          <p>{views.toLocaleString()} views</p>
          <p>
            {isExpanded ? description : `${description.slice(0, 100)}...`}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-400 hover:text-blue-300 ml-1 focus:outline-none"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

interface LinkedInPreviewProps {
  content: string;
  imageUrl: string;
  username: string;
  userTitle: string;
  likes: number;
  comments: number;
  reposts: number;
}

const LinkedInPreview: React.FC<LinkedInPreviewProps> = ({ content, imageUrl, username, userTitle, likes, comments, reposts }) => {
  const [isLiked, setIsLiked] = useState<boolean>(false)
  const [isReposted, setIsReposted] = useState<boolean>(false)
  const [likeCount, setLikeCount] = useState<number>(likes)
  const [repostCount, setRepostCount] = useState<number>(reposts)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
  }

  const handleRepost = () => {
    setIsReposted(!isReposted)
    setRepostCount(prev => isReposted ? prev - 1 : prev + 1)
  }

  const truncatedContent = content.length > 150 ? content.slice(0, 150) + '...' : content

  return (
    <div className="bg-black rounded-lg overflow-hidden w-full font-sans shadow-md">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <ProfilePicture platform="linkedin" />
            <div>
              <div className="font-semibold text-white text-sm">{username}</div>
              <div className="text-gray-400 text-xs">{userTitle}</div>
              <div className="text-gray-400 text-xs flex items-center gap-1">
                <span>1d</span>
                <span>•</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
              </div>
            </div>
          </div>
          <button className="text-gray-400 p-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="19" cy="12" r="1"></circle>
              <circle cx="5" cy="12" r="1"></circle>
            </svg>
          </button>
        </div>
        <div className="mt-2 text-white text-sm whitespace-pre-wrap">
          {isExpanded ? content : truncatedContent}
          {content.length > 150 && (
            <button
              className="text-blue-400 hover:text-blue-300 ml-1 focus:outline-none"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'See less' : 'See more'}
            </button>
          )}
        </div>
      </div>
      {imageUrl && (
        <div className="w-full aspect-[4/3] bg-gray-800 overflow-hidden">
          <img src={imageUrl} alt="LinkedIn post" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between text-gray-400 text-xs">
        <span>{likeCount} likes</span>
        <div>
          <span>{comments} comments</span>
          <span> • </span>
          <span>{repostCount} reposts</span>
        </div>
      </div>
      <div className="flex justify-between p-1 border-b border-gray-700">
        <button 
          className={`flex items-center gap-1 p-3 text-xs font-semibold rounded ${isLiked ? 'text-blue-500' : 'text-gray-400'}`}
          onClick={handleLike}
        >
          <ThumbsUp size={16} />
          Like
        </button>
        <button className="flex items-center gap-1 p-3 text-xs font-semibold text-gray-400 rounded">
          <MessageCircle size={16} />
          Comment
        </button>
        <button 
          className={`flex items-center gap-1 p-3 text-xs font-semibold rounded ${isReposted ? 'text-blue-500' : 'text-gray-400'}`}
          onClick={handleRepost}
        >
          <Repeat2 size={16} />
          Repost
        </button>
        <button className="flex items-center gap-1 p-3 text-xs font-semibold text-gray-400 rounded">
          <Send size={16} />
          Send
        </button>
      </div>
    </div>
  )
}

interface Post {
  id: string;
  platform: string;
  description?: string;
  caption?: string;
  url: string;
  user_name?: string;
  title?: string;
  content?: string;
  imageUrl?: string;
  username?: string;
  handle?: string;
  verified?: boolean;
  stats?: {
    quotes: number;
    reposts: number;
    likes: number;
    views: number;
  };
  channelName?: string;
  subscribers?: string;
  views?: number;
  likes?: number;
  dislikes?: number;
  userTitle?: string;
  comments?: number;
  reposts?: number;
}

interface ErrorState {
  message: string;
  details?: string;
}

export default function Component() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ErrorState | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [animatedPosts, setAnimatedPosts] = useState<string[]>([])

  // Transform Supabase data to match our UI format
  const transformPost = (post: Post): Post => {
    const baseStats = {
      quotes: Math.floor(Math.random() * 200),
      reposts: Math.floor(Math.random() * 2000),
      likes: Math.floor(Math.random() * 5000),
      views: Math.floor(Math.random() * 200000),
      comments: Math.floor(Math.random() * 500)
    }

    const basePost: Post = {
      id: post.id,
      platform: post.platform.toLowerCase(),
      content: post.description || post.caption,
      imageUrl: post.url,
      username: post.user_name || 'Anonymous',
      url: post.url,
    }

    switch (post.platform.toLowerCase()) {
      case 'youtube':
        return {
          ...basePost,
          title: post.caption,
          description: post.description,
          channelName: post.user_name || 'YouTube Channel',
          subscribers: `${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 9)}M`,
          views: baseStats.views,
          likes: baseStats.likes,
          dislikes: Math.floor(baseStats.likes * 0.1)
        }
      case 'twitter':
        return {
          ...basePost,
          handle: `@${post.user_name || 'user'}`,
          verified: Math.random() > 0.5,
          stats: {
            quotes: baseStats.quotes,
            reposts: baseStats.reposts,
            likes: baseStats.likes,
            views: baseStats.views
          }
        }
      case 'linkedin':
        return {
          ...basePost,
          userTitle: `${['Senior', 'Lead', 'Principal', 'Director of'][Math.floor(Math.random() * 4)]} ${['Developer', 'Engineer', 'Designer', 'Product Manager'][Math.floor(Math.random() * 4)]}`,
          likes: baseStats.likes,
          comments: baseStats.comments,
          reposts: baseStats.reposts
        }
      default:
        return basePost
    }
  }

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        setError(null)

        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_KEY!
        )

        const { data, error: supabaseError } = await supabase
          .from('content_gallery')
          .select('id, platform, caption, description, url, user_name')

        if (supabaseError) {
          console.error('Supabase Error:', supabaseError)
          setError({
            message: 'Failed to fetch posts',
            details: supabaseError.message
          })
          return
        }

        if (!data) {
          setError({
            message: 'No data received from the database'
          })
          return
        }

        // Filter valid posts and transform them
        const transformedPosts = data
          .filter(post => {
            if (post.platform === 'YouTube') {
              return post.caption && post.description
            }
            return post.caption
          })
          .map(transformPost)
        setPosts(transformedPosts)
        setAnimatedPosts(transformedPosts.map(post => post.id))
      } catch (err) {
        console.error('Unexpected error:', err)
        setError({
          message: 'An unexpected error occurred',
          details: err instanceof Error ? err.message : 'Unknown error'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const filteredPosts = posts.filter(post => 
    ((post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
     (post.content?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)) &&
    (selectedPlatforms.length === 0 || selectedPlatforms.includes(post.platform))
  )

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]
    )
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'youtube':
        return 'bg-red-600'
      case 'twitter':
        return 'bg-blue-400'
      case 'linkedin':
        return 'bg-blue-700'
      default:
        return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin text-blue-500 text-4xl">↻</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-red-900 text-white p-4 rounded-lg max-w-md">
          <h3 className="font-bold mb-2">Error Loading Posts</h3>
          <p>{error.message}</p>
          {error.details && <p className="mt-2 text-sm opacity-80">{error.details}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-gray-300">
      <div className="container mx-auto p-8">
        <motion.h1 
          className="text-5xl font-bold mb-8 text-white text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Social Media Gallery
        </motion.h1>
        
        <div className="mb-8 max-w-md mx-auto">
          <input
            type="search"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full mb-6 p-2 bg-gray-800 text-gray-300 border border-gray-700 rounded-md focus:outline-none focus:border-gray-500"
          />
          <div className="flex flex-wrap justify-center gap-2">
            {Object.keys(platformIcons).map(platform => {
              const Icon = platformIcons[platform as keyof typeof platformIcons]
              const isSelected = selectedPlatforms.includes(platform)
              return (
                <button
                  key={platform}
                  onClick={() => togglePlatform(platform)}
                  className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 transition-colors duration-300 ${
                    isSelected 
                      ? `${getPlatformColor(platform)} text-white` 
                      : 'text-gray-400 border border-gray-400 hover:bg-gray-800'
                  }`}
                >
                  <Icon />
                </button>
              )
            })}
          </div>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          <AnimatePresence>
            {filteredPosts.map(post => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="bg-black border border-gray-800 hover:border-gray-700 transition-colors duration-300 overflow-hidden cursor-pointer rounded-xl shadow-lg"
                onClick={() => setSelectedPost(post)}
              >
                {post.platform === 'youtube' && (
                  <YouTubePreview {...post as YouTubePreviewProps} />
                )}
                {post.platform === 'linkedin' && (
                  <LinkedInPreview {...post as LinkedInPreviewProps} />
                )}
                {post.platform === 'twitter' && (
                  <TwitterPreview {...post as TwitterPreviewProps} />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-black rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  {platformIcons[selectedPost.platform as keyof typeof platformIcons]()}
                  <span className="ml-2">{selectedPost.title || selectedPost.username}</span>
                </h2>
                <button onClick={() => setSelectedPost(null)} className="text-gray-500 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4">
              {selectedPost.platform === 'youtube' && (
                <YouTubePreview {...selectedPost as YouTubePreviewProps} />
              )}
              {selectedPost.platform === 'linkedin' && (
                <LinkedInPreview {...selectedPost as LinkedInPreviewProps} />
              )}
              {selectedPost.platform === 'twitter' && (
                <TwitterPreview {...selectedPost as TwitterPreviewProps} isFullView={true} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}