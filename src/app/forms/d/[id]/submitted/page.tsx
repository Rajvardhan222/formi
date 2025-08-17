"use client";

import React, { use, useEffect, useState } from 'react';
import ResponseRecorded from '@/components/ui/ResponseRecorded';
import { useRouter } from 'next/navigation';
import LoadingPage from '@/components/ui/LoadingPage';

const FormSubmittedPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id: formId } = use(params);
  const router = useRouter();
  const [formTitle, setFormTitle] = useState<string>("Form");
  const [submissionTime, setSubmissionTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has a valid submission cookie for this form
    const cookie = document.cookie.split('; ').find(row => row.startsWith('formSubmission='));
    
    if (cookie) {
      try {
        const cookieValue = cookie.split('=')[1];
        const parts = cookieValue.split('_');
        const storedFormId = parts[0];
        const timestamp = parts[1];
        
        if (storedFormId === formId && timestamp) {
          setSubmissionTime(parseInt(timestamp));
          // Fetch form title
          fetchFormTitle();
        } else {
          // No valid submission found, redirect to form
          router.push(`/forms/d/${formId}/formResponse`);
        }
      } catch (error) {
        console.error("Error parsing submission cookie:", error);
        router.push(`/forms/d/${formId}/formResponse`);
      }
    } else {
      // No submission cookie found, redirect to form
      router.push(`/forms/d/${formId}/formResponse`);
    }
  }, [formId, router]);

  const fetchFormTitle = async () => {
    try {
      const response = await fetch(`/api/getForm/${formId}`);
      if (response.ok) {
        const data = await response.json();
        setFormTitle(data.formTitle || "Form");
      }
    } catch (error) {
      console.error("Error fetching form title:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReturnHome = () => {
    router.push('/u');
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <ResponseRecorded 
      formTitle={formTitle}
      submissionTime={submissionTime || undefined}
      onReturnHome={handleReturnHome}
      confirmationMessage="Your response has been successfully recorded. Thank you for your participation!"
    />
  );
};

export default FormSubmittedPage;
