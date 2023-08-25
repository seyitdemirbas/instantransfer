import React from 'react'
import { Button,Spinner} from 'flowbite-react'
import { IconContext } from "react-icons";
import {BsDownload} from "react-icons/bs"
import { downloadFileFromDatabase } from '../store/slices/filePageSlice';
import { useDispatch } from 'react-redux';
import * as fileSaver from "file-saver";

export const FilePageDownload = (props) => {
    const dispatch = useDispatch()

    const handleDownload = async () => {
        const fileId = props.currentFile.id
        const fileMimeType = props.currentFile.fileType
        const fileName = props.currentFile.fileName
        const fileBlob = await dispatch(downloadFileFromDatabase(fileId))
        if(downloadFileFromDatabase.fulfilled.match(fileBlob)) {
            const blob = fileBlob.payload
            const file = new File([blob], fileName, { type: fileMimeType });
            fileSaver.saveAs(file);
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
