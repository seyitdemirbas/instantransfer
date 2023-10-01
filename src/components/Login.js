import React,{useState} from 'react'
import { TextInput } from 'flowbite-react'
import { useDispatch } from 'react-redux'
import { HiMail,HiLockClosed } from 'react-icons/hi';
import { setAlert } from '../store/slices/generalSlice'
import { setUserTrigger } from '../store/slices/generalSlice';
import Parse from 'parse'
import { resetRecentFileList, setIsRendered } from '../store/slices/myFilesSlice';
import { Link } from 'react-router-dom'
import ButtonWithLoading from './ButtonWithLoading';
import SEO from './HelmetSeo'

const Login = () => {
    const dispatch = useDispatch()
    const [loading, setloading] = useState(false);
    // const siteName = Parse.Config.current().get('SiteName')
    const siteName = 'site name'

    const handleSubmit = async (e) => {
        e.preventDefault();
        setloading(true)
        const email = e.target['emailOrUsername'].value
        const password = e.target['password1'].value

        if(!email || !password) {
            setloading(false)
            dispatch(setAlert({type:"warning",msg:'Do not leave any blank space.'}))
          }else {
            // Parse.User.logIn(email,password)
            // .then((res)=>{
            //     setloading(false)
            //     dispatch(setAlert({type:"success",msg:"Login Successful. Welcome "+res.get("username")}))
            //     dispatch(resetRecentFileList())
            //     dispatch(setIsRendered(false))
            //     dispatch(setUserTrigger())
            // })
            // .catch((err)=>{
            //     setloading(false)
            //     e.target['password1'].focus()
            //     dispatch(setAlert({type:"error",msg:err.message}))
            // })
        }
    }

  return (
    <React.Fragment>
        <SEO
        title= {siteName + ' | Login the Site'}
        description={'A section on the website that login the site. You can login with email or username and password.'}
        name={siteName}
        type='article' />
        <h1 className='font-medium text-gray-900 dark:text-gray-300 mb-2'>Login the site</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
                <div className="mb-2 block">
                </div>
                <TextInput
                id="emailOrUsername"
                icon={HiMail}
                placeholder="name@mail.com or username"
                required={true}
                />
            </div>
            <div>
                <div>
                </div>
                <TextInput
                id="password1"
                type="password"
                icon={HiLockClosed}
                placeholder="password"
                required={true}
                />
            </div>
            {/* <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember">
                Remember me
                </Label>
            </div> */}
            <div className='flex items-center gap-2'>
                <Link className='text-base	font-normal text-gray-900 dark:text-gray-300 md:hover:text-blue-700' to="/static/forgotpassword">
                    Forgot Password?
                </Link>
            </div>
            <ButtonWithLoading loadingState={loading} buttonName='Login'/>
        </form>
    </React.Fragment>
  )
}

export default Login