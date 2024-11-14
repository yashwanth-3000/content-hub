'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

// Types for API Response
interface SearchResult {
  conversation_id: string;
  distance: number;
  id: number;
  similarity_score: number;
  text: string;
}

interface ApiResponse {
  search_results: SearchResult[];
  output: string;
}

// Icons
const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
)

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
)

const YoutubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
)

// API Functions
const fetchTweets = async (prompt: string): Promise<SearchResult[]> => {
  try {
    const response = await fetch('http://localhost:5001/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query_text: prompt }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data: ApiResponse = await response.json();
    return data.search_results;
  } catch (error) {
    console.error('Error fetching tweets:', error);
    return [];
  }
};

export default function TweetRepurposer() {
  // State
  const [currentTweetIndex, setCurrentTweetIndex] = useState(0)
  const [selectedTweets, setSelectedTweets] = useState<number[]>([])
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
  const [isSelectionComplete, setIsSelectionComplete] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [tweets, setTweets] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const searchParams = useSearchParams()
  const prompt = searchParams.get('prompt')

  // Effects
  useEffect(() => {
    const loadTweets = async () => {
      if (prompt) {
        setIsLoading(true);
        const results = await fetchTweets(prompt);
        setTweets(results);
        setIsLoading(false);
      }
    };

    loadTweets();
  }, [prompt]);

  useEffect(() => {
    if (tweets.length > 0) {
      setProgress((currentTweetIndex / tweets.length) * 100)
    }
  }, [currentTweetIndex, tweets.length])

  // Handlers
  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      setSelectedTweets(prev => [...prev, currentTweetIndex])
    }
    setCurrentTweetIndex(prev => prev + 1)
    if (currentTweetIndex === tweets.length - 1) {
      setIsSelectionComplete(true)
    }
  }

  const selectPlatform = (platform: string) => {
    setSelectedPlatform(platform)
  }

  const handleGenerate = () => {
    setIsGenerating(true)
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false)
      alert(`Content generated for ${selectedPlatform}!`)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center justify-center p-4 font-sans">
      {/* Header Section */}
      <header className="max-w-2xl w-full text-center mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
        >
          Elevate Your Social Media Game
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-gray-300 mb-6"
        >
          {prompt ? (
            <>
              Based on your prompt: <span className="font-semibold text-blue-400">"{prompt}"</span>, 
              we've curated a selection of tweets. Now, let's transform them into captivating content 
              for various platforms. Here's how:
            </>
          ) : (
            "Transform curated tweets into captivating content for various platforms. Here's how:"
          )}
        </motion.p>
        <motion.ol className="text-left space-y-4 bg-gray-800 bg-opacity-50 p-6 rounded-lg shadow-lg">
          {[
            "Swipe through our curated tweets",
            "Select at least 5 that align with your prompt",
            "Choose your target platform",
            `Generate tailored content based on "${prompt || 'your theme'}"`
          ].map((step, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="flex items-center space-x-3"
            >
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-500 rounded-full text-white font-bold">
                {index + 1}
              </span>
              <span>{step}</span>
            </motion.li>
          ))}
        </motion.ol>
      </header>

      {/* Progress Bar */}
      <div className="w-full max-w-md mb-8">
        <div className="bg-gray-700 h-2 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
          />
        </div>
      </div>
      
      {/* Main Content */}
      <main className="w-full max-w-md">
        {!isSelectionComplete ? (
          !isLoading && tweets.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTweetIndex}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="bg-gray-800 p-6 rounded-lg shadow-xl w-full mb-8 border border-gray-700"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-600 rounded-full mr-4" />
                  <div>
                    <p className="font-bold">Tweet #{currentTweetIndex + 1}</p>
                    <p className="text-gray-400">
                      Similarity Score: {tweets[currentTweetIndex].similarity_score.toFixed(3)}
                    </p>
                  </div>
                </div>
                <p className="text-lg mb-6">{tweets[currentTweetIndex].text}</p>
                <div className="flex justify-between text-gray-400 mb-6">
                  <span>ID: {tweets[currentTweetIndex].conversation_id}</span>
                  <span>Score: {(1 - tweets[currentTweetIndex].distance).toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSwipe('left')}
                    className="px-6 py-2 bg-red-500 text-white rounded-full font-semibold transition-colors hover:bg-red-600"
                  >
                    Reject
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSwipe('right')}
                    className="px-6 py-2 bg-green-500 text-white rounded-full font-semibold transition-colors hover:bg-green-600"
                  >
                    Accept
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="text-center p-6 bg-gray-800 rounded-lg">
              {isLoading ? (
                <p className="text-xl">Loading tweets...</p>
              ) : (
                <p className="text-xl">No tweets found for your prompt</p>
              )}
            </div>
          )
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 p-6 rounded-lg shadow-xl w-full border border-gray-700"
          >
            <h2 className="text-2xl font-bold mb-4 text-center">
              Choose Your Platform
            </h2>
            <div className="flex justify-center space-x-4 mb-6">
              {['instagram', 'linkedin', 'youtube'].map((platform) => (
                <motion.button
                  key={platform}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => selectPlatform(platform)}
                  className={`p-3 rounded-lg transition-colors ${
                    selectedPlatform === platform
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                  aria-label={`Select ${platform}`}
                >
                  {platform === 'instagram' && <InstagramIcon />}
                  {platform === 'linkedin' && <LinkedinIcon />}
                  {platform === 'youtube' && <YoutubeIcon />}
                </motion.button>
              ))}
            </div>
            <div className="space-y-3 mb-6">
              {selectedTweets.map(index => (
                <div key={index} className="bg-gray-700 p-3 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Tweet #{index + 1}</p>
                  <p>{tweets[index].text}</p>
                </div>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGenerate}
              disabled={!selectedPlatform || isGenerating}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                !selectedPlatform || isGenerating
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isGenerating ? 'Generating...' : `Generate ${prompt ? 'Prompt-Inspired' : ''} Content`}
            </motion.button>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-8 text-center text-gray-400">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-2"
        >
          All tweets were ethically sourced and curated to match your prompt.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Powered by <span className="font-semibold text-purple-400">masa</span>
        </motion.p>
      </footer>
    </div>
  )
}