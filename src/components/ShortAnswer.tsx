import React, { useRef } from "react";
import { Input } from "./ui/input";
import { ExampleCombobox as Compobobox } from "./ui/Combobox";
import { Trash2Icon } from "lucide-react";
import { Switch } from "./ui/switch";
import FormOptionsToolkit from "./ui/FormOptionsToolkit";
import { useAppDispatch } from "@/lib/hooks";
import { updateCurrentlyEditingElement } from "@/lib/features/editslice/editform.slice";

type Props = {
  viewMode: "admin" | "user";
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
};

// Utility function for easy console logging with template literals
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lg = (...args: any[]) => console.log(...args);

const ShortAnswer = ({
  viewMode,
  question = "",
  description = "",
  required = false,
  onQuestionChange,
  onDescriptionChange,
  onRequiredChange,
  onDelete,
  value = "",
  onValueChange,
  isCurrentlyEditing,
  id,
}: Props) => {
  const [showDescription, setShowDescription] = React.useState(true);
  const textRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  if (viewMode === "user") {
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
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              {description}
            </p>
          )}

          <Input
            type="text"
            placeholder="Your answer"
            value={value}
            onChange={(e) => onValueChange?.(e.target.value)}
            className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
          />
        </div>
      </div>
    );
  }

  // Admin view
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
        <Compobobox />
      </div>
      <div className="w-full h-4"></div>
      <hr className="w-full border-gray-200 dark:border-gray-700" />
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
  );
};

export default ShortAnswer;
