"use client"
import { useState } from "react"
import { Loader2, Sparkles } from 'lucide-react'

export default function Component() {
  const [loading, setLoading] = useState(true)
  const testimonial = {
    author: "Alex from Texas",
    quote: "One of the AI apps more funny. Love it!"
  }

  const handleImageLoad = () => {
    setLoading(false)
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-black text-white">
      {/* Enhanced Header with Animation */}
      <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in">
        <div className="inline-flex items-center gap-2 mb-2">
          <Loader2 className="w-6 h-6 text-[#FF7759] animate-spin" />
          <span className="text-[#FF7759] font-medium">AI-Powered Gallery</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 relative">
          View our social media gallery
          <span className="absolute -top-1 -right-4">
            <Sparkles className="w-5 h-5 text-[#FF7759] animate-pulse" />
          </span>
        </h1>
        <p className="text-gray-300 mb-8 max-w-xl mx-auto">
          Discover our collection of AI-enhanced pet moments that capture the unique personality of each furry friend.
        </p>
        <button className="group relative px-8 py-3 bg-[#FF7759] text-white font-semibold rounded-full hover:bg-[#FF5A3D] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
          <span className="relative z-10 flex items-center gap-2">
            Open Gallery
            <svg 
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </button>
      </div>

      {/* Masonry Grid with Loading States */}
      <div className="relative">
        {/* Testimonial Overlay with Animation */}
        <div className="absolute -top-6 left-4 z-10 max-w-xs animate-slide-in-right">
          <div className="p-4 bg-white shadow-lg rounded-2xl hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                <div 
                  className="w-full h-full bg-gray-300"
                  style={{
                    backgroundImage: 'url("/placeholder.svg?height=48&width=48")',
                    backgroundSize: 'cover'
                  }}
                />
              </div>
              <div>
                <p className="text-[#FF7759] font-medium text-sm mb-1">{testimonial.quote}</p>
                <p className="text-sm text-gray-600">{testimonial.author}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Image Grid with Loading States */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, rowIndex) => (
            <div key={rowIndex} className="space-y-4">
              {[...Array(2)].map((_, imgIndex) => (
                <div 
                  key={`${rowIndex}-${imgIndex}`} 
                  className="overflow-hidden relative transform hover:scale-102 transition-transform duration-300 rounded-lg shadow-md"
                >
                  {loading && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                  )}
                  <div
                    className={`w-full aspect-[3/4] bg-gray-200 transition-opacity duration-300 ${
                      loading ? 'opacity-0' : 'opacity-100'
                    }`}
                    style={{
                      backgroundImage: `url('/placeholder.svg?height=${imgIndex === 0 ? '400' : '300'}&width=300')`,
                      backgroundSize: 'cover'
                    }}
                    onLoad={handleImageLoad}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Animated Badge */}
        <div className="absolute -right-4 top-4 bg-[#F5B14C] text-white p-4 rounded-full max-w-[150px] text-center text-sm animate-bounce-slow">
          La única IA especialista en mascotas
        </div>
      </div>
    </div>
  )
}