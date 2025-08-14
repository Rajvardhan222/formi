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
}
const initialState: initialStateType = {
    elements: [],
    formId: null,
    formTitle: '',
    formDescription: '',
    currentEditingElementId: null,

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
    },
    updateFormElementType:(state,action:{payload:{type:componentType}}) => {
        let getId = state?.currentEditingElementId;
        if (!getId) {
          console.error("No current editing element ID found.");
          return;
        }
       

        const elementIndex = state.elements.findIndex(el => el.id === getId);
       

        const newElement = componentTypesStructure[action.payload.type];

        if (elementIndex !== -1 && newElement) {
          state.elements[elementIndex] = { ...state.elements[elementIndex], ...newElement };
        }
    },
    addMultiChoiceFormOption:(state,action) => {
      const { id } = action.payload;
      const element = state.elements.find(el => el.id === id);
      if (element && element.type === "multi_choice") {
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
      if (element && element.type === "multi_choice") {
        if(element.options?.length == 1) return;
        element.options = element.options?.filter(option => option.id !== optionId);
      } else {
        console.error("Element not found or is not a multi-choice type.");
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
      const elementId = action.payload;
      state.elements = state.elements.filter(el => el.id !== elementId);
      if (state.currentEditingElementId === elementId) {
        state.currentEditingElementId = null; // Reset current editing element if deleted
      }
    }

  },
});

// Export the actions so you can use them in your components
export const {
    initialRender,
    updateFormElementType,
    addElement,
    updateTitle,
    updateDescription,
    onQuestionChange,
    onDescriptionChange,
    onRequiredChange,
    deleteElement,
    updateCurrentlyEditingElement,
    addMultiChoiceFormOption,
    deleteMultiChoiceFormOption
} = formSlice.actions;

// Export the reducer to be used in the store
export default formSlice.reducer;