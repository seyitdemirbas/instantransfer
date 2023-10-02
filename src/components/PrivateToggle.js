import React from 'react'
import { ToggleSwitch } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import { setAlert } from '../store/slices/generalSlice';
import axios from 'axios';

function PrivateToggle(props) {
    const {isPrivate,setIsPrivate,stateType,fileId} = props
    const dispatch = useDispatch()
    const isAnon = useSelector((state) => state.general.user.info.isAnon)
    const token = useSelector((state) => state.general.user.info.token)
    const serverUrl = process.env.REACT_APP_SERVER_URL

    const onChange = async () =>{
        await axios({
            method: "POST",
            data: {
                id: fileId,
                isPrivate : !isPrivate
            },
            headers: {
                'x-access-token': token
            },
            url: serverUrl + "changePrivate", // route name
        })
        .then((res)=>{
            dispatch(setIsPrivate())
        })
        .catch((err)=>{
            // console.log(err)
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