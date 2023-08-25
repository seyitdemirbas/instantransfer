import { TextInput} from 'flowbite-react'
import React,{useRef,useState} from 'react'
import { HiMail,HiLockClosed,HiUser } from 'react-icons/hi';
import Parse from 'parse'
import { setAlert } from '../store/slices/generalSlice'
import { setUserTrigger } from '../store/slices/generalSlice';
import { useDispatch } from 'react-redux'
import ReCpatcha from './ReCpatcha';
import ButtonWithLoading from './ButtonWithLoading';
import SEO from './HelmetSeo'

const Register = () => {
    const dispatch = useDispatch()
    const recaptchaRef = useRef(null);
    const [loading, setloading] = useState(false);
    const siteName = Parse.Config.current().get('SiteName')

    const handleSubmit = (e) => {
        e.preventDefault();
        setloading(true)

        const email = e.target['email'].value
        const username = e.target['username'].value
        const password = e.target['password'].value
        const repeatPassword = e.target['repeat-password'].value


        if(!email || !password || !repeatPassword || !username ) {
            setloading(false)
            dispatch(setAlert({type:"warning",msg:'Do not leave any blank space.'}))
          }else if(!(password === repeatPassword)) {
            setloading(false)
            dispatch(setAlert({type:"warning",msg:'Passwords dont match.'}))
          }else if(!recaptchaRef.current.getValue()) {
            setloading(false)
            dispatch(setAlert({type:"warning",msg:'Please confirm cpatcha'}))
          }else {
            const user = new Parse.User.current();
            const cpatchaValue = recaptchaRef.current.getValue();
            user.set("username", username);
            user.set("password", password);
            user.set("email", email);
            user.set("isAnon", false)
            user.set("cpatcha", cpatchaValue ? cpatchaValue : '00' )
            user.signUp()
            .then((res)=>{
                setloading(false)
                dispatch(setAlert({type:"success",msg:"Registration Successful. Welcome "+res.get("username")}))
                dispatch(setUserTrigger())
            })
            .catch((err)=>{
                setloading(false)

                if(err.code === 202) {
                    e.target['username'].focus();
                }

                if(err.code === 203) {
                    e.target['email'].focus();
                }

                if(cpatchaValue){
                    recaptchaRef.current.reset();
                  }
                  
                dispatch(setAlert({type:"error",msg:err.message}))
            })
        }
    }

  return (
    <React.Fragment>
        <SEO
        title= {siteName + ' | Register the Site'}
        description={'A section on the website that register the site. You can register with email, username and password.'}
        name={siteName}
        type='article' />
        <h1 className='font-medium text-gray-900 dark:text-gray-300 mb-2'>Register the site</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
                <div className="mb-2 block">
                </div>
                <TextInput
                id="email"
                type="email"
                icon={HiMail}
                placeholder="name@mail.com"
                required={true}
                shadow={true}
                />
            </div>
            <div>
                <TextInput
                id="username"
                type="username"
                placeholder='username'
                icon={HiUser}
                required={true}
                shadow={true}
                />
            </div>
            <div>
                <TextInput
                id="password"
                icon={HiLockClosed}
                placeholder='password'
                type="password"
                required={true}
                shadow={true}
                />
            </div>
            <div>
                <TextInput
                id="repeat-password"
                type="password"
                icon={HiLockClosed}
                placeholder='repeat password'
                required={true}
                shadow={true}   
                />
            </div>
            <ReCpatcha recaptchaRef={recaptchaRef}/>
            <ButtonWithLoading loadingState={loading} buttonName='Register new account'/>
        </form>
    </React.Fragment>
  )
}

export default Register