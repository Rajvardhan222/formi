"use client";

import React, { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@/lib/hooks'
import FormHeader from '@/components/FormHeader'
import ShortAnswer from '@/components/ShortAnswer'
import { updateFormResponse } from '@/lib/features/responseformSlice/ResponseFormSlice';
type Props = {
  params: { id: string }
}

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

const formMappingToElement: ElementType = {
  short_answer: ShortAnswer,
};

const FormResponsePage = ({ params }: Props) => {
  const dispatch = useAppDispatch();
  const formData = useAppSelector((state) => state.ResponseForm);
  
  const formId = params.id;
  const formTitle = formData.formTitle || "Untitled Form";
  const formDescription = formData.formDescription || "Please fill out this form";
  const elements = formData.elements || [];
  
  // Convert responses array to object for easier lookup
  const responses = formData.responses.reduce((acc: Record<string, string>, response) => {
    acc[response.elementId] = response.value;
    return acc;
  }, {});

  useEffect(() => {
    // TODO: Fetch form data based on formId and initialize the response form
    // For now, we'll use mock data or data from editing state
    console.log('Loading form for response:', formId);
  }, [formId]);

  const handleResponseChange = (elementId: string, value: string) => {
    // TODO: Dispatch action to update response in store
    console.log("updating state value",elementId,value)
    dispatch(updateFormResponse({
        elementId,
        value
    }));
  };

  const handleSubmitForm = () => {
    // TODO: Submit the form responses
    console.log('Submitting form responses:', responses);
  };

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
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Submit Response
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