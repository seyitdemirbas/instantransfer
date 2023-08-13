import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import Parse from 'parse';
import { editFileRoute, removeFile } from './myFilesSlice';
import { changeDownloadProgressValue } from "./generalSlice";

export const returnFile = createAsyncThunk("filepage/returnFile", async (req, {rejectWithValue,dispatch}) => {
  const fileObject = Parse.Object.extend("routes");
  const query = new Parse.Query(fileObject);
  query.equalTo("routeName", req);
  query.include("fileObjectRelation");
  const results = await query.find().then((res)=>{
      if(!(res.length === 0)){
        const createdBy = res[0].get("fileObjectRelation").get("createdBy").id
        const publicStatus = res[0].get("fileObjectRelation").get("publicStatus")
        if((publicStatus === false && createdBy === Parse.User.current().id) || publicStatus === true) {
          const data = {
            id : res[0].get("fileObjectRelation").id,
            fileName: res[0].get("fileObjectRelation").get("fileName"),
            fileSize: res[0].get("fileObjectRelation").get("fileSize"),
            fileType: res[0].get("fileObjectRelation").get("fileTypeMime"),
            fileRoute: res[0].get("routeName"), 
            createdAt: res[0].get("fileObjectRelation").get("createdAt").toJSON(),
            expiresAt: res[0].get("fileObjectRelation").get("expiresAt").toJSON(),
            createdBy: res[0].get("fileObjectRelation").get("createdBy").id,
            isPrivate: !res[0].get("fileObjectRelation").get("publicStatus")
          }
          return data;
        }else{
          const data = {
            isPrivate: !res[0].get("fileObjectRelation").get("publicStatus")
          }
          return data;
        }
    }else{
      // const error = {
      //     type: "error",
      //     msg: "There is no such file this route."
      // }
      // return rejectWithValue()
      return {}
    }
  }).catch((err)=>{
    // console.log(err)
    const error = {
        type: "error",
        msg: "Something went wrong."
    }
    return rejectWithValue(error)
  })

  const data = await results;
  return data
});

export const changeFileRouteNameDB = createAsyncThunk("filepage/changeFileRouteNameDB", async (params, {rejectWithValue,dispatch}) => {
  const results = Parse.Cloud.run('changeFileRouteName',params)
  .then((res)=>{
      const data = res.get("routeName")
      const route = {
        oldroute: params.currentRouteName,
        newroute: data
      }
      dispatch(editFileRoute(route))
      return data
  })
  .catch((err)=>{
      const error = {
        type: "error",
        msg: err.message
      }
      return rejectWithValue(error)
  })
  const data = await results;
  return data
});

export const deleteFileFromDatabase = createAsyncThunk("filepage/deleteFileFromDatabase", async (params, {rejectWithValue,dispatch}) => {
  const results = Parse.Cloud.run('deleteFile',params)
  .then((res)=>{
      const data = {
        type : "success",
        msg: res
      }
      dispatch(resetCurrentFile())
      dispatch(removeFile(params.routeName))
      
      return (params.isMultiple ? '' : data)
  })
  .catch((err)=>{
      const error = {
        type: "error",
        msg: err.message
      }
      return rejectWithValue(error)
  })
  const data = await results;
  return data
});

export const downloadFileFromDatabase = createAsyncThunk("filepage/downloadFileFromDatabase", async (id, {rejectWithValue,dispatch}) => {
  var object = Parse.Object.extend("files");
  var query = new Parse.Query(object);
  const results = query.get(id)
  .then(async (resFile)=>{
    // console.log(resFile.get("file").url())
    const fileUrl = await resFile.get("file").url()
    const response = await fetch(fileUrl);
    const contentLength = response.headers.get('content-length');
    const total = parseInt(contentLength, 10);
    let loaded = 0;

    const resBlob = new Response(new ReadableStream({
      async start(controller) {
        const reader = response.body.getReader();
        for (;;) {
          const {done, value} = await reader.read();
          if (done) break;
          loaded += value.byteLength;
          dispatch(changeDownloadProgressValue(Math.round(loaded/total*100)))
          controller.enqueue(value);
        }
        controller.close();
      },
    }));

    const data = await resBlob.blob();
    return data
  })
  .catch((err)=>{
      const error = {
        type: "error",
        msg: "Download Failed : Some error occured."
      }
      return rejectWithValue(error)
  })
  const data = await results;
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

