"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  publishForm,
  publishFormSuccess,
  publishFormError,
  unpublishForm,
  unpublishFormSuccess,
  unpublishFormError,
} from "@/lib/features/editslice/editform.slice";
import { useRouter } from "next/navigation";

interface EditFormNavProps {
  formId: string;
}

const EditFormNav: React.FC<EditFormNavProps> = ({ formId }) => {
    const router = useRouter();
  const dispatch = useAppDispatch();
  const { isPublished, isPublishing } = useAppSelector(
    (state) => state.Editform
  );

  const publishFormHandler = async () => {
    try {
      dispatch(publishForm());
      const response = await fetch(`/api/publish/${formId}`);

      if (response.ok) {
        dispatch(publishFormSuccess());
      } else {
        dispatch(publishFormError());
        console.error("Failed to publish form");
      }
    } catch (error) {
      dispatch(publishFormError());
      console.error("Error publishing form:", error);
    }
  };

  const unpublishFormHandler = async () => {
    try {
      dispatch(unpublishForm());
      const response = await fetch(`/api/unpublish/${formId}`);

      if (response.ok) {
        dispatch(unpublishFormSuccess());
      } else {
        dispatch(unpublishFormError());
        console.error("Failed to unpublish form");
      }
    } catch (error) {
      dispatch(unpublishFormError());
      console.error("Error unpublishing form:", error);
    }
  };

  const copyFormLink = async () => {
    
      // Create the form link URL
      const formLink = `${window.location.origin}/forms/d/${formId}/formResponse`;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(formLink);
      
      // Optional: Show a success message or toast
      console.log("Form link copied to clipboard!");
      
      // You could also add a toast notification here
     
  };

  return (
    <div className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo/Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div 
              onClick={() => router.push("/u")}
              className="w-8 h-8 bg-blue-600 cursor-pointer dark:bg-blue-500 rounded-lg flex items-center justify-center">
                <div className="text-white cursor-pointer font-semibold">Fi</div>
              </div>
              <h1 className="text-xl cursor-pointer  font-semibold text-gray-900 dark:text-white">
                Form Editor
              </h1>
            </div>
          </div>

          {/* Center - Form Status */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isPublished ? "bg-green-500" : "bg-yellow-500"
                }`}
              ></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {isPublished ? "Published" : "Draft"}
              </span>
            </div>
          </div>

          {/* Right side - Action buttons */}
          <div className="flex items-center space-x-3">
            {/* Link/Share button */}
            <button 
              onClick={copyFormLink}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-color duration-200 border border-gray-300 dark:border-gray-600
              active:border-4  
              "
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                ></path>
              </svg>
              <span className="hidden sm:inline">Link</span>
            </button>

            {/* Publish button */}
            <button
              onClick={isPublished ? unpublishFormHandler : publishFormHandler}
              disabled={isPublishing}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPublishing ? (
                <>
                  <svg
                    className="w-4 h-4 mr-2 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {isPublished ? "Unpublishing..." : "Publishing..."}
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 001.547 3.193A4.001 4.001 0 1017 18h.009a2.25 2.25 0 100-4.5H17a4 4 0 00-1.547-3.193A4.001 4.001 0 107 16z"
                    ></path>
                  </svg>
                  {isPublished ? "Unpublish" : "Publish"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditFormNav;
