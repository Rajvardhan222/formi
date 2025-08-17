import React from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  formId?: string;
  activeTab?: 'form' | 'responses';
  onTabChange?: (tab: 'form' | 'responses') => void;
}

const NavResponse = ({ formId, activeTab = 'form', onTabChange }: Props) => {
  const router = useRouter();
  
  const handleFormClick = () => {
    if (onTabChange) {
      onTabChange('form');
    } else if (formId) {
      router.push(`/forms/d/${formId}/editing`);
    }
  };
  
  const handleResponsesClick = () => {
    if (onTabChange) {
      onTabChange('responses');
    } else if (formId) {
      router.push(`/forms/d/${formId}/responses`);
    }
  };
  
  return (
    <div className="w-full bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center h-10">
          {/* Center buttons */}
          <div className="flex items-center space-x-1">
            <button 
              onClick={handleFormClick}
              className={`px-4 py-1 text-sm font-medium ${
                activeTab === 'form' 
                ? 'text-black dark:text-white bg-gray-100 dark:bg-gray-900' 
                : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-900'
              } rounded-md transition-colors duration-200`}
            >
              Form
            </button>
            <button 
              onClick={handleResponsesClick}
              className={`px-4 py-1 text-sm font-medium ${
                activeTab === 'responses' 
                ? 'text-black dark:text-white bg-gray-100 dark:bg-gray-900' 
                : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-900'
              } rounded-md transition-colors duration-200`}
            >
              Responses
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavResponse