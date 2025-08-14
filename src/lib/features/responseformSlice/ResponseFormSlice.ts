import { createSlice } from "@reduxjs/toolkit";

type initialStateType = {
  elements: Array<{
    id: string;
    type: string;
    label: string;
    options?: Array<{ id: string; label: string }>;
    required?: boolean;
    description?: string;
  }>;
  formId: string | null;
  formTitle: string;
  formDescription: string;
  responses: { elementId: string; value: string |  string[] }[];
};
const initialState: initialStateType = {
  elements: [
   
  ],
  formId: null,
  formTitle: "",
  formDescription: "",
  responses: [],
};

export const responseFormSlice = createSlice({
  name: "response-form",
  initialState,
  reducers: {
    setFormStore: (state, action) => {
      // this will run when we get form content from api and update this store

      state.formId = action.payload.formId;
      state.formTitle = action.payload.formTitle;
      state.formDescription = action.payload.formDescription;
      state.elements = action.payload.elements;
    },
    updateFormResponse: (state, actions) => {
      const { elementId, value } = actions.payload;

      
      

      //updating the state value in the state
      const existingResponseIndex = state.responses.findIndex(
        (response: { elementId: string; value: string  }) =>
          response.elementId === elementId
      );

      if (existingResponseIndex > -1) {
        // Update existing response
        state.responses[existingResponseIndex].value = value;
      } else {
        // Add new response
        state.responses.push({ elementId, value });
      }
    },

    addOptionSelect_multichoice: (state,action) => {
      const { optionId,elementId, option } = action.payload;

      const element = state.elements.find((el) => el.id === elementId);

      // check if response is already there
      const existingResponseIndex = state.responses.findIndex(
        (response) => response.elementId === elementId
      );
      console.log("existingResponseIndex", existingResponseIndex);

      //add the response for that elementId or update
      if (existingResponseIndex > -1) {
        // Update existing response
        // check if this option user has olready selected if yes then delete it
        const optionIndex = state.responses[existingResponseIndex].value.findIndex((id) => id === optionId);
        if (optionIndex > -1) {
          state.responses[existingResponseIndex].value.splice(optionIndex, 1);
        } else {
          state.responses[existingResponseIndex] = { elementId, value: [...state.responses[existingResponseIndex].value, optionId] };
        }
      } else {
        // Add new response
        state.responses.push({ elementId, value: [optionId] });
      }
    }
  },
});

export const { setFormStore, updateFormResponse,addOptionSelect_multichoice } = responseFormSlice.actions;

export default responseFormSlice.reducer;
