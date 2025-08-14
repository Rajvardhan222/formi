import React from 'react'

type Props = {}

const LoadingPage = (props: Props) => {
  return (
     <div className="w-full bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-300 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          {/* Animated spinner */}
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          
          {/* Loading text with typing animation */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Loading your form
            </h2>
            <div className="flex items-center justify-center space-x-1">
              <span className="text-gray-600 dark:text-gray-400">Please wait</span>
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default LoadingPage