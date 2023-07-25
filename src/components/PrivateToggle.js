import React from 'react'
import { ToggleSwitch } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import Parse from 'parse';
import { setAlert } from '../store/slices/generalSlice';

function PrivateToggle(props) {
    const {isPrivate,setIsPrivate,stateType,fileId} = props
    const dispatch = useDispatch()
    const isAnon = useSelector((state) => state.general.user.info.isAnon)

    const onChange = async () =>{
        var object = Parse.Object.extend("files");
        var query = new Parse.Query(object);
        query.get(fileId)
        .then(async (resFile)=>{
            resFile.set("publicStatus", isPrivate)
            resFile.save()
            .then(()=>{dispatch(setIsPrivate())})
        })
    }

    return (
     <div
        className="flex w-auto"
        id="toggle"
    >
        <ToggleSwitch
            label="Make Private"
            onChange={function () {
                    !isAnon 
                    ?
                    (!(stateType==='redux') ? setIsPrivate(current => !current) : onChange())
                    : 
                    dispatch(setAlert({type:"warning",msg: "You can make files private just by logging in."}))
                }
            }
            checked={isPrivate}
        />
    </div>
    )
}

export default PrivateToggle