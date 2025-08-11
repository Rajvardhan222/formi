import React, { useEffect, useState } from 'react'

type Props = {
    ref: React.RefObject<HTMLDivElement>
}

const FormOptionsToolkit = ({ ref }: Props) => {
    const [position, setPosition] = useState({ top: 0, left: 0, height: 0 })

    useEffect(() => {
        const updatePosition = () => {
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect()
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop
                const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
                
                setPosition({
                    top: rect.top + scrollTop,
                    left: rect.right + scrollLeft + 16, // 16px gap from the right edge
                    height: rect.height
                })
            }
        }

        // Update position initially
        updatePosition()

        // Update position on scroll and resize
        window.addEventListener('scroll', updatePosition)
        window.addEventListener('resize', updatePosition)

        return () => {
            window.removeEventListener('scroll', updatePosition)
            window.removeEventListener('resize', updatePosition)
        }
    }, [ref])

    if (!ref.current) return null

    return (
        <div 
            className='fixed z-50 flex w-18 flex-col gap-y-4 bg-zinc-100  dark:bg-zinc-800 justify-start p-4 rounded-lg shadow-md'
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
                minHeight: `${Math.max(position.height, 60)}px`,
                 // Ensure minimum height
            }}
        >
            {/* plus lucid icon inside circle */}
            <div className='flex items-center justify-center w-10 h-10 bg-white dark:bg-zinc-700 rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-600 transition-all duration-300'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            </div>
        </div>
    )
}

export default FormOptionsToolkit