import React,{useRef,useState} from 'react'
import { Label, TextInput } from 'flowbite-react';
import { HiMail } from 'react-icons/hi';
import Parse from 'parse';
import { setAlert } from '../store/slices/generalSlice';    
import { useDispatch } from 'react-redux';
import ButtonWithLoading from './ButtonWithLoading';
import { useNavigate } from 'react-router';


function ForgotPassword() {
    const emailRef = useRef(null);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    console.log('test')

    const requestPasswordReset = (e) => {
        e.preventDefault();
        setLoading(true)
        const email = e.target['email'].value;
        Parse.User.requestPasswordReset(email)
        .then(() => {
            setLoading(false)
            dispatch(setAlert({type:"success",msg:"if this email registered the reset link has been sended"}))
            navigate("/static/login", {replace : true})
        }).catch((error) => {
        // Show the error message somewhere
            setLoading(false)
            e.target['email'].focus()
            dispatch(setAlert({type:"error",msg:error.message}))
        });
    }


    return (
        <React.Fragment>
        <h1 className='font-medium text-gray-900 dark:text-gray-300 mb-2'>Forgot your password?</h1>
            <form onSubmit={requestPasswordReset} className="flex flex-col gap-3">
                <div>
                    <div className="mb-2 block">
                    <Label
                        htmlFor="email"
                        value="Your email"
                    />
                    </div>
                    <TextInput
                    icon={HiMail}
                    id="email"
                    placeholder="name@mail.com"
                    required
                    type="email"
                    ref={emailRef}
                    />
                </div>
                <ButtonWithLoading loadingState={loading} buttonName='Send Password Reset Email'/>
            </form>
        </React.Fragment>
    )
}

export default ForgotPassword