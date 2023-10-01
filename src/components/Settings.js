import React, { useRef,useState } from 'react'
import { Label,TextInput } from 'flowbite-react'
import Parse from 'parse'
import { setAlert } from '../store/slices/generalSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import ButtonWithLoading from './ButtonWithLoading';
import { HiLockClosed,HiLockOpen } from 'react-icons/hi';
import SEO from './HelmetSeo'

const Settings = () => {
  const inputRefCurrentPassword = useRef(null)
  const inputRefPassword = useRef(null)
  const inputRefPasswordRepeat = useRef(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setloading] = useState(false);
  // const siteName = Parse.Config.current().get('SiteName')
  const siteName = 'site name'

  const handleSubmit = async (e) => {
      e.preventDefault();
      setloading(true)
      if(!inputRefCurrentPassword.current.value || !inputRefPassword.current.value || !inputRefPasswordRepeat.current.value ) {
        setloading(false)
        dispatch(setAlert({type:"warning",msg:'Do not leave any blank space.'}))
      }else if(!(inputRefPassword.current.value === inputRefPasswordRepeat.current.value)) {
        setloading(false)
        dispatch(setAlert({type:"warning",msg:'New Passwords dont match.'}))
      }else {
      // const user = new Parse.User.current();
      // user.verifyPassword(inputRefCurrentPassword.current.value)
      // .then((res)=>{
      //   user.setPassword(inputRefPassword.current.value)
      //   user.save().then((res)=>{
      //       setloading(false)
      //       dispatch(setAlert({type:"success",msg:"The password has been successfully changed."}))
      //       navigate('/')
      //     }).catch((err)=>{
      //       setloading(false)
      //       dispatch(setAlert({type:"error",msg:err.message}))
      //     })
      // })
      // .catch((err)=>{
      //   setloading(false)
      //   dispatch(setAlert({type:"error",msg:"Your current password is wrong"}))
      //   inputRefCurrentPassword.current.focus();
      //   inputRefCurrentPassword.current.value= '';
      // })
    }
  }
  return (
    <React.Fragment>
      <SEO
        title= {siteName + ' | User Settings'}
        description={'A section on the website that for set settings.'}
        name={siteName}
        type='article' />

      <h1 className='font-medium text-gray-900 dark:text-gray-300 mb-2'>Change Your Password</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <div className="mb-2 block">
          <Label
            htmlFor="current-password"
            value="Current password"
          />
        </div>
        <TextInput
          id="current-password"
          type="password"
          icon={HiLockOpen}
          placeholder='current password'
          required={true}
          shadow={true}
          ref={inputRefCurrentPassword}
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label
            htmlFor="new-password"
            value="New password"
          />
        </div>
        <TextInput
          id="new-password"
          type="password"
          icon={HiLockClosed}
          placeholder='new password'
          required={true}
          shadow={true}
          ref={inputRefPassword}
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label
            htmlFor="repeat-password"
            value="Repeat new password"
          />
        </div>
        <TextInput
          id="repeat-password"
          type="password"
          placeholder='repeat new password'
          icon={HiLockClosed}
          required={true}
          shadow={true}
          ref={inputRefPasswordRepeat}
        />
      </div>
      <ButtonWithLoading loadingState={loading} buttonName='Change Password'/>
    </form>
  </React.Fragment>
  )
}

export default Settings