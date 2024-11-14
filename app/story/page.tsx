import { Suspense } from 'react'
import TweetRepurposer from 'app/story/tweet-repurposer'

export default function Page() {
  return (
    <Suspense fallback={<LoadingState />}>
      <TweetRepurposer />
    </Suspense>
  )
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Loading...
        </h2>
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse" />
        </div>
      </div>
    </div>
  )
}