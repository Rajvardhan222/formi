import { updateCurrentlyEditingElement,addMultiChoiceFormOption,deleteMultiChoiceFormOption } from '@/lib/features/editslice/editform.slice';
import { addOptionSelect_multichoice } from '@/lib/features/responseformSlice/ResponseFormSlice';
import { useAppDispatch } from '@/lib/hooks';
import React from 'react'
import { Input } from './ui/input';
import { ExampleCombobox as Compobobox } from './ui/Combobox';
import { Trash2Icon, XIcon } from 'lucide-react';
import { Switch } from './ui/switch';
import FormOptionsToolkit from './ui/FormOptionsToolkit';
import { useAppSelector } from '@/lib/hooks';
import { Checkbox } from './ui/checkbox';
type Props = {
    viewMode: "admin" | "user";
    questionType: "short_answer" | "multi_choice";
  question?: string;
  description?: string;
  required?: boolean;
  onQuestionChange?: (question: string) => void;
  onDescriptionChange?: (description: string) => void;
  onRequiredChange?: (required: boolean) => void;
  onDelete?: () => void;
  // For user mode - response handling
  value?: string;
  id: string;
  onValueChange?: (value: string) => void;
  isCurrentlyEditing?: string | null;
  
}


const MultiChoiceComponent = ({
    questionType,
     viewMode,
  question = "",
  description = "",
  required = false,
  onQuestionChange,
  onDescriptionChange,
  onRequiredChange,
  onDelete,
  value = "",
  
  isCurrentlyEditing,
  element,
  id,
}: Props) => {
    const dispatch = useAppDispatch();
    const textRef = React.useRef<HTMLDivElement>(null);
    const [showDescription, setShowDescription] = React.useState(true);
    const multiChoiceOptions = useAppSelector((state) => state.Editform.elements.find(el => el.id === id)?.options);


    function addNewOption() {
        dispatch(addMultiChoiceFormOption({
            id
        }))
    }

    function deleteOption(optionId: string) {
        dispatch(deleteMultiChoiceFormOption({
            id,
            optionId
        }))
    }
    let responses = useAppSelector((state) => state.ResponseForm.responses);
    if(viewMode === "user") {

        function handleOptionChange(optionId: string) {
            dispatch(addOptionSelect_multichoice({
                elementId: id,
                optionId
            }))
        }

        return (
            <div className="w-full py-4 px-6 bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col">
                    <div className="flex items-center gap-1 mb-2">
                        <h3 className="text-base font-medium text-black dark:text-white">
                            {question || "Question"}
                        </h3>
                        {required && <span className="text-red-500 dark:text-red-400">*</span>}
                    </div>
                    {description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {description}
                        </p>
                    )}
                    <div className="space-y-2">
                        {element?.options?.map((option, index) => (
                            <div key={option.id} className="flex items-center gap-3"
                            onClick={()=> handleOptionChange(option.id)}
                            >
                               <Checkbox
                                    checked={
                                        responses.find((response) => response.elementId === id)?.value.includes(option.id) || false
                                    }
                                    
                               />
                                <label className="text-sm text-gray-700 dark:text-gray-300">
                                    {option.label}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

  return (
      <div
          className={`w-full py-4 px-6 rounded-lg shadow-lg transition-all duration-200 cursor-pointer ${
            isCurrentlyEditing === id 
              ? 'bg-blue-50 dark:bg-gray-800 border-2 border-blue-500 dark:border-blue-400 shadow-xl' 
              : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-xl'
          }`}
          onClick={() => {
            // make this element as currently editing if it is not already set to
            if (!isCurrentlyEditing || isCurrentlyEditing !== id) {
              dispatch(updateCurrentlyEditingElement({ id: id }));
            }
          }}
          ref={textRef}
        >
          <div className="flex gap-4">
            <div className="flex flex-col w-full">
              <Input
                type="text"
                placeholder="Question"
                value={question}
                onChange={(e) => onQuestionChange?.(e.target.value)}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200"
              />
    
              {showDescription && (
                <Input
                  type="text"
                  placeholder="Description (optional)"
                  className="mt-3 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200"
                  value={description}
                  onChange={(e) => onDescriptionChange?.(e.target.value)}
                />
              )}
            </div>
            <Compobobox questionType={questionType} />
          </div>
          <div className="w-full h-4"></div>
          <div className='w-full space-y-3'>
            {
                multiChoiceOptions?.map((option, index) => (
                    <div key={option.id} className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full border-2 border-gray-400 dark:border-gray-500 bg-white dark:bg-gray-800 flex-shrink-0"></div>
                        <input 
                            type='text' 
                            value={option.label} 
                            onChange={(e) => {
                                // TODO: Add handler to update option label
                            }}
                            placeholder={`Option ${index + 1}`}
                            className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200"
                        />
                        <button
                            type="button"
                            className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all duration-200"
                            onClick={() => {
                                // TODO: Add handler to delete option
                                deleteOption(option.id);
                            }}
                        >
                            <XIcon className="h-4 w-4" />
                        </button>
                    </div>
                ))}

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="ml-7 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all cursor-pointer duration-200 shadow-sm hover:shadow-md"
                 onClick={addNewOption}
              >
                Add Option
              </button>
            </div>
          </div>
          <hr className="w-full border-gray-200 dark:border-gray-700 mt-4" />
          <div className="flex justify-end mt-4 gap-x-4">
            <div
              className="px-4 py-2 border-r-2 border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-md transition-all duration-200 group"
              onClick={onDelete}
            >
              <Trash2Icon className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors duration-200" />
            </div>
            <div className="flex items-center gap-3 px-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Required</span>
              <Switch
                checked={required}
                onCheckedChange={(checked) => {
                  onRequiredChange?.(checked);
                }}
              />
            </div>
          </div>
    
          <FormOptionsToolkit 
            ref={textRef} 
            elementId={id}
          />
        </div>
  )
}

export default MultiChoiceComponent