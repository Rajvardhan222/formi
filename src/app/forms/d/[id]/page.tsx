"use client"
import React, { use } from 'react'
import FormHeader from '@/components/FormHeader'
import ShortAnswer from '@/components/ShortAnswer'

function Form({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    < div className='w-full h-screen'>
      <div className='md:w-1/2 m-auto my-10 flex flex-col gap-6'>

      <FormHeader title="Form Title" description="Form Description" viewMode="user" />
      <ShortAnswer id={id} viewMode="user" />
      </div>
    
    </div>
  )
}

export default Form