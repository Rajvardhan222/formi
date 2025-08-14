import { createSlice } from "@reduxjs/toolkit";

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
  responses: { elementId: string; value: string }[];
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

      console.log("updating state value inside reducer", elementId, value);
      const existingResponseIndex = state.responses.findIndex(
        (response: { elementId: string; value: string }) =>
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
  },
});

export const { setFormStore, updateFormResponse } = responseFormSlice.actions;

export default responseFormSlice.reducer;
