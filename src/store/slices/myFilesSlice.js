import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Parse from "parse";
import { v4 as uuidv4 } from 'uuid';
import { changeUploadProgressValue } from "./generalSlice";

export const addFileToDatabase = createAsyncThunk("myfiles/addFileToDatabase", async (req, {rejectWithValue,dispatch}) => {
    const file = req.fileRef.current.files[0]

    if(!file) {
        const error = {
            type: "warning",
            msg: "There is no file"
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

    if(!req.cpatchaValue) {
        const error = {
            type: "warning",
            msg: "Please do cpatcha"
        }
        return rejectWithValue(error)
    }

    const originalfileName = file.name
    const fileNameId = uuidv4();
    const fileType = file.type

    const fileupload = new Parse.File(fileNameId, file, fileType ? fileType : 'application/octet-stream');
    fileupload.addMetadata('cpatcha', req.cpatchaValue)
    const promise = fileupload.save({
        progress: (progressValue, loaded, total, { type }) => {
            if (type === "upload" && progressValue !== null) {
            let progressValueFinal = Math.floor(progressValue * 100)
            dispatch(changeUploadProgressValue(progressValueFinal))
            }
        }
    })
    .then((result)=>{
        const data = result.name();
        return data;
    })
    .catch((err)=>{
        const errorMessageString = JSON.stringify(err)
        const errorMessageObject = JSON.parse(errorMessageString)
        const error = {
            type: "error",
            msg: errorMessageObject.message
        }
        return rejectWithValue(error)
    })

    const promise1 = await promise

    if(promise1.hasOwnProperty('payload') && promise1.payload.type === 'error') {
        const data = await promise;
        return data
    }else {
        const GameScore = Parse.Object.extend("files");
        const query = new Parse.Query(GameScore);
        query.equalTo("routerFileName", promise1);
        const results = query.find()
        .then((res)=>{
            function removeExtension(filename) {
                return filename.substring(0, filename.lastIndexOf('.')) || filename;
            }
            res[0].set("fileName", originalfileName)
            res[0].set("fileNameWithoutExt", removeExtension(originalfileName))
            res[0].save();
            const data = {
                id : res[0].id,
                filename : res[0].get("fileName"),
                filetype: res[0].get("fileTypeMime"),
                fileroute: res[0].get("FirstRouteName"),
                filesize: res[0].get("fileSize"),
                expiresat: res[0].get("expiresAt").toJSON(),
                addeddate: res[0].get("createdAt").toJSON(),
            }
            return data;
        })
        .catch((err)=>{
            // console.log(err)
            const error = {
                type: "error",
                msg: "Something went wrong. 2"
            }
            return rejectWithValue(error)
        })

        const data = await results;
        return data
    }
});

export const getFilesFromDatabase = createAsyncThunk("myfiles/getFilesFromDatabase", async (req, {rejectWithValue,dispatch}) => {
    const user = Parse.User.current();
    if(user) {
    const fileObject = Parse.Object.extend("routes");
    const query = new Parse.Query(fileObject);
    query.include("fileObjectRelation");
    query.equalTo("createdBy", user);
    query.descending('updatedAt');
    const results = query.find()
    .then((res)=>{
        const files = [];
        res.forEach(async (item)=>{
            const file = {
                id : item.get("fileObjectRelation").id,
                filename : item.get("fileObjectRelation").get("fileName"),
                filetype: item.get("fileObjectRelation").get("fileTypeMime"),
                fileroute: item.get("routeName"),
                filesize: item.get("fileObjectRelation").get("fileSize"),
                expiresat: item.get("fileObjectRelation").get("expiresAt").toJSON(),
                addeddate: item.get("fileObjectRelation").get("createdAt").toJSON(),
            }
            
            files.push(file)
        })
        
        return files
    })
    .catch((err)=>{
        // console.log(err)
        const error = {
            type: "error",
            msg: "Something went wrong."
        }
        return rejectWithValue(error)
    })


    const data = await results;
    return data
    }
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
                return file.fileroute !== action.payload
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