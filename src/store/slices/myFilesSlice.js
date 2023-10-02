import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { changeUploadProgressValue } from "./generalSlice";
import axios from 'axios';


const serverUrl = process.env.REACT_APP_SERVER_URL

export const addFileToDatabase = createAsyncThunk("myfiles/addFileToDatabase", async (req, {getState,rejectWithValue,dispatch}) => {
    const file = req.fileRef.current.files[0]
    const isPrivate = req.isPrivate
    const captchaValue = req.captchaValue
    const token = getState().general.user.info.token

    if(!file) {
        const error = {
            type: "warning",
            msg: "Not selected a file"
        }
        return rejectWithValue(error)
    }

    if(file.size > 20971520) {
        const error = {
            type: "warning",
            msg: "File Size is too large. MAX 20Mb"
        }
        return rejectWithValue(error)
    }

    if(!captchaValue) {
        const error = {
            type: "warning",
            msg: "Please verify you are not robot"
        }
        return rejectWithValue(error)
    }

    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    bodyFormData.append('isPrivate', isPrivate);

    var config = {
        "Content-Type": "multipart/form-data",
            "captchavalue": `${captchaValue}`,
        ...(token && {'x-access-token' : token})
        }

    const results = await axios({
        headers: config,
        method: "POST",
        data: bodyFormData,
        url: serverUrl + "upload", // route name
        onUploadProgress: progress => {
            const { total, loaded } = progress;
            const totalSizeInMB = total / 1000000;
            const loadedSizeInMB = loaded / 1000000;
            const uploadPercentage = (loadedSizeInMB / totalSizeInMB) * 100;
            dispatch(changeUploadProgressValue(uploadPercentage.toFixed(2)))
        },
        encType: "multipart/form-data",
    })
    .then((res)=>{
        const {data} = res
        const datas = {
            id : data.id,
            filename : data.originalname,
            filetype: data.mimetype,
            fileroute: data.route,
            filesize: data.size,
            filepath: data.path,
            expiresat: data.expiredate,
            addeddate: data.date,
            isPrivate: data.isPrivate
        }
        dispatch(changeUploadProgressValue(0))
        return datas
    })
    .catch((err)=>{
        console.log(err)
        const error = {
            type: "error",
            msg: err.response ? err.response.data.error : 'Something went wrong'
        }
        return rejectWithValue(error)
    })

    const data = results;
    return data
});

export const getFilesFromDatabase = createAsyncThunk("myfiles/getFilesFromDatabase", async (req, {getState,rejectWithValue,dispatch}) => {
    const token = getState().general.user.info.token
    const results = axios({
        method: "GET",
        headers: {
            "x-access-token" : token
        },
        url: serverUrl + "getFiles", // route name
    })
    .then((res)=>{
        const {data} = res
        const files = [];
        data.forEach(async (item)=>{ 
            const file = {
                id : item._id,
                filename : item.originalname,
                filetype: item.mimetype,
                fileroute: item.route,
                filesize: item.size,
                filepath: item.path,
                expiresat: item.expiredate,
                addeddate: item.date,
                isPrivate: item.isPrivate
            }
            files.push(file)
        })
        return files
    })
    .catch((err)=>{
        const error = {
            type: "error",
            msg: "Something went wrong."
        }
        return rejectWithValue(error)
    })

    const data = await results;
    return data
});


const initialState = {
    recentfilelist: [],
    loading : {
        value: false,
        recentFilesValue: false
    },
    navigation: {
        uploadDone: {
          route: {}
        }
    },
    isRendered: {
        value: false
    }
}

export const myFilesSlice = createSlice({
  name: 'myfiles',
  initialState,
  reducers: {
    addFile: (state,action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      return state.recentfilelist.concat(action.payload)
    },
    removeFile: (state, action) => {
        return {
            ...state,
            recentfilelist: state.recentfilelist.filter((file) => {
                return file.id !== action.payload
            }
            ) 
        };
    },
    editFileRoute: (state, action) => {
        return {
            ...state,
            recentfilelist: state.recentfilelist.map(file => file.fileroute === action.payload.oldroute ?
                // transform the one with a matching id
                { ...file, fileroute: action.payload.newroute } : 
                // otherwise return original todo
                file
            ) 
        };
    },
    setNavigationRoute: (state,action) => {
      state.navigation.uploadDone.route = action.payload
    },
    setIsRendered: (state,action) => {
      state.isRendered.value = action.payload
    },
    resetRecentFileList: (state) => {
        state.recentfilelist = []
    }
  },
  extraReducers: {
        [addFileToDatabase.pending]: (state, action) => {
            state.loading.value = true
        },
        [addFileToDatabase.fulfilled]: (state, action) => {
            if (state.isRendered.value === true ) {
                state.recentfilelist.unshift(action.payload)
            }
            state.loading.value = false
            state.navigation.uploadDone.route = action.payload.fileroute
        },
        [addFileToDatabase.rejected]: (state, action) => {
            state.loading.value = false
        },
        [getFilesFromDatabase.pending]: (state, action) => {
            state.loading.recentFilesValue = true
        },
        [getFilesFromDatabase.fulfilled]: (state, action) => {
            state.loading.recentFilesValue = false
            state.recentfilelist.push(...action.payload)
        },
        [getFilesFromDatabase.rejected]: (state, action) => {
            state.loading.recentFilesValue = false
        }
    }
})

// Action creators are generated for each case reducer function
export const { editFileRoute ,addFile,setNavigationRoute,setIsRendered,removeFile,resetRecentFileList } = myFilesSlice.actions

export default myFilesSlice.reducer