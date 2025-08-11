// lib/features/form/formSlice.js

import { createSlice } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid'; // For generating unique IDs

type initialStateType = {
    elements: Array<{
        id: string;
        type: string;
        label: string;
        options?: Array<string>;
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
    addElement: (state, action) => {
      const newElement = {
        id: nanoid(),
        type: action.payload.type,
        label: action.payload.label || '',
        description: action.payload.description || '',
        options: action.payload.options || [],
        required: action.payload.required || false,
      };
      state.elements.push(newElement);
      state.currentEditingElementId = newElement.id;
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
    addElement,
    updateTitle,
    updateDescription,
    onQuestionChange,
    onDescriptionChange,
    onRequiredChange,
    deleteElement,
} = formSlice.actions;

// Export the reducer to be used in the store
export default formSlice.reducer;