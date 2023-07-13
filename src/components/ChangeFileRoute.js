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
    const dispatch = useDispatch()
    const isComponentMounted = useComponentDidMount()
    const navigate = useNavigate()

    const handleClick = event => {
      // 👇️ toggle shown state
      setIsShown(current => !current);
  
      // 👇️ or simply set it to true
      // setIsShown(true);
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
    <h4 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        <IconContext.Provider value={{ size:"1.3em", color: "#9ca3af", className: "inline-block mr-2 -mt-2" }}>
            <AiOutlineLink/>
        </IconContext.Provider>
        {!isShown &&
            <span className='inline-block'>
                <Tooltip content="Click to Copy">
                    <div onClick={handleCopy}>
                        <a className='hover:text-gray-500' onClick={(e) => {e.preventDefault()}} href={window.location.href}>{window.location.href}</a>
                    </div>
                </Tooltip>
            </span>
        }
        {props.currentFile.createdBy === Parse.User.current().id &&
        <React.Fragment>
            {!isShown &&
                <div onClick={handleClick} className='inline-block cursor-pointer'>
                    <Tooltip content="Click to change route">
                        <IconContext.Provider value={{ size:"1.2em", color: "#9ca3af", className: "hover:!text-[#12b3c0] pulse inline-block ml-2 -mt-1" }}>
                            <AiFillEdit/>
                        </IconContext.Provider>
                    </Tooltip>
                </div>
            }
            {isShown &&
                <span className='inline-block align-text-bottom'>
                <form onSubmit={e=>handleSubmit(e)}>
                    <span className='inline-block'>
                        <TextInput
                            id="routerInput"
                            sizing="sm"
                            required={true}
                            placeholder={props.currentFile.fileRoute}
                            autoFocus
                            addon={window.location.origin+"/"}
                        />
                    </span>
                    <span className='inline-block'>
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
                    </span>
                </form>
            </span>
            }
        </React.Fragment>
        }
    </h4>
  )
}

export default ChangeFileRoute