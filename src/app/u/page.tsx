"use client"

import HomeNav from '@/components/home-nav'
import { Plus } from 'lucide-react'
import React from 'react'

const page = () => {
  return (
    <div>
     <HomeNav/>
     <div className='w-full m-auto p-8'>
        {/* Rectangle box with plus icon */}
        <div className='group cursor-pointer bg-card border-2 border-dashed border-border hover:border-primary transition-all duration-300 rounded-lg w-64 h-80 flex items-center justify-center hover:shadow-lg'>
          <Plus 
            size={48} 
            className='text-muted-foreground group-hover:text-primary transition-all duration-300 group-hover:rotate-90'
          />
        </div>
     </div>
    </div>
  )
}

export default page