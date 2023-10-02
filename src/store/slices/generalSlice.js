import { createSlice,createAsyncThunk} from '@reduxjs/toolkit'
import { addFileToDatabase } from './myFilesSlice';
import { changeFileRouteNameDB, returnFile,deleteFileFromDatabase,downloadFileFromDatabase } from './filePageSlice';
import axios from 'axios';

const serverUrl = process.env.REACT_APP_SERVER_URL

export const getCurrentTime = createAsyncThunk("genral/getCurrentTime", async (req, {rejectWithValue}) => {
  const results = await axios({
    method: "GET",
    url: serverUrl + "getServerTime", // route name
  })
  .catch((err)=>{
    const error = {
        type: "error",
        msg: "Something went wrong."
    }
    return rejectWithValue(error)
  })
  return results.data.dateNow
});

const initialState = {
  progress: {
    uploadValue: 0,
    downloadValue: 0
  },
  alert: {
    type: {},
    msg: {}
  },
  time: {
    currentTime : {}
  },
  user: {
    info: {
      isAnon: true,
      email:'',
      token: null,
      id: ''
    },
    trigger: 0,
  }
}

export const generalSlice = createSlice({
  name: 'general',
  initialState,
  reducers: {
    changeUploadProgressValue: (state,action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.progress.uploadValue = action.payload
    },
    changeDownloadProgressValue: (state,action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.progress.downloadValue = action.payload
    },
    setAlert: (state,action) => {
      state.alert = action.payload
    },
    setUser: (state,action) => {
      state.user.info = action.payload
    },
    setUserTrigger: (state,action) => {
      state.user.trigger += 1
    }
  },
    extraReducers: {
      [getCurrentTime.fulfilled]: (state, action) => {
        state.time.currentTime = action.payload
      },
      [getCurrentTime.rejected]: (state, action) => {
        state.alert = action.payload
      },
      [addFileToDatabase.rejected]: (state, action) => {
        state.alert = action.payload
      },
      [returnFile.rejected]: (state, action) => {
        state.alert = action.payload
      },
      [changeFileRouteNameDB.rejected]: (state, action) => {
        state.alert = action.payload
      },
      [changeFileRouteNameDB.fulfilled]: (state, action) => {
        state.alert = {type:"success",msg:"Route is succesfully changed."}
      },
      [deleteFileFromDatabase.rejected]: (state, action) => {
        state.alert = action.payload
      },
      [deleteFileFromDatabase.fulfilled]: (state, action) => {
        state.alert = action.payload
        console.log(action.payload)
      },
      [downloadFileFromDatabase.rejected]: (state, action) => {
        state.alert = action.payload
      }
  }
})

// Action creators are generated for each case reducer function
export const { changeUploadProgressValue , changeDownloadProgressValue,setAlert,setUser,setUserTrigger } = generalSlice.actions

export default generalSlice.reducer
