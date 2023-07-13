import { configureStore } from '@reduxjs/toolkit'
import generalSlice from './slices/generalSlice'
import myFilesSlice from './slices/myFilesSlice'
import filePageSlice from './slices/filePageSlice'


export const store = configureStore({
  reducer: {
    general: generalSlice,
    myFiles: myFilesSlice,
    filePage: filePageSlice
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: {
      // Ignore these action types
      ignoredActions: ['filepage/downloadFileFromDatabase/fulfilled']
    },
  }),
})