import React, { useRef } from "react";
import { Input } from "./ui/input";
import { ExampleCombobox as Compobobox } from "./ui/Combobox";
import { Trash2Icon } from "lucide-react";
import { Switch } from "./ui/switch";
import FormOptionsToolkit from "./ui/FormOptionsToolkit";

type Props = {
  viewMode: 'admin' | 'user';
  question?: string;
  description?: string;
  required?: boolean;
  onQuestionChange?: (question: string) => void;
  onDescriptionChange?: (description: string) => void;
  onRequiredChange?: (required: boolean) => void;
  onDelete?: () => void;
  // For user mode - response handling
  value?: string;
  onValueChange?: (value: string) => void;
};

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
}: Props) => {
  const [showDescription, setShowDescription] = React.useState(true);
  const textRef = useRef<HTMLDivElement>(null);

  if (viewMode === 'user') {
    return (
      <div className="w-full py-4 px-6 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col">
          <div className="flex items-center gap-1 mb-2">
            <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">
              {question || "Question"}
            </h3>
            {required && <span className="text-red-500">*</span>}
          </div>
          
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {description}
            </p>
          )}
          
          <Input
            type="text"
            placeholder="Your answer"
            value={value}
            onChange={(e) => onValueChange?.(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
    );
  }

  // Admin view
  return (
    <div className="w-full py-4 px-6 bg-zinc-100 dark:bg-zinc-800 rounded-lg shadow-md" ref={textRef}>
      <div className="flex gap-4">
        <div className="flex flex-col w-full">
          <Input
            type="text"
            placeholder="Question"
            value={question}
            onChange={(e) => onQuestionChange?.(e.target.value)}
          />

          {showDescription && (
            <Input
              type="text"
              placeholder="Description (optional)"
              className="mt-2"
              value={description}
              onChange={(e) => onDescriptionChange?.(e.target.value)}
            />
          )}
        </div>
        <Compobobox />
      </div>
      <div className="w-full h-10"></div>
      <br className="w-full mx-10 bg-gray-600" />
      <div className="flex justify-end mt-4 gap-x-4">
        <div className="px-6 border-r-2 border-gray-300 dark:border-gray-600 cursor-pointer" onClick={onDelete}>
          <Trash2Icon className="h-6 w-6" />
        </div>
        <div className="flex items-center gap-2">
          <span>Required</span>
          <Switch
            checked={required}
            onCheckedChange={(checked) => {
             
              onRequiredChange?.(checked);
            }}
          />
        </div>
      </div>

      <FormOptionsToolkit ref={textRef} />
    </div>
  );
};

export default ShortAnswer;
