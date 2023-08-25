import React,{useState,useRef} from 'react'
import ButtonWithLoading from './ButtonWithLoading'
import { Label, TextInput,Textarea} from 'flowbite-react'
import { HiMail,HiBookOpen } from 'react-icons/hi';
import Parse from 'parse';
import { useDispatch, useSelector } from 'react-redux'
import { setAlert } from '../store/slices/generalSlice';
import ReCpatcha from './ReCpatcha';
import { useNavigate } from 'react-router';
import SEO from './HelmetSeo'

function ContactUs() {
  const [loading, setloading] = useState(false);
  const recaptchaRef = useRef(null);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const currentUser = Parse.User.current()
  const isAnon = useSelector((state) => state.general.user.info.isAnon)
  const siteName = Parse.Config.current().get('SiteName')

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = isAnon ? e.target['email'].value : currentUser.get('email')
    const subject = e.target['subject'].value
    const message = e.target['message'].value
    const cpatchaValue = recaptchaRef.current.getValue()

    setloading(true)
    if(!email || !subject || !message ) {
      setloading(false)
      dispatch(setAlert({type:"warning",msg:'Do not leave any blank space.'}))
    }
    else if(!cpatchaValue){
      setloading(false)
      dispatch(setAlert({type:"warning",msg:'Please confirm cpatcha'}))
    }
    else{
      const params = {
        email : email,
        subject : subject,
        message : message,
        cpatcha : recaptchaRef.current.getValue()
      }
      await Parse.Cloud.run('contantUs',params)
      .then((res)=>{
        setloading(false)
        dispatch(setAlert({type:"success", msg: res }))
        navigate('/')
      })
      .catch((err)=>{
        setloading(false)
        if(cpatchaValue){
          recaptchaRef.current.reset();
        }
        dispatch(setAlert({type:"error",msg: err.message ? err.message : err }))
      })
    }
  }

  return (
    <React.Fragment>
      <SEO
      title= {siteName + ' | Contact Us'}
      description={'A section on the website that contact to site owner. You can contact us.'}
      name={siteName}
      type='article' />
      <h1 className='font-medium text-gray-900 dark:text-gray-300 mb-2'>Contact Us</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        { isAnon &&
        <div>
          <div className="mb-2 block">
          <Label
              htmlFor="email"
              value="Your email"
          />
          </div>
          <TextInput
          id="email"
          icon={HiMail}
          type="email"
          placeholder="name@mail.com"
          required={true}
          shadow={true}
          />
        </div>
        }
        <div>
          <div className="mb-2 block">
            <Label
                htmlFor="subject"
                value="Subject"
            />
          </div>
          <TextInput
            id="subject"
            type="text"
            icon={HiBookOpen}
            placeholder="Let us know how we can help you"
            required={true}
            shadow={true}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label
              htmlFor="message"
              value="Your message"
            />
          </div>
          <Textarea
            id="message"
            placeholder="Leave a message..."
            required
            rows={5}
          />
        </div>
        <ReCpatcha recaptchaRef={recaptchaRef}/>
        <ButtonWithLoading loadingState={loading} buttonName='Send Message'/>
      </form>
    </React.Fragment>
  )
}

export default ContactUs