import React from 'react';

type FormHeaderProps = {
  title: string;
  description: string;
  viewMode: 'admin' | 'user';
  onTitleChange?: (newTitle: string) => void;
  onDescriptionChange?: (newDescription: string) => void;
};

const FormHeader = ({
  title,
  description,
  viewMode,
  onTitleChange,
  onDescriptionChange,
}: FormHeaderProps) => {
  return (
    <div className='w-full border-t-8 border-black bg-zinc-100 dark:bg-gray-950 dark:border-white rounded-xl py-6 px-6'>
      {viewMode === 'admin' ? (
        <>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange?.(e.target.value)}
            className='text-3xl font-bold bg-transparent outline-none w-full border-b border-transparent focus:border-gray-300 dark:focus:border-gray-700'
            placeholder="Form Title"
          />
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange?.(e.target.value)}
            className='text-gray-600 bg-transparent outline-none w-full mt-2 resize-none border-b border-transparent focus:border-gray-300 dark:focus:border-gray-700'
            placeholder="Form Description"
            rows={2}
          />
        </>
      ) : (
        <>
          <h1 className='text-3xl font-bold'>{title}</h1>
          <p className='text-gray-600 mt-2'>{description}</p>
        </>
      )}
    </div>
  );
};

export default FormHeader;
