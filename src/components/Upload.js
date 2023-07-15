import React, {useEffect, useRef} from 'react'
import { Label, FileInput, Progress} from 'flowbite-react';
import { addFileToDatabase } from '../store/slices/myFilesSlice';
import { useDispatch,useSelector} from 'react-redux'
import { changeUploadProgressValue } from "../store/slices/generalSlice";
import {useComponentDidMount} from "./useComponentDidMount"
import { useNavigate } from 'react-router';
// import Parse from 'parse';
import ButtonWithLoading from './ButtonWithLoading';
import ReCpatcha from './ReCpatcha';

function Upload() {
const inputRef = useRef(null)
const dispatch = useDispatch()
const progressValue = useSelector((state) => state.general.progress.uploadValue)
const submitLoading = useSelector((state) => state.myFiles.loading.value)
const uploadDoneNavigationRoute = useSelector((state) => state.myFiles.navigation.uploadDone.route)
const isComponentMounted = useComponentDidMount();
const navigate = useNavigate()
const recaptchaRef = useRef(null);


useEffect(() => {
  if(isComponentMounted) {
    navigate(uploadDoneNavigationRoute)
    dispatch(changeUploadProgressValue(0))
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [uploadDoneNavigationRoute])


const handleSubmit = (e) => {
    e.preventDefault();
    // dispatch(changeProgressValue(0))
    const inputRefs = {
      cpatchaValue : recaptchaRef.current.getValue(),
      fileRef : inputRef
    }
    dispatch(addFileToDatabase(inputRefs))
}

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div id="fileUpload">
      <div className="mb-2 block">
          <Label
              htmlFor="file"
              value="Upload a file (Max 20 Mb)"
              className='text-base'
          />
        </div>
          <FileInput
          id="file"
          helperText="Select a file and transfer your file over the web between devices in seconds"
          ref={inputRef}
          />
      </div>
          <ReCpatcha recaptchaRef={recaptchaRef}/>
          <ButtonWithLoading loadingState={submitLoading} buttonName='Submit'/>
      </form>
      
      <div className='mt-2'>
        {progressValue > 0 && submitLoading &&
          <Progress
            labelProgress
            labelText
            progress={progressValue}
            progressLabelPosition="outside"
            textLabel="Uploading..."
            textLabelPosition="outside"
          />
        }
      </div>
    </React.Fragment>
  )
}

export default Upload