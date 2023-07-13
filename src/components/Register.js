import { Label, TextInput} from 'flowbite-react'
import React,{useRef,useState} from 'react'
import Parse from 'parse'
import { setAlert } from '../store/slices/generalSlice'
import { setUserTrigger } from '../store/slices/generalSlice';
import { useDispatch } from 'react-redux'
// import { useNavigate } from 'react-router'
import ReCpatcha from './ReCpatcha';
import ButtonWithLoading from './ButtonWithLoading';

const Register = () => {
    const dispatch = useDispatch()
    // const navigate = useNavigate()
    const inputRefEmail = useRef(null)
    const inputRefUsername = useRef(null)
    const inputRefPassword = useRef(null)
    const inputRefPasswordRepeat = useRef(null)
    const recaptchaRef = useRef(null);
    const [loading, setloading] = useState(false);


    const handleSubmit = (e) => {
        e.preventDefault();
        setloading(true)
        if(!inputRefEmail.current.value || !inputRefPassword.current.value || !inputRefPasswordRepeat.current.value ) {
            setloading(false)
            dispatch(setAlert({type:"warning",msg:'Do not leave any blank space.'}))
          }else if(!(inputRefPassword.current.value === inputRefPasswordRepeat.current.value)) {
            setloading(false)
            dispatch(setAlert({type:"warning",msg:'Passwords dont match.'}))
          }else if(!recaptchaRef.current.getValue()) {
            setloading(false)
            dispatch(setAlert({type:"warning",msg:'Please confirm cpatcha'}))
          }else {
            const user = new Parse.User.current();
            const cpatchaValue = recaptchaRef.current.getValue();
            user.set("username", inputRefUsername.current.value);
            user.set("password", inputRefPassword.current.value);
            user.set("email", inputRefEmail.current.value);
            user.set("isAnon", false)
            user.set("cpatcha", cpatchaValue ? cpatchaValue : '00' )
            user.signUp()
            .then((res)=>{
                setloading(false)
                dispatch(setAlert({type:"success",msg:"Registration Successful. Welcome "+res.get("username")}))
                dispatch(setUserTrigger())
                // navigate("/", {replace : true})
            })
            .catch((err)=>{
                setloading(false)

                if(err.code === 202) {
                    inputRefUsername.current.focus();
                }

                if(err.code === 203) {
                    inputRefEmail.current.focus();
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
        <h1 className='font-medium text-gray-900 dark:text-gray-300 mb-2'>Register the site</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
                <div className="mb-2 block">
                <Label
                    htmlFor="email2"
                    value="Your email"
                />
                </div>
                <TextInput
                id="email2"
                type="email"
                placeholder="name@mail.com"
                required={true}
                shadow={true}
                ref={inputRefEmail}
                />
            </div>
            <div>
                <div className="mb-2 block">
                <Label
                    htmlFor="username"
                    value="Your username"
                />
                </div>
                <TextInput
                id="username"
                type="username"
                required={true}
                shadow={true}
                ref={inputRefUsername}
                />
            </div>
            <div>
                <div className="mb-2 block">
                <Label
                    htmlFor="password2"
                    value="Your password"
                />
                </div>
                <TextInput
                id="password2"
                type="password"
                required={true}
                shadow={true}
                ref={inputRefPassword}
                />
            </div>
            <div>
                <div className="mb-2 block">
                <Label
                    htmlFor="repeat-password"
                    value="Repeat password"
                />
                </div>
                <TextInput
                id="repeat-password"
                type="password"
                required={true}
                shadow={true}
                ref={inputRefPasswordRepeat}
                />
            </div>
            <ReCpatcha recaptchaRef={recaptchaRef}/>
            <ButtonWithLoading loadingState={loading} buttonName='Register new account'/>
        </form>
    </React.Fragment>
  )
}

export default Register