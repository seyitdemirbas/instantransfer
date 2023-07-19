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
    const recaptchaRef = useRef(null);
    const [loading, setloading] = useState(false);

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
        <h1 className='font-medium text-gray-900 dark:text-gray-300 mb-2'>Register the site</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
                <div className="mb-2 block">
                <Label
                    htmlFor="email"
                    value="Your email"
                />
                </div>
                <TextInput
                id="email"
                type="email"
                placeholder="name@mail.com"
                required={true}
                shadow={true}
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
                />
            </div>
            <div>
                <div className="mb-2 block">
                <Label
                    htmlFor="password"
                    value="Your password"
                />
                </div>
                <TextInput
                id="password"
                type="password"
                required={true}
                shadow={true}
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
                />
            </div>
            <ReCpatcha recaptchaRef={recaptchaRef}/>
            <ButtonWithLoading loadingState={loading} buttonName='Register new account'/>
        </form>
    </React.Fragment>
  )
}

export default Register