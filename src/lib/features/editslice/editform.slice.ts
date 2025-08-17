// lib/features/form/formSlice.js

import { createSlice } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid'; // For generating unique IDs

let componentTypesStructure= {
  "short_answer":{
    label: "Short Question",
    description: "description",
    required: false,
    type: "short_answer"

  },
  "multi_choice": {
   
    label: "Multiple Choice Question",
    description: "description",
    required: false,
    type: "multi_choice",
    options: [{id: nanoid(), label: "option 1"}],
  },
  "single_choice": {
    label: "Single Choice Question",
    description: "description",
    required: false,
    type: "single_choice",
    options: [{id: nanoid(), label: "option 1"}],
  }
}

type componentType = keyof typeof componentTypesStructure;

type initialStateType = {
    elements: Array<{
        id: string;
        type: componentType;
        label: string;
        options?: Array<{id: string; label: string}>;
        required?: boolean;
        description?: string;
    }>;
    formId: string | null;
    formTitle: string;
    formDescription: string;
    currentEditingElementId: string | null;
    isPublished: boolean;
    isPublishing: boolean;
}
const initialState: initialStateType = {
    elements: [],
    formId: null,
    formTitle: '',
    formDescription: '',
    currentEditingElementId: null,
    isPublished: false,
    isPublishing: false,
};

export const formSlice = createSlice({
  name: 'edit-form',
  initialState,
  // Reducers define how to update the state
  reducers: {
    initialRender: (state, action) => {
      state.formId = action.payload.formId;
      state.formTitle = action.payload.formTitle || "Untitled Form";
      state.formDescription = action.payload.formDescription || "No Description";
      state.elements = action.payload.elements || [];
      state.isPublished = action.payload.is_published || false;
    },
    updateFormElementType:(state,action:{payload:{type:componentType}}) => {
        let getId = state?.currentEditingElementId;
        if (!getId) {
          console.error("No current editing element ID found.");
          return;
        }

        const elementIndex = state.elements.findIndex(el => el.id === getId);
        
        if (elementIndex !== -1) {
          const currentElement = state.elements[elementIndex];
          const newElementStructure = componentTypesStructure[action.payload.type];
          
          console.log("New Element Structure: ", newElementStructure);

          // Only update the type and add missing properties, preserve existing data
          state.elements[elementIndex] = { 
            ...currentElement, // Keep existing data
            type: action.payload.type, // Update type
            // Only add options if the new type needs them and current element doesn't have them
            ...('options' in newElementStructure && !currentElement.options ? { options: newElementStructure.options } : {})
          };
        }
    },
    addMultiChoiceFormOption:(state,action) => {
      const { id } = action.payload;
      const element = state.elements.find(el => el.id === id);
      if (element && element.type === "multi_choice" || element.type === "single_choice") {
        if (!element.options) {
          element.options = [];
        }
        element.options.push({
          id: nanoid(),
          label: "Option " + (element.options.length + 1)
        });
      } else {
        console.error("Element not found or is not a multi-choice type.");
      }
    },
    deleteMultiChoiceFormOption:(state, action) => {
      const { id, optionId } = action.payload;
      const element = state.elements.find(el => el.id === id);
      if (element && element.type === "multi_choice" || element.type === "single_choice") {
        if(element.options?.length == 1) return;
        element.options = element.options?.filter(option => option.id !== optionId);
      } else {
        console.error("Element not found or is not a multi-choice type.");
      }
    },
    editOptionMultipleFormOption:(state,action) => {
      const { id, optionId, label } = action.payload;
      const element = state.elements.find(el => el.id === id);
      if (element && element.type === "multi_choice" || element.type === "single_choice") {
        const option = element.options.find(opt => opt.id === optionId);
        if (option) {
          option.label = label;
        }
      }  
    },
    addElement: (state, action) => {
      const newElement = {
        id: nanoid(),
        type: action.payload.type,
        label: action.payload.label || '',
        description: action.payload.description || '',
        options: action.payload.options || [],
        required: action.payload.required || false,
      };
      //add the new element just below the currently editing element not at the end
      if (action.payload.currentEditingElementId) {
        const currentIndex = state.elements.findIndex(el => el.id === action.payload.currentEditingElementId);
        if (currentIndex !== -1) {
          state.elements.splice(currentIndex + 1, 0, newElement);
        } else {
          state.elements.push(newElement); // Fallback if current editing element not found
        }
      } else {
        // If no current editing element, just add to the end
        state.elements.push(newElement);
      }
      state.currentEditingElementId = newElement.id;
    },
    copyElement:(state,action) => {
        let {id} = action.payload;
        console.log("Copying element with ID:", id);
        console.log("Current elements:", state.elements);
        
        const elementIndex = state.elements.findIndex(el => el.id === id);
        console.log("Found element at index:", elementIndex);
        
        if (elementIndex !== -1) {
          const element = state.elements[elementIndex];
          console.log("Element to copy:", element);
          
          // Create a deep copy of the element
          const copiedElement = {
            ...element,
            id: nanoid(),
            // If element has options, deep copy them with new IDs
            options: element.options ? element.options.map(option => ({
              ...option,
              id: nanoid()
            })) : element.options
          };
          
          console.log("Copied element:", copiedElement);
          
          // Insert the copied element right after the original
          state.elements.splice(elementIndex + 1, 0, copiedElement);
          
          // Set the copied element as currently editing
          state.currentEditingElementId = copiedElement.id;
          
          console.log("Elements after copy:", state.elements);
        } else {
          console.error("Element with ID", id, "not found in elements array");
        }
    },
    updateCurrentlyEditingElement: (state, action) => {
       const {id} = action.payload;
     
       const element = state.elements.find(el => el.id === id);
       if (element) {
         state.currentEditingElementId = element.id;
         
       }
    },

    updateTitle: (state, action) => {
      state.formTitle = action.payload;
    },
    updateDescription: (state, action) => {
      state.formDescription = action.payload;
    },
    onQuestionChange: (state, action) => {
      const { id, question } = action.payload;
      const element = state.elements.find(el => el.id === id);
      if (element) {
        element.label = question;
      }
    },
    onDescriptionChange: (state, action) => {
      const { id, description } = action.payload;
      const element = state.elements.find(el => el.id === id);
      if (element) {
        element.description = description;
      }
    },
    onRequiredChange: (state, action) => {
      const { id, required } = action.payload;
      const element = state.elements.find(el => el.id === id);
      if (element) {
        element.required = required;
      }
    },
    deleteElement: (state, action) => {
      if(state.elements.length == 1) return;
      const elementId = action.payload;
      state.elements = state.elements.filter(el => el.id !== elementId);
      if (state.currentEditingElementId === elementId) {
        state.currentEditingElementId = null; // Reset current editing element if deleted
      }
    },
    publishForm: (state) => {
      state.isPublishing = true;
    },
    publishFormSuccess: (state) => {
      state.isPublished = true;
      state.isPublishing = false;
    },
    publishFormError: (state) => {
      state.isPublishing = false;
    },
    unpublishForm: (state) => {
      state.isPublishing = true;
    },
    unpublishFormSuccess: (state) => {
      state.isPublished = false;
      state.isPublishing = false;
    },
    unpublishFormError: (state) => {
      state.isPublishing = false;
    }

  },
});

// Export the actions so you can use them in your components
export const {
    initialRender,
    updateFormElementType,
    addElement,
    editOptionMultipleFormOption,
    updateTitle,
    updateDescription,
    onQuestionChange,
    onDescriptionChange,
    onRequiredChange,
    deleteElement,
    updateCurrentlyEditingElement,
    addMultiChoiceFormOption,
    deleteMultiChoiceFormOption,
    copyElement,
    publishForm,
    publishFormSuccess,
    publishFormError,
    unpublishForm,
    unpublishFormSuccess,
    unpublishFormError
} = formSlice.actions;

// Export the reducer to be used in the store
export default formSlice.reducer;