import React,{useState,useEffect} from 'react'
import Parse from 'parse'
import { AiOutlineLink,AiFillEdit} from 'react-icons/ai';
import { Button, Tooltip, TextInput,Spinner } from 'flowbite-react'
import { IconContext } from "react-icons";
import { changeFileRouteNameDB } from '../store/slices/filePageSlice';
import { useDispatch } from 'react-redux';
import { useComponentDidMount } from './useComponentDidMount';
import { useNavigate } from 'react-router';
import { setAlert } from '../store/slices/generalSlice';

const ChangeFileRoute = (props) => {
    const [isShown, setIsShown] = useState(false);
    const [newRouteName, setNewRouteName] = useState(""); // useState hook
    const dispatch = useDispatch()
    const isComponentMounted = useComponentDidMount()
    const navigate = useNavigate()

    const locationHost = (window.location.host.indexOf('www.') && window.location.host) || window.location.host.replace('www.', '')
    const locationPathName = window.location.pathname;
    const cleanUrl = locationHost + locationPathName


    const handleClick = event => {
      setIsShown(current => !current);
    };

    const handleChange = (e) => {
        e.preventDefault(); // prevent the default action
        const LowerCasedRoute = e.target.value.toLowerCase()
        setNewRouteName(LowerCasedRoute); // set name to e.target.value (event)
    };
    
    const handleSubmit = (e) => {
        e.preventDefault()
        const params =  { currentRouteName: props.currentFile.fileRoute, newRouteName: e.target[0].value };
        dispatch(changeFileRouteNameDB(params))
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href)
        dispatch(setAlert({type:"success",msg:"Copied."}))
    }

    useEffect(() => {
        if(isComponentMounted) {
          navigate("/" + props.navigation, { replace: true })
          setIsShown()
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [props.navigation])
    

  return (
    <div className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        <div className='flex items-center'>
            <div>
                <IconContext.Provider value={{ size:"1.3em", color: "#9ca3af", className: "mr-2" }}>
                    <AiOutlineLink/>
                </IconContext.Provider>
            </div>
            {!isShown &&
                <div onClick={handleCopy} className='truncate'>
                    <Tooltip content="Click to Copy">
                        <a className='hover:text-gray-500' onClick={(e) => {e.preventDefault()}} href={window.location.href}>{cleanUrl}</a>
                    </Tooltip>
                </div>
            }
            {/* { props.currentFile.createdBy === Parse.User.current().id && */
            <React.Fragment>
                {!isShown &&
                    <div onClick={handleClick} className='cursor-pointer'>
                        <Tooltip content="Click to change route">
                            <IconContext.Provider value={{ size:"1.2em", color: "#9ca3af", className: "hover:!text-[#12b3c0] pulse ml-2" }}>
                                <AiFillEdit/>
                            </IconContext.Provider>
                        </Tooltip>
                    </div>
                }
                {isShown &&
                    <form className='flex items-center' onSubmit={e=>handleSubmit(e)}>
                        <TextInput className='!text-xs'
                            id="routerInput"
                            sizing="sm"
                            required={true}
                            placeholder={props.currentFile.fileRoute}
                            autoFocus
                            addon={locationHost + "/"}
                            onChange={handleChange}
                            value={newRouteName}
                        />
                        <Button disabled={props.Loading.routeChangeValue ? true : false} type="submit" size="xs">
                        {props.Loading.routeChangeValue
                        ? <div className="mr-3">
                            <Spinner
                            size="sm"
                            light={true}
                            />
                        </div>
                        : "Change"
                        }
                        </Button>
                    </form>
                }
            </React.Fragment>
            }
        </div>
    </div>
  )
}

export default ChangeFileRoute