"use client";

import React, { useEffect, use, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/lib/hooks'
import FormHeader from '@/components/FormHeader'
import ShortAnswer from '@/components/ShortAnswer'
import { updateFormResponse } from '@/lib/features/responseformSlice/ResponseFormSlice';
import LoadingPage from '@/components/ui/LoadingPage';
import { setFormStore } from '@/lib/features/responseformSlice/ResponseFormSlice';
import FormAlreadySubmited from '@/components/ui/FormAlreadySubmited';

type ElementType = {
  [key: string]: React.ComponentType<{
    id: string;
    viewMode: 'user' | 'admin';
    question?: string;
    description?: string;
    required?: boolean;
    value?: string;
    onValueChange?: (value: string) => void;
  }>;
};

type FormElement = {
  id: string;
  type: string;
  label: string;
  description?: string;
  required?: boolean;
};

const currentTimeKey = "currentTime"

const formMappingToElement: ElementType = {
  short_answer: ShortAnswer,
};

const FormResponsePage = ({ params }: { params: Promise<{ id: string }> }) => {

  const [isNewUser, setIsNewUser] = useState(true); // Default to true
  const [submissionTimestamp, setSubmissionTimestamp] = useState<number | null>(null);

  // save current time in local storage in seconds
  const currentTime = Math.floor(Date.now() / 1000); // we divide ms with 1000 to get second(s)

  localStorage.setItem(currentTimeKey, currentTime.toString());
  const { id: formId } = use(params);
  const dispatch = useAppDispatch();
  const formData = useAppSelector((state) => state.ResponseForm);
  const formTitle = formData.formTitle || "Untitled Form";
  const formDescription = formData.formDescription || "Please fill out this form";
  const elements = formData.elements || [];
  const [isFormLoaded, setIsFormLoaded] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [isResponseSubmitting, setIsResponseSubmitting] = useState(false);

  // Convert responses array to object for easier lookup
  const responses = formData.responses.reduce((acc: Record<string, string>, response) => {
    acc[response.elementId] = response.value;
    return acc;
  }, {});


  async function fetchFormData() {
    const response = await fetch(`/api/getForm/${formId}`, {
      method: "GET",
    });
    if (response.status === 200) {
      const formData = await response.json();
      console.log("Form data fetched successfully:", formData);
      dispatch(setFormStore(formData));
    } else {
      console.error("Failed to fetch form data");
    }
  }

  useEffect(() => {
    // Check if user has already submitted this form
    console.log("🍪 Checking cookies for form submission...");
    console.log("📋 Current formId:", formId);
    console.log("🔍 All cookies:", document.cookie);
    
    const cookie = document.cookie.split('; ').find(row => row.startsWith('formSubmission='));
    console.log("🎯 Found formSubmission cookie:", cookie);
    
    if (cookie) {
      try {
        // Extract the cookie value (everything after 'formSubmission=')
        const cookieValue = cookie.split('=')[1];
        console.log("📦 Cookie value:", cookieValue);
        
        // Parse the cookie value: form_submitted_${formId}_${timestamp}
        const parts = cookieValue.split('_');
        const timestamp = parts[1];
        console.log("🔧 Cookie parts:", parts);
        
        if (parts[0] === formId  ) {
         
            setIsNewUser(false);
            setSubmissionTimestamp(parseInt(timestamp));
           
        } else {
          console.log("❌ Invalid cookie format, treating as new user");
          setIsNewUser(true);
        }
      } catch (error) {
        console.error("🚨 Error parsing cookie:", error);
        setIsNewUser(true);
      }
    } else {
      console.log("🚫 No formSubmission cookie found, treating as new user");
      setIsNewUser(true);
    }

    // TODO: Fetch form data based on formId and initialize the response form
    setIsFormLoaded(true);
    // For now, we'll use mock data or data from editing state
  
    console.log('Loading form for response:', formId);
    fetchFormData()
    .finally(()=>{
      setIsFormLoaded(false)
    })
  }, [formId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleResponseChange = (elementId: string, value: string) => {
    // TODO: Dispatch action to update response in store
    console.log("updating state value",elementId,value)
    dispatch(updateFormResponse({
        elementId,
        value
    }));
  };

  const handleSubmitForm = () => {
    setIsResponseSubmitting(true);
    // TODO: Submit the form responses
    const completionTimeSeconds = Math.floor(Date.now() / 1000) - parseInt(localStorage.getItem(currentTimeKey) || '0');

    fetch('/api/submitFormResponse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        responses: formData.responses,
        formId,
        completionTimeSeconds,
      }),
    })
    .then((response) => {
      if (response.ok) {
        console.log('Form submitted successfully');
      } else {
        console.error('Failed to submit form');
      }
    })
    .catch((error) => {
      console.error('Error submitting form:', error);
    });
    console.log('Submitting form responses:', responses);
    setIsResponseSubmitting(false);
  };

  if(isFormLoaded){
    return <LoadingPage/>
  }
console.log(isNewUser)
  if(!isNewUser){
    return <FormAlreadySubmited 
      formTitle={formTitle}
      submissionTime={submissionTimestamp || undefined} 
    />
  }

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-300">
      <div className="md:w-1/2 m-auto py-10 flex flex-col gap-6">
        <FormHeader
          viewMode="user"
          title={formTitle}
          description={formDescription}
        />

        {elements.map((element: FormElement) => {
          const ElementComponent = formMappingToElement[element.type];
          if (!ElementComponent) return null;
          
          return (
            <ElementComponent
              key={element.id}
              id={element.id}
              viewMode="user"
              question={element.label}
              description={element.description}
              required={element.required}
              value={responses[element.id] || ""}
              onValueChange={(value: string) => handleResponseChange(element.id, value)}
            />
          );
        })}

        {elements.length > 0 && (
          <div className="flex justify-end mt-8">
            <button
              onClick={handleSubmitForm}
              className={`px-8 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg ${isResponseSubmitting ? 'opacity-50 cursor-not-allowed ' : ''}`}
              disabled={isResponseSubmitting}
            >
              {
                isResponseSubmitting ? "Processing..." : "Submit Response"
              }
            </button>
          </div>
        )}

        {elements.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              This form is empty. Please check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default FormResponsePage