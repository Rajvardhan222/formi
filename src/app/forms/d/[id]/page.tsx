"use client"
import React from 'react'
import FormHeader from '@/components/FormHeader'
import ShortAnswer from '@/components/ShortAnswer'

function Form() {

  return (
    < div className='w-full h-screen'>
      <div className='md:w-1/2 m-auto my-10 flex flex-col gap-6'>

      <FormHeader />
      <ShortAnswer/>
      </div>
    
    </div>
  )
}

export default Form