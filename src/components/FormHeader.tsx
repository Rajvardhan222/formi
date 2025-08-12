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
    <div className='w-full border-t-8 border-t-black dark:border-t-white bg-white dark:bg-gray-900 rounded-xl py-6 px-6 shadow-lg border border-gray-200 dark:border-gray-700'>
      {viewMode === 'admin' ? (
        <>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange?.(e.target.value)}
            className='text-3xl font-bold bg-transparent outline-none w-full border-b-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200'
            placeholder="Form Title"
          />
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange?.(e.target.value)}
            className='text-gray-600 dark:text-gray-300 bg-transparent outline-none w-full mt-3 resize-none border-b-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200'
            placeholder="Form Description"
            rows={2}
          />
        </>
      ) : (
        <>
          <h1 className='text-3xl font-bold text-black dark:text-white'>{title}</h1>
          <p className='text-gray-600 dark:text-gray-300 mt-2'>{description}</p>
        </>
      )}
    </div>
  );
};

export default FormHeader;
