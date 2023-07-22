import React, { useEffect } from 'react'
import { useDispatch,useSelector } from 'react-redux';
import { useParams} from 'react-router-dom'
import { returnFile } from '../store/slices/filePageSlice';
import { AiOutlineLoading3Quarters} from 'react-icons/ai';
import { IconContext } from "react-icons";
import { Card, Progress} from 'flowbite-react'
import GetMimeToIcon from './GetMimeToIcon';
import { formatBytes, getRemainingTime} from './generalFunctions';
import { getCurrentTime } from '../store/slices/generalSlice';  
import ChangeFileRoute from './ChangeFileRoute';
import { FilePageDownload } from './FilePageDownload';
import {FilePageDelete} from './FilePageDelete';
import Parse from 'parse';
import NotFound from './NotFound';


function FilePage(props) {
    const { RouterName } = useParams();
    const dispatch = useDispatch();
    const Loading = useSelector((state) => state.filePage.loading)
    const currentFile = useSelector((state) => state.filePage.currentFile)
    const currentTime = useSelector((state) => state.general.time.currentTime)
    const navigationState = useSelector((state) => state.filePage.navigation.routeChangeDone.route)
    const progressValue = useSelector((state) => state.general.progress.downloadValue)

    useEffect(() => {
        const fetchFile = async () => {
            if(!(currentFile.fileRoute === RouterName)){
                dispatch(getCurrentTime())
                dispatch(returnFile(RouterName))
            }
        }

        fetchFile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    if (!Loading.value) {
        if(!(Object.keys(currentFile).length === 0)) {
            return (
                <React.Fragment>
                <Card>
                    <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        <div className='flex'>
                        <div>
                            <IconContext.Provider value={{ size:"1.3em", color: "#9ca3af", className: "mr-2" }}>
                                <GetMimeToIcon mimeType={currentFile.fileType}/>
                            </IconContext.Provider>
                        </div>
                        <span className='truncate'>{currentFile.fileName}</span>
                        </div>
                    </h5>
                    <ChangeFileRoute currentFile={currentFile} Loading={Loading} navigation={navigationState}/>
                    <p className="font-normal text-gray-700 dark:text-gray-400">
                        <span className='font-bold'>File Size:</span> {formatBytes(currentFile.fileSize)}
                    </p>
                    <p className="font-normal text-gray-700 dark:text-gray-400">
                        <span className='font-bold'>Expires At:</span> {currentFile.expiresAt && getRemainingTime(currentFile.expiresAt,currentTime)}
                    </p>
                    {Object.keys(currentFile).length > 0 &&
                        <FilePageDownload currentFile={currentFile} Loading={Loading}/>
                    }
                    {progressValue > 0 && Loading.downloadFileValue &&
                        <Progress
                        labelProgress
                        labelText
                        progress={progressValue}
                        progressLabelPosition="outside"
                        textLabel="Downloading..."
                        textLabelPosition="outside"
                        />
                    }
                </Card>
                {currentFile.createdBy === Parse.User.current().id &&
                    <div className='mt-2 inline-block float-right'>
                        <FilePageDelete fileRoute={currentFile.fileRoute} Loading={Loading}/>
                    </div>
                }
                </React.Fragment>
            )
        }else{
            return(
                <NotFound title='Looks like there is no file in this route.' />
            )
        }
    }else{
        return (
            <IconContext.Provider value={{ color: "blue", className: "rotateIcon", size:"7em" }}>
                <div className="flex justify-items-center items-center h-80">
                    <div className="m-auto">
                        <AiOutlineLoading3Quarters/>
                    </div>
                </div>
            </IconContext.Provider>
        )
    }
    
}

export default FilePage