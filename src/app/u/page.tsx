"use client"

import HomeNav from '@/components/home-nav'
import { Plus } from 'lucide-react'
import { nanoid } from 'nanoid'
import { useRouter } from 'next/navigation'
import React from 'react'

const Page = () => {
  const router = useRouter()
  
  const navigateToFormCreation = () => {
        const formId = nanoid()

        router.push(`/forms/d/${formId}/editing`);

  };
  return (
    <div>
     <HomeNav/>
     <div className='w-full m-auto p-8'>
        {/* Rectangle box with plus icon */}
        <div className='group cursor-pointer bg-card border-2 border-dashed border-border hover:border-primary transition-all duration-300 rounded-lg w-64 h-80 flex items-center justify-center hover:shadow-lg'>
          <Plus 
            size={48} 
            className='text-muted-foreground group-hover:text-primary transition-all duration-300 group-hover:rotate-90'

            onClick={navigateToFormCreation}
          />
        </div>
     </div>
    </div>
  )
}

export default Page