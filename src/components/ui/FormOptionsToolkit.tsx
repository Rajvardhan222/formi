import React, { useEffect, useState } from "react";
import { addElement, copyElement } from "@/lib/features/editslice/editform.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Copy } from "lucide-react";

type Props = {
  ref?: React.RefObject<HTMLDivElement>;
  elementId?: string;
};

const FormOptionsToolkit = ({ ref, elementId }: Props) => {
  const [position, setPosition] = useState({ top: 0, left: 0, height: 0 });
  
  const dispatch = useAppDispatch();
  const currentEditingElementId = useAppSelector(
    (state) => state.Editform.currentEditingElementId
  );
  const allElements = useAppSelector((state) => state.Editform.elements);

  useEffect(() => {
    const updatePosition = () => {
      if (ref?.current && currentEditingElementId === elementId) {
        const rect = ref.current.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        setPosition({
          top: rect.top ,
          left: rect.right + scrollLeft + 16,
          height: rect.height,
        });
      }
    };

    // Only update position if this element is currently being edited
    if (currentEditingElementId === elementId) {
      updatePosition();

      // Add event listeners
      window.addEventListener("scroll", updatePosition);
      window.addEventListener("resize", updatePosition);

      return () => {
        window.removeEventListener("scroll", updatePosition);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [ref, currentEditingElementId, elementId, allElements.length]);

  function addNewComponentToForm() {
    const currentElement = allElements.find(
      (element) => element.id === currentEditingElementId
    );
    if (currentElement) {
      dispatch(
        addElement({
          type: currentElement.type,
          label: "Questions ",
          required: false,
          currentEditingElementId: currentElement.id,
        })
      );
    }
  }

  function handleCopyElement() {
    const currentElement = allElements.find(
      (element) => element.id === currentEditingElementId
    );
    if (currentElement) {
      dispatch(
        copyElement({
          id: currentEditingElementId,
        })
      );
    }
  }

  // Only render if this element is currently being edited and ref exists
  if (!ref?.current || currentEditingElementId !== elementId) return null;

  return (
    <div
      className="fixed z-50 flex w-20 flex-col gap-y-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 justify-start items-center scale-95 p-3 rounded-lg shadow-xl backdrop-blur-sm"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        minHeight: `${Math.max(position.height, 60)}px`,
        // Ensure minimum height
      }}
    >
      {/* plus lucid icon inside circle */}
      <div
        className="flex items-center justify-center w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-full cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300 border-2 border-gray-200 dark:border-gray-600 group shadow-sm hover:shadow-md"
        onClick={addNewComponentToForm}
        title="Add new element"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </div>

      {/* copy icon inside circle */}
      <div
        className="flex items-center justify-center w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-full cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300 border-2 border-gray-200 dark:border-gray-600 group shadow-sm hover:shadow-md"
        title="Copy element"
        onClick={handleCopyElement}
      >
        <Copy className="h-6 w-6 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
      </div>
    </div>
  );
};

export default FormOptionsToolkit;
