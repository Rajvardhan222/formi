"use client";

import { ResponsesTable } from '@/components/ResponsesTable';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import NavResponse from '@/components/NavResponse';
import EditFormNav from '@/components/EditFormNav';

interface ResponsesPageProps {
  params: {
    id: string;
  };
}

export default function ResponsesPage({ params }: ResponsesPageProps) {
  const formId = params.id;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'form' | 'responses'>('responses');
  
  const handleTabChange = (tab: 'form' | 'responses') => {
    if (tab === 'form') {
      router.push(`/forms/d/${formId}/editing`);
    } else {
      setActiveTab('responses');
    }
  };
  
  return (
    <div className="w-full bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-300">
      <EditFormNav formId={formId} />
      <NavResponse formId={formId} activeTab={activeTab} onTabChange={handleTabChange} />
      
      <div className="container mx-auto py-4">
        <ResponsesTable formId={formId} />
      </div>
    </div>
  );
}
