'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from "next/link"

// Inline Input component
const Input = ({ className = '', ...props }: { className?: string; [key: string]: any }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
)

// Inline Button component
const Button = ({ className = '', ...props }: { className?: string; [key: string]: any }) => (
  <button
    className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 ${className}`}
    {...props}
  />
)

const TypewriterText = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  
  const texts = [
    "Create an Instagram post about the latest tech trends...",
    "Write a LinkedIn article about digital marketing strategies...",
    "Generate a YouTube script about productivity hacks...",
    "Compose a Twitter thread about startup success stories...",
    "Design content about innovative business models..."
  ]

  useEffect(() => {
    const text = texts[currentTextIndex]
    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(text.substring(0, displayText.length + 1))
        if (displayText.length === text.length) {
          setTimeout(() => setIsDeleting(true), 1000)
        }
      } else {
        setDisplayText(text.substring(0, displayText.length - 1))
        if (displayText.length === 0) {
          setIsDeleting(false)
          setCurrentTextIndex((currentTextIndex + 1) % texts.length)
        }
      }
    }, isDeleting ? 50 : 100)

    return () => clearTimeout(timer)
  }, [displayText, currentTextIndex, isDeleting, texts])

  return displayText
}

// BentoGrid Components
const BentoGrid = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`grid w-full auto-rows-[16rem] grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      {children}
    </div>
  )
}

const BentoCard = ({
  name,
  className = '',
  background,
  Icon,
  description,
  href,
  cta
}: {
  name: string;
  className?: string;
  background: React.ReactNode;
  Icon: React.FC<{ className?: string }>;
  description: string;
  href: string;
  cta: string;
}) => (
  <div className={`group relative flex flex-col justify-between overflow-hidden rounded-xl bg-black [box-shadow:0_0_0_1px_rgba(255,255,255,.1),0_2px_4px_rgba(255,255,255,.05),0_12px_24px_rgba(255,255,255,.05)] transform-gpu [border:1px_solid_rgba(255,255,255,.1)] [box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] ${className}`}>
    <div>{background}</div>
    <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-4 transition-all duration-300 group-hover:-translate-y-10">
      <Icon className="h-10 w-10 origin-left transform-gpu text-neutral-300 transition-all duration-300 ease-in-out group-hover:scale-75" />
      <h3 className="text-lg font-semibold text-neutral-300">{name}</h3>
      <p className="max-w-lg text-sm text-neutral-400">{description}</p>
    </div>
    <div className="pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
      <Button variant="ghost" size="sm" className="pointer-events-auto text-neutral-300 hover:text-neutral-100 hover:bg-neutral-800">
        <Link href={href}>
          {cta}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-4 w-4"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </Link>
      </Button>
    </div>
    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-neutral-800/50" />
  </div>
)

// Features Data
const features = [
  {
    Icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
    ),
    name: "Instagram Creator",
    description: "Design eye-catching posts and stories that capture your audience's attention.",
    href: "instagram",
    cta: "Create Post",
    className: "md:col-span-2 md:row-span-2",
    background: <div className="absolute inset-0 bg-gradient-to-br from-pink-600 to-purple-800 opacity-20" />,
  },
  {
    Icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
    ),
    name: "Tweet Composer",
    description: "Craft engaging tweets that spark conversations and increase your reach.",
    href: "twitter",
    cta: "Compose Tweet",
    className: "md:col-span-1 md:row-span-1",
    background: <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-500 opacity-20" />,
  },
  {
    Icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
    ),
    name: "LinkedIn Pulse",
    description: "Generate professional content that resonates with your network and industry.",
    href: "linkedin",
    cta: "Write Article",
    className: "md:col-span-1 md:row-span-1",
    background: <div className="absolute inset-0 bg-gradient-to-br from-blue-800 to-indigo-800 opacity-20" />,
  },
  {
    Icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
    ),
    name: "YouTube Studio",
    description: "Create compelling video scripts and optimize your content for better engagement.",
    href: "youtube",
    cta: "Start Scripting",
    className: "md:col-span-3 md:row-span-1",
    background: <div className="absolute inset-0 bg-gradient-to-br from-red-700 to-pink-700 opacity-20" />,
  },
]

// Main Component
export default function HomePage() {
  const [prompt, setPrompt] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [activeIdeaTab, setActiveIdeaTab] = useState<string>('about')
  const [activeBuiltTab, setActiveBuiltTab] = useState<string>('overview')
  const [activeWantedTab, setActiveWantedTab] = useState<string>('overview')
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    router.push(`/story?prompt=${encodeURIComponent(prompt)}`)
  }

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-black text-white font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open_Sans','Helvetica_Neue',sans-serif]">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl animate-pulse" />
          <div className="absolute top-1/4 left-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob" />
          <div className="absolute top-1/4 right-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 py-2">
              Content Hub
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-8">
              Transform your ideas into engaging content across platforms
            </p>

            <form onSubmit={handleSubmit} className="w-full mb-8">
              <div className="relative group mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                <div className="relative flex items-center bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-2">
                  <Input
                    type="text"
                    value={prompt}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrompt(e.target.value)}
                    placeholder={TypewriterText()}
                    className="flex-grow border-0 bg-transparent text-white placeholder-gray-400"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="ml-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="m6 9 6 6 6-6"/></svg>
                    <span>
                      {isLoading ? 'Generating...' : 'Generate'}
                    </span>
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-4 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-blue-500"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
                <span>Powered by</span>
                <Link 
                  href="https://cloud.sambanova.ai"
                  target="_blank"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  cloud.sambanova.ai
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Cross-Platform Content Creation Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
              Cross-Platform Content Creation
            </h2>
            <p className="text-xl text-gray-400 mb-4">
              Optimize your social media presence with AI-powered content creation
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
              <span>Intelligent content generation for your needs</span>
            </div>
          </div>
          
          <BentoGrid>
            {features.map((feature) => (
              <BentoCard key={feature.name} {...feature} />
            ))}
          </BentoGrid>
        </div>
      </section>

      {/* Our Idea Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            Our Idea
          </h2>
          
          <div className="mb-8">
            <div className="flex justify-center space-x-4 border-b border-gray-800">
              {['about', 'details'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveIdeaTab(tab)}
                  className={`py-2 px-4 text-lg font-medium transition-colors duration-300 ${
                    activeIdeaTab === tab
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-gray-500 hover:text-blue-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {activeIdeaTab === 'about' && (
              <>
                <p className="text-xl leading-relaxed text-gray-300">
                  <span className="text-7xl font-serif float-left mr-4 mt-1 leading-none text-blue-500">B</span>
                  y utilizing advanced AI and data analysis, we've developed a platform that automates the generation of content across various social media platforms. Our solution provides users with tailored posts for Twitter, Instagram, LinkedIn, and YouTube, streamlining the content creation process.
                </p>
                <p className="text-lg leading-relaxed text-gray-400">
                  Our platform aims to streamline content creation for enthusiasts, marketers, and businesses, enabling them to maintain a consistent and engaging online presence across multiple channels.
                </p>
              </>
            )}
            {activeIdeaTab === 'details' && (
              <>
                <p className="text-lg leading-relaxed text-gray-300">
                  The Content Hub leverages advanced natural language processing and machine learning algorithms to analyze trends, sentiment, and engagement patterns. This analysis forms the foundation for generating relevant and timely content tailored to each social media platform's unique requirements and audience expectations.
                </p>
                <p className="text-lg leading-relaxed text-gray-300">
                  Users can input specific topics, keywords, or themes, and our AI will generate platform-specific content suggestions, complete with hashtags, mentions, and optimized formatting. This approach ensures that the content remains authentic and aligned with the user's brand voice while maximizing reach and engagement across different social media ecosystems.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* What We've Built Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            What We've Built
          </h2>
          
          <div className="mb-8">
            <div className="flex justify-center space-x-4 border-b border-gray-800">
              {['overview', 'details'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveBuiltTab(tab)}
                  className={`py-2 px-4 text-lg font-medium transition-colors duration-300 ${
                    activeBuiltTab === tab
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-gray-500 hover:text-blue-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {activeBuiltTab === 'overview' && (
              <>
                <p className="text-xl leading-relaxed text-gray-300">
                  <span className="text-7xl font-serif float-left mr-4 mt-1 leading-none text-blue-500">O</span>
                  ur Content Hub is a cutting-edge platform that leverages AI and data analysis to revolutionize content creation. We've developed a comprehensive system that automates and optimizes content generation across multiple social media platforms.
                </p>
                <p className="text-lg leading-relaxed text-gray-400">
                  By harnessing the power of advanced AI models and real-time data analysis, we've created a seamless user experience that empowers creators, marketers, and businesses to maintain a consistent and engaging online presence with minimal effort.
                </p>
              </>
            )}
            {activeBuiltTab === 'details' && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-blue-400">Data-Driven Content Generation</h3>
                  <p className="text-lg leading-relaxed text-gray-300">
                    Our AI analyzes key trends, gauges user sentiment, and identifies popular discussions across various topics. This allows us to generate content that's relevant and timely.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-blue-400">AI Models for Multi-Platform Content Creation</h3>
                  <div className="space-y-4">
                    {[
                      {
                        id: 'ai-workflow',
                        title: 'AI-Powered Workflow',
                        content: 'Ensures a smooth and efficient process for generating content across multiple platforms.'
                      },
                      {
                        id: 'text-generation',
                        title: 'Advanced Text Generation',
                        content: 'Based on the analyzed data, the AI creates high-quality, platform-specific content, including:',
                        list: [
                          { platform: 'Twitter', description: 'Generates tweets and image descriptions that reflect trends and community sentiment.' },
                          { platform: 'Instagram', description: 'Produces engaging captions, trending hashtags, and image descriptions that fit Instagram\'s visual nature.' },
                          { platform: 'LinkedIn', description: 'Crafts professional posts tailored to LinkedIn\'s business-focused audience, highlighting thought leadership.' },
                          { platform: 'YouTube', description: 'Develops compelling video titles, detailed descriptions, well-structured scripts, and thumbnail image descriptions.' }
                        ]
                      }
                    ].map((item) => (
                      <div key={item.id} className="border border-gray-800 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleAccordion(item.id)}
                          className="flex justify-between items-center w-full p-4 text-left"
                          aria-expanded={activeAccordion === item.id}
                          aria-controls={`content-${item.id}`}
                        >
                          <span className="text-xl font-medium text-blue-400">{item.title}</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`w-5 h-5 transition-transform text-blue-400 ${
                              activeAccordion === item.id ? 'transform rotate-180' : ''
                            }`}
                          >
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </button>
                        {activeAccordion === item.id && (
                          <div id={`content-${item.id}`} className="p-4 bg-black">
                            <p className="text-lg mb-2 text-gray-300">{item.content}</p>
                            {item.list && (
                              <ul className="list-disc pl-5 space-y-2">
                                {item.list.map((listItem, index) => (
                                  <li key={index} className="text-lg text-gray-300">
                                    <Link href={`/${listItem.platform.toLowerCase()}`} className="text-blue-400 hover:underline">
                                      {listItem.platform}
                                    </Link>
                                    : {listItem.description}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-blue-400">Image Generation</h3>
                  <p className="text-lg leading-relaxed text-gray-300">
                    The image descriptions generated by the AI are transformed into prompts, which are used to generate actual images for each social media post, ensuring that the visuals perfectly complement the text and resonate with the intended themes.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-blue-400">Seamless User Experience</h3>
                  <p className="text-lg leading-relaxed text-gray-300">
                    The platform is designed to make content creation as easy as possible. With minimal input, it automatically generates high-quality, tailored content for each platform. This streamlines the process, saving time and effort while ensuring the content is engaging and relevant.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* What We Wanted to Build Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            What We Wanted to Build
          </h2>
          
          <div className="mb-8">
            <div className="flex justify-center space-x-4 border-b border-gray-800">
              {['overview', 'details'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveWantedTab(tab)}
                  className={`py-2 px-4 text-lg font-medium transition-colors duration-300 ${
                    activeWantedTab === tab
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-gray-500 hover:text-blue-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {activeWantedTab === 'overview' && (
              <>
                <p className="text-xl leading-relaxed text-gray-300">
                  <span className="text-7xl font-serif float-left mr-4 mt-1 leading-none text-blue-500">W</span>
                  hile we've built a powerful content generation platform, there were a few additional features we had planned but couldn't implement due to time constraints. These features would have further enhanced the capabilities and user experience of our Content Hub.
                </p>
                <p className="text-lg leading-relaxed text-gray-400">
                  Our vision included real-time data integration, streamlined posting processes, and expanded content types to provide an even more comprehensive solution for content creators and marketers.
                </p>
              </>
            )}
            {activeWantedTab === 'details' && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-blue-400">Real-Time Data Integration</h3>
                  <p className="text-lg leading-relaxed text-gray-300">
                    We wanted to integrate real-time data to ensure our AI model could keep up with the latest trends, updates, and breaking news. This would make the content even more timely and relevant.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-blue-400">One-Click Posting</h3>
                  <p className="text-lg leading-relaxed text-gray-300">
                    To further streamline the process, we had planned to add a one-click posting feature. This would allow users to instantly publish the generated content across their connected social media accounts with a single click, saving time and effort.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-blue-400">Instagram Reels Generation</h3>
                  <p className="text-lg leading-relaxed text-gray-300">
                    Another feature we aimed to add was a dedicated Reels section for Instagram. Our AI model would have been able to generate full-length, ready-to-upload reel videos, making it easier for users to engage their audience through dynamic video content.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="py-8 border-t border-gray-800 bg-black">
        <div className="container mx-auto px-4">
          <p className="text-sm text-gray-500 text-center">
            © 2024 Content Hub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
  