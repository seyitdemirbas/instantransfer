import React from 'react'
import { Button,Spinner} from 'flowbite-react'
import { IconContext } from "react-icons";
import {BsDownload} from "react-icons/bs"
import { downloadFileFromDatabase } from '../store/slices/filePageSlice';
import { useDispatch } from 'react-redux';
// import { removeExtension } from './generalFunctions';
import * as fileSaver from "file-saver";
import { setAlert } from '../store/slices/generalSlice';

export const FilePageDownload = (props) => {
    const dispatch = useDispatch()

    const handleDownload = async () => {
        const fileId = props.currentFile.id
        const fileMimeType = props.currentFile.fileType
        // const fileName = removeExtension(props.currentFile.fileName)
        const fileName = props.currentFile.fileName
        // const fileExtension = props.currentFile.fileName.slice((props.currentFile.fileName.lastIndexOf(".") - 1 >>> 0) + 2)
        const fileBlob = await dispatch(downloadFileFromDatabase(fileId))
        if(fileBlob) {
            // const blob = base64ToBlob(base64.payload, fileMimeType);
            const blob = fileBlob.payload
            const file = new File([blob], fileName, { type: fileMimeType });
            fileSaver.saveAs(file);
        }else{
            const alertData = {
                type:"error",
                msg:"Download Failed : Some error occured."
            }
            dispatch(setAlert(alertData))
        }
    }

    return (
    <React.Fragment>
        <Button gradientMonochrome="teal" disabled={props.Loading.downloadFileValue ? true : false} onClick={handleDownload}>
            {props.Loading.downloadFileValue
            ?
            <div className="mr-3">
                <Spinner
                size="sm"
                light={true}
                />
            </div>
            :
            <React.Fragment>
                Download
                <IconContext.Provider value={{ size:"1.2em", className: "ml-2" }}>
                    <BsDownload/>
                </IconContext.Provider>
            </React.Fragment>
            }
        </Button>
    </React.Fragment>
    )
}
