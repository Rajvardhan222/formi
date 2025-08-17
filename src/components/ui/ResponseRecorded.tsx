import React, { useEffect } from 'react';
import { CheckCircle, Clock, FileText } from 'lucide-react';
 
interface ResponseRecordedProps {
  formTitle?: string;
  submissionTime?: number;
  confirmationMessage?: string;
  showReturnButton?: boolean;
  onReturnHome?: () => void;
}

const ResponseRecorded: React.FC<ResponseRecordedProps> = ({
  formTitle = "Form",
  submissionTime,
  confirmationMessage = "Your response has been recorded.",
  showReturnButton = true,
  onReturnHome
}) => {
  const formatSubmissionTime = (timestamp?: number) => {
    if (!timestamp) return new Date().toLocaleString();
    return new Date(timestamp * 1000).toLocaleString();
  };

  

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-300 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Main Success Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:shadow-2xl border border-gray-200 dark:border-gray-700 p-8 text-center transition-all duration-300">
          {/* Success Icon with Animation */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center animate-pulse">
                <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
              </div>
              {/* Ripple Effect */}
              <div className="absolute inset-0 w-20 h-20 bg-green-500/20 rounded-full animate-ping"></div>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Response Recorded!
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            {confirmationMessage}
          </p>

          {/* Form Details */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6 space-y-3">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <FileText className="w-4 h-4" />
              <span className="font-medium">{formTitle}</span>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Submitted on {formatSubmissionTime(submissionTime)}</span>
            </div>
          </div>

          {/* Action Button */}
          {showReturnButton && (
            <button
              onClick={onReturnHome}
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              Return to Home
            </button>
          )}
        </div>

        {/* Additional Info Card */}
        <div className="mt-4 bg-white dark:bg-gray-900 rounded-lg shadow-md dark:shadow-lg border border-gray-200 dark:border-gray-700 p-4 transition-all duration-300">
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Thank you for your participation!
            </p>
            <div className="flex justify-center space-x-4 text-xs text-gray-400 dark:text-gray-500">
              <span>✓ Secure submission</span>
              <span>✓ Data encrypted</span>
              <span>✓ Privacy protected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponseRecorded;
