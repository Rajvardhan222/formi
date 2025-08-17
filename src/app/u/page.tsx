"use client";

import HomeNav from "@/components/home-nav";
import LoadingPage from "@/components/ui/LoadingPage";
import { Plus } from "lucide-react";
import { customAlphabet } from "nanoid";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface FormData {
  formId: string;
  title: string;
  description: string;
isPublished:boolean;
  total_responses: number;
  view_count: number;
  created_at: string;
  updated_at: string;
}

const Page = () => {
  const router = useRouter();
  const [formList, setFormList] = React.useState<FormData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const navigateToFormCreation = () => {
    const formId = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ",21)();

    router.push(`/forms/d/${formId}/editing`);
  };

  const fetchFormList = async () => {
    const response = await fetch("/api/getFormList");
    if (!response.ok) {
      // Handle error
      return;
    }
    const data = await response.json();
    setFormList(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchFormList();
  }, []);

  return (
    <div>
      <HomeNav />
      {isLoading ? (
        <LoadingPage />
      ) : (
        <div className="w-full m-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {/* Rectangle box with plus icon */}
            <div className="group cursor-pointer bg-card border-2 border-dashed border-border hover:border-primary transition-all duration-300 rounded-lg w-64 h-80 flex items-center justify-center hover:shadow-lg">
              <Plus
                size={48}
                className="text-muted-foreground group-hover:text-primary transition-all duration-300 group-hover:rotate-90"
                onClick={navigateToFormCreation}
              />
            </div>

            {/* Form Cards */}
            {formList.map((form: FormData) => (
              <div
                key={form.formId}
                className="group cursor-pointer bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 rounded-lg w-64 h-80 p-6 flex flex-col justify-between hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10"
                onClick={() => router.push(`/forms/d/${form.formId}/editing`)}
              >
                <div className="flex flex-col flex-1">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {form.title || "Untitled Form"}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                      {form.description || "No description provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      {form.total_responses || 0} responses
                    </span>
                    <span className="flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                      </svg>
                      {form.view_count || 0} views
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                   
                    {form.is_published ? (
                      <div className="w-2 h-2 bg-blue-500 rounded-full" title="Accepting responses"></div>
                    ) : (
                      <div className="w-2 h-2 bg-red-500 rounded-full" title="Not accepting responses"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      )}
    </div>
  );
};

export default Page;
