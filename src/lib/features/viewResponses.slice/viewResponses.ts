import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

// Types for our responses
export interface FormAnswer {
  type: string;
  question: string;
  answer: string | string[] | null;
}

export interface FormResponseItem {
  responseId: string;
  submittedAt: string;
  answers: FormAnswer[];
}

type initialStateType = {
  responses: FormResponseItem[];
  formTitle: string;
  totalResponses: number;
  formId: string | null;
  loading: boolean;
  error: string | null;
  selectedResponseId: string | null;
};

const initialState: initialStateType = {
  responses: [],
  formTitle: '',
  totalResponses: 0,
  formId: null,
  loading: false,
  error: null,
  selectedResponseId: null,
};

export const viewResponsesSlice = createSlice({
  name: 'viewResponses',
  initialState,
  reducers: {
    fetchResponsesPending: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchResponsesSuccess: (state, action) => {
      state.loading = false;
      state.responses = action.payload.responses;
      state.formTitle = action.payload.formTitle;
      state.totalResponses = action.payload.totalResponses;
      state.formId = action.payload.formId;
      state.error = null;
    },
    fetchResponsesError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    selectResponse: (state, action: PayloadAction<string>) => {
      state.selectedResponseId = action.payload;
    },
    clearResponses: (state) => {
      state.responses = [];
      state.formTitle = '';
      state.totalResponses = 0;
      state.formId = null;
      state.error = null;
      state.selectedResponseId = null;
    }
  },
});

// Export actions
export const { 
  fetchResponsesPending, 
  fetchResponsesSuccess, 
  fetchResponsesError, 
  selectResponse, 
  clearResponses 
} = viewResponsesSlice.actions;

// Export selectors
export const selectAllResponses = (state: RootState) => state.viewResponses.responses;
export const selectResponsesLoading = (state: RootState) => state.viewResponses.loading;
export const selectResponsesError = (state: RootState) => state.viewResponses.error;
export const selectFormTitle = (state: RootState) => state.viewResponses.formTitle;
export const selectTotalResponses = (state: RootState) => state.viewResponses.totalResponses;
export const selectFormId = (state: RootState) => state.viewResponses.formId;
export const selectSelectedResponseId = (state: RootState) => state.viewResponses.selectedResponseId;
export const selectSelectedResponse = (state: RootState) => {
  const selectedId = state.viewResponses.selectedResponseId;
  return selectedId 
    ? state.viewResponses.responses.find((response) => response.responseId === selectedId)
    : null;
};

// Export columns helper for use in table
export const getResponseColumns = (responses: FormResponseItem[]) => {
  if (!responses.length) return [];
  
  // Get all unique question names from all responses
  const questionSet = new Set<string>();
  
  responses.forEach(response => {
    response.answers.forEach(answer => {
      questionSet.add(answer.question);
    });
  });
  
  // Create columns array for table
  const columns = [
    {
      id: 'date',
      header: 'Submission Date',
      accessorFn: (row: FormResponseItem) => {
        const date = new Date(row.submittedAt);
        return date.toLocaleString();
      },
    }
  ];
  
  // Add a column for each unique question
  questionSet.forEach(question => {
    columns.push({
      id: question.replace(/\s+/g, '_').toLowerCase(),
      header: question,
      accessorFn: (row: FormResponseItem) => {
        const answerObj = row.answers.find(a => a.question === question);
        if (!answerObj) return '—';
        
        const answer = answerObj.answer;
        if (Array.isArray(answer)) {
          return answer.join(', ');
        }
        return answer || '—';
      }
    });
  });
  
  return columns;
};

export default viewResponsesSlice.reducer;
