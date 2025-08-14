import { configureStore } from '@reduxjs/toolkit'
import formSlice from "./features/editslice/editform.slice"
import responseSlice from './features/responseformSlice/ResponseFormSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      Editform: formSlice,
      ResponseForm: responseSlice
    },
    devTools: process.env.NODE_ENV !== 'production', // Explicitly enable Redux DevTools
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']