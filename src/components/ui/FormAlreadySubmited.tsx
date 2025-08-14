import React from 'react'

type Props = {
  formTitle?: string;
  submissionTime?: number; // Date.now() timestamp
}

const FormAlreadySubmited = ({ 
  formTitle = "This form", 
  submissionTime 
}: Props) => {
  
  // Format the submission time
  const formatSubmissionTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    return date.toLocaleDateString('en-US', options);
  };

  const getRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const diffInMs = now - timestamp;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    } else {
      return 'Just now';
    }
  };
  return (
    <div className="w-full bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-300">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Main Card */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            
            {/* Header with Icon */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 px-8 py-12 text-center border-b border-gray-200 dark:border-gray-700">
              <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                Form Already Submitted
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                {formTitle} has already been submitted from this device
              </p>
              
              {/* Submission Time Display */}
              {submissionTime && (
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-600">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                    <span className="font-medium">Original submission:</span>
                  </p>
                  <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {formatSubmissionTime(submissionTime)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    ({getRelativeTime(submissionTime)})
                  </p>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="px-8 py-10">
              <div className="space-y-6">
                
                {/* Main Message */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        Duplicate Submission Detected
                      </h3>
                      <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
                        Our system has detected that this form has already been submitted from your device. 
                        To prevent duplicate entries, we only allow one submission per device.
                      </p>
                      {submissionTime && (
                        <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            <span className="font-medium">Submission recorded:</span> {formatSubmissionTime(submissionTime)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* What to do next */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    What can you do?
                  </h2>
                  
                  <div className="grid gap-4">
                    <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-green-600 dark:text-green-400 text-sm font-semibold">1</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Contact Administrator</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          If you believe this is a mistake, please contact the form administrator for assistance.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-green-600 dark:text-green-400 text-sm font-semibold">2</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Use a Different Device</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          If you need to submit again, try using a different device or browser.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-green-600 dark:text-green-400 text-sm font-semibold">3</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Check Your Previous Submission</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Your previous response has been successfully recorded and is being processed.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technical Info */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                      <span className="font-medium">Technical Information</span>
                      <svg className="w-5 h-5 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="mt-3 text-sm text-gray-600 dark:text-gray-400 space-y-2">
                      <p>• Submission tracking is device-based for security</p>
                      <p>• Form data is stored securely and encrypted</p>
                      <p>• Multiple submissions help prevent spam and data duplication</p>
                    </div>
                  </details>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 dark:bg-gray-800/50 px-8 py-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Thank you for your understanding
                </p>
                <button
                  onClick={() => window.history.back()}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Go Back
                </button>
              </div>
            </div>
          </div>

          {/* Additional Help */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Need immediate assistance? Contact support or try refreshing the page.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormAlreadySubmited;