"use client";

import React, { useEffect, use, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import FormHeader from "@/components/FormHeader";
import {
  initialRender,
  updateTitle,
  addElement,
  updateDescription,
  deleteElement,
  onDescriptionChange as ElementDescriptionChange,
  onQuestionChange as ElementQuestionChange,
  onRequiredChange as ElementRequiredChange,
} from "@/lib/features/editslice/editform.slice";
import ShortAnswer from "@/components/ShortAnswer";
import LoadingPage from "@/components/ui/LoadingPage";
import MultiChoiceComponent from "@/components/MultiChoiceComponent";
import SingleChoiceForm from "@/components/SingleChoiceComponent";
import EditFormNav from "@/components/EditFormNav";
import NavResponse from "@/components/NavResponse";
import { ResponsesTable } from "@/components/ResponsesTable";

export type ElementType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: React.ComponentType<any>;
};
const formMappingToElement: ElementType = {
  short_answer: ShortAnswer,
  multi_choice: MultiChoiceComponent,
  single_choice: SingleChoiceForm
};
const EditFormPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id: formId } = use(params);
  const dispatch = useAppDispatch();
  const form = useAppSelector((state) => state.Editform);
  const currentlyEditingElementId = form.currentEditingElementId;
  const isInitialGetRequestDone = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'form' | 'responses'>('form');

  const fetchForm = async () => {
    const response = await fetch(`/api/getForm/${formId}`, {
      method: "GET",
    });
    if (response.status === 404) {
      // if returns 404 it means a new form is there
      dispatch(
        initialRender({
          id: formId,
        })
      );

      dispatch(
        addElement({
          type: "short_answer",
          label: "New Short Answer",
          required: false,
        })
      );
    } else if (response.status === 200) {
      // if returns a 200 it means it already exists
      const formData = await response.json();
      dispatch(initialRender({ id: formId, ...formData }));
    }

    isInitialGetRequestDone.current = true;
    setIsLoading(false);
  };
  const isrunning = useRef(false);

  useEffect(() => {
    fetchForm();
  }, [formId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Separate useEffect for auto-save that depends on form state
  useEffect(() => {
    if (!isInitialGetRequestDone.current) {
      return;
    }

    const updateForm = async () => {
      await fetch("/api/saveOrUpdateForm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formId: formId,
          formData: {
            title: form.formTitle,
            description: form.formDescription,
            elements: form.elements,
          },
        }),
      });
    };

    if(!isrunning.current) {
      isrunning.current = true;
      updateForm().finally(() => {
        isrunning.current = false;
      });
    }
  }, [form, formId]);

  function onTitleChange(newTitle: string) {
    dispatch(updateTitle(newTitle));
  }

  function onDescriptionChange(newDescription: string) {
    dispatch(updateDescription(newDescription));
  }
  
  function handleTabChange(tab: 'form' | 'responses') {
    setActiveTab(tab);
  }

  const formTitle = form?.formTitle || "";
  const formDescription = form?.formDescription || "";

  // Loading component
  if (isLoading) {
    return (
     <LoadingPage/>
    );
  }

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-300">
      <EditFormNav formId={formId} />
      <NavResponse formId={formId} activeTab={activeTab} onTabChange={handleTabChange} />
      
      {activeTab === 'form' ? (
        <div className="md:w-1/2 m-auto py-10 flex flex-col gap-6">
          <FormHeader
            viewMode="admin"
            title={formTitle}
            description={formDescription}
            onTitleChange={onTitleChange}
            onDescriptionChange={onDescriptionChange}
          />

          {form.elements.map((element) => {
            const ElementComponent = formMappingToElement[element.type];
            return (
              <ElementComponent
                key={element.id}
                id={element.id}
                viewMode="admin"
                question={element.label}
                description={element.description}
                required={element.required}
                questionType={element.type}
                isCurrentlyEditing={
                  currentlyEditingElementId === element.id
                    ? currentlyEditingElementId
                    : null
                }
                onQuestionChange={(question: string) =>
                  dispatch(ElementQuestionChange({ id: element.id, question }))
                }
                onDescriptionChange={(description: string) =>
                  dispatch(
                    ElementDescriptionChange({ id: element.id, description })
                  )
                }
                onRequiredChange={(required: boolean) =>
                  dispatch(ElementRequiredChange({ id: element.id, required }))
                }
                onDelete={() => dispatch(deleteElement(element.id))}
              />
            );
          })}
        </div>
      ) : (
        <div className="container mx-auto py-4">
          <ResponsesTable formId={formId} />
        </div>
      )}
    </div>
  );
};

export default EditFormPage;
