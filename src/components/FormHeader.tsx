import React from 'react'

type Props = {}

const FormHeader = (props: Props) => {
  return (
    <div className='w-full border-t-8 border-black bg-zinc-100 dark:bg-gray-950 dark:border-white rounded-xl py-6 px-6'>
      <h1 className='text-2xl font-bold'>Form Header</h1>
      <p className='text-gray-600'>This is the form header description.</p>
    </div>
  )
}

export default FormHeader