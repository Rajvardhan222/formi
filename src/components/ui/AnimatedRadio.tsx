import React from 'react';

interface AnimatedRadioProps {
  id: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  label: string;
  disabled?: boolean;
}

const AnimatedRadio: React.FC<AnimatedRadioProps> = ({
  id,
  name,
  value,
  checked,
  onChange,
  label,
  disabled = false
}) => {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <input
          type="radio"
          id={id}
          name={name}
          value={value}
          checked={checked}
          onChange={() => onChange(value)}
          disabled={disabled}
          className="sr-only"
        />
        <label
          htmlFor={id}
          className={`
            relative flex items-center justify-center w-5 h-5 rounded-full border-2 cursor-pointer transition-all duration-300 ease-in-out
            ${checked 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-500'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
          `}
        >
          {/* Inner circle with animation */}
          <div
            className={`
              w-2.5 h-2.5 rounded-full transition-all duration-300 ease-in-out
              ${checked 
                ? 'bg-blue-500 scale-100 opacity-100' 
                : 'bg-transparent scale-0 opacity-0'
              }
            `}
          />
          
          {/* Ripple effect */}
          <div
            className={`
              absolute inset-0 rounded-full transition-all duration-300 ease-out
              ${checked 
                ? 'bg-blue-500/20 scale-150 opacity-0' 
                : 'scale-100 opacity-0'
              }
            `}
          />
        </label>
      </div>
      
      <label
        htmlFor={id}
        className={`
          text-sm cursor-pointer transition-colors duration-200
          ${checked 
            ? 'text-blue-600 dark:text-blue-400 font-medium' 
            : 'text-gray-700 dark:text-gray-300'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:text-blue-600 dark:hover:text-blue-400'}
        `}
      >
        {label}
      </label>
    </div>
  );
};

export default AnimatedRadio;
