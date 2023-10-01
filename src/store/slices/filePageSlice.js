import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import Parse from 'parse';
import { editFileRoute, removeFile } from './myFilesSlice';
import { changeDownloadProgressValue } from "./generalSlice";
import axios from 'axios';

const serverUrl = process.env.REACT_APP_SERVER_URL

export const returnFile = createAsyncThunk("filepage/returnFile", async (req, {getState,rejectWithValue,dispatch}) => {
  const results = await axios({
    data: {
      route: req
    },
    method: "POST",
    url: serverUrl + "getFile", // route name
  })
  .then((res)=>{
    const {data} = res
    if(!(res.length === 0)){
      const createdBy = '1234'
      const publicStatus = data.isPrivate
      if((publicStatus === false && createdBy === '1234') || publicStatus === true) {
        const datas = {
          id : data._id,
          fileName: data.originalname,
          fileSize: data.size,
          fileType: data.mimetype,
          fileRoute: data.route, 
          createdAt: data.date,
          filePath: data.path,
          expiresAt: data.expiredate,
          createdBy: '1234',
          isPrivate: data.isPrivate
        }
        return datas;
      }else{
        const data = {
          isPrivate: !data.isPrivate
        }
        return data;
      }
    }else{
      return {}
    }
  })
  .catch((err)=>{
      return {}
  })

  const data = await results;
  return data
});

export const changeFileRouteNameDB = createAsyncThunk("filepage/changeFileRouteNameDB", async (params, {rejectWithValue,dispatch}) => {
  const results = await axios({
    data: {
      currentRoute: params.currentRouteName,
      newRoute: params.newRouteName
    },
    method: "POST",
    url: serverUrl + "changeRouteName", 
  })
  .then((res)=>{
    const route = {
      oldroute: res.data.oldRoute,
      newroute: res.data.newRoute
    }
    dispatch(editFileRoute(route))
    return route.newroute
  })
  .catch((err)=>{
      const error = {
        type: "error",
        msg: err.response ? err.response.data.error : 'Network Error'
      }
      return rejectWithValue(error)
  })
  const data = await results;
  return data
});

export const deleteFileFromDatabase = createAsyncThunk("filepage/deleteFileFromDatabase", async (params, {rejectWithValue,dispatch}) => {
  const results = await axios({
    data: {
      id: params.id
    },
    method: "DELETE",
    url: serverUrl + "deleteFile", 
  })
  .then((res)=>{
      const data = {
        type : "success",
        msg: res.data.success
      }
      dispatch(resetCurrentFile())
      dispatch(removeFile(params.id))
      
      return (params.isMultiple ? '' : data)
  })
  .catch((err)=>{
      const error = {
        type: "error",
        msg: err.response ? err.response.data.error : 'Network Error'
      }
      return rejectWithValue(error)
  })
  const data = results;
  return data
});

export const downloadFileFromDatabase = createAsyncThunk("filepage/downloadFileFromDatabase", async (path, {rejectWithValue,dispatch}) => {
  const resBlob = await axios({
        url: serverUrl + path, //your url
        method: 'GET',
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {

          let percentCompleted = Math.round(progressEvent.loaded * 100 / 
          progressEvent.total);

          dispatch(changeDownloadProgressValue(percentCompleted))
       }
    })
    .then((res)=>{
      dispatch(changeDownloadProgressValue(0))
      return res
    })
    .catch((err)=>{
      const error = {
        type: "error",
        msg: "Some error occured."
      }
      return rejectWithValue(error)
  })

  const data = resBlob.data
  return data
});

const initialState = {
  loading: {
    value: false,
    routeChangeValue: false,
    downloadFileValue: false,
    deleteFileValue: false
  },
  currentFile:{
  },
  navigation: {
    routeChangeDone: {
      route: {}
    }
}
}

export const filePageSlice = createSlice({
  name: 'filepage',
  initialState,
  reducers: {
    changeLoadingValue: (state,action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.loading.value = action.payload
    },
    resetCurrentFile:(state,action)=>{
      state.currentFile = {}
    },
    resetCurrentFileWi:(state,action)=>{
        if(state.currentFile.isPrivate === true){
        return {
          ...state,
          currentFile : {isPrivate : state.currentFile.isPrivate}
        }
      }
    },
    toggleIsPrivate:(state,action)=>{
      state.currentFile.isPrivate = !state.currentFile.isPrivate
    }
  },
  extraReducers: {
      [returnFile.pending]: (state, action) => {
      state.loading.value = true

      },
      [returnFile.fulfilled]: (state, action) => {
      state.loading.value = false
      state.currentFile = action.payload

      },
      [returnFile.rejected]: (state, action) => {
      state.loading.value = false
      },
      [changeFileRouteNameDB.pending]: (state, action) => {
      state.loading.routeChangeValue = true
      },
      [changeFileRouteNameDB.fulfilled]: (state, action) => {
      state.loading.routeChangeValue = false
      state.navigation.routeChangeDone.route = action.payload
      state.currentFile.fileRoute = action.payload
      },
      [changeFileRouteNameDB.rejected]: (state, action) => {
      state.loading.routeChangeValue = false
      },
      [downloadFileFromDatabase.pending]: (state, action) => {
      state.loading.downloadFileValue = true
      },
      [downloadFileFromDatabase.fulfilled]: (state, action) => {
      state.loading.downloadFileValue = false
      },
      [downloadFileFromDatabase.rejected]: (state, action) => {
      state.loading.downloadFileValue = false
      },
      [deleteFileFromDatabase.pending]: (state, action) => {
      state.loading.deleteFileValue = true
      },
      [deleteFileFromDatabase.fulfilled]: (state, action) => {
      state.loading.deleteFileValue = false
      },
      [deleteFileFromDatabase.rejected]: (state, action) => {
      state.loading.deleteFileValue = false
      }
  }
})

// Action creators are generated for each case reducer function
export const { changeLoadingValue,resetCurrentFile,toggleIsPrivate,resetCurrentFileWi } = filePageSlice.actions

export default filePageSlice.reducer

