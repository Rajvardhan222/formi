"use client";

import React, { useEffect, use } from "react";
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

export type ElementType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: React.ComponentType<any>;
};
const formMappingToElement: ElementType = {
  short_answer: ShortAnswer,
};
const EditFormPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id: formId } = use(params);
  const dispatch = useAppDispatch();
  const form = useAppSelector((state) => state.Editform);
  const currentlyEditingElementId = form.currentEditingElementId;

  const fetchForm = async () => {
    const response = await fetch(`/api/getForm/${formId}`, {
      method: "GET",
    });
    console.log(response);
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
  };

  useEffect(() => {
    // get form from the get url

    fetchForm();

    //if returns 404 it means a new form is there

    // if returns a 200 it means it already exists

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId]);

  function onTitleChange(newTitle: string) {
    dispatch(updateTitle(newTitle));
  }

  function onDescriptionChange(newDescription: string) {
    dispatch(updateDescription(newDescription));
  }

  const formTitle = form?.formTitle || "";
  const formDescription = form?.formDescription || "";
  return (
    <div className="w-full bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-300">
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
    </div>
  );
};

export default EditFormPage;
