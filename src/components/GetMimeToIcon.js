import {FaFileAudio,FaFileVideo,FaFileCode} from "react-icons/fa"
import {AiFillFileImage,AiFillFileText,AiFillFile,AiFillFileZip } from 'react-icons/ai';
import {BsFillGearFill} from "react-icons/bs"
import React from 'react'

export const getIconFromMIME = (mimeType) => {
    // List of official MIME Types: http://www.iana.org/assignments/media-types/media-types.xhtml
    var icon_classes = {
      // Media
      image: AiFillFileImage,
      audio: FaFileAudio,
      video: FaFileVideo,
      empty: AiFillFile,
      // Documents
      "application/pdf": AiFillFileText,
      "application/msword": AiFillFileText,
      "application/vnd.ms-word": AiFillFileText,
      "application/vnd.oasis.opendocument.text": AiFillFileText,
      "application/vnd.openxmlformats-officedocument.wordprocessingml":
        AiFillFileText,
      "application/vnd.ms-excel": AiFillFileText,
      "application/vnd.openxmlformats-officedocument.spreadsheetml":
        AiFillFileText,
      "application/vnd.oasis.opendocument.spreadsheet": AiFillFileText,
      "application/vnd.ms-powerpoint": AiFillFileText,
      "application/vnd.openxmlformats-officedocument.presentationml":
        AiFillFileText,
      "application/vnd.oasis.opendocument.presentation": AiFillFileText,
      "text/plain": AiFillFileText,
      "text/html": FaFileCode,
      "text/javascript": FaFileCode,
      "application/json": FaFileCode,
      "application/x-msdownload" : BsFillGearFill,
      // Archives
      "application/gzip": AiFillFileZip,
      "application/x-gzip": AiFillFileZip,
      "application/x-zip-compressed": AiFillFileZip,
      "application/zip": AiFillFileZip,
      "application/octet-stream": AiFillFile
      
    };
  
    for (var key in icon_classes) {
      if (icon_classes.hasOwnProperty(key)) {
        if (mimeType.search(key) === 0) {
          return icon_classes[key];
        }
      } else {
        return AiFillFile;
      }
    }
  }

const GetMimeToIcon = (props) => {
  const SpecificStory = getIconFromMIME(props.mimeType);
  if (SpecificStory) {
    return <SpecificStory/>
  }else{
    const SpecificStory = AiFillFile
    return <SpecificStory/>
  }
}

export default GetMimeToIcon