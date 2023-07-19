import '../App.css';
// import { useSelector, useDispatch } from 'react-redux'
import { Outlet} from 'react-router-dom'
import Header from './Header';
import FooterF from './Footer';
import Parse from 'parse';
import React, {useEffect,useState} from 'react';
// import { ToastContainer } from 'react-toastify';
import {useComponentDidMount} from "./useComponentDidMount"
import ToastContainerDiv,{ToastAlert} from './ToastAlert';
import { useDispatch, useSelector } from 'react-redux';
import { setAlert, setUser } from '../store/slices/generalSlice';
import { AiOutlineLoading3Quarters} from 'react-icons/ai';
import { IconContext } from "react-icons";



function MainPage() {
  const dispatch = useDispatch()
  const isComponentMounted = useComponentDidMount();
  const alertState = useSelector((state) => state.general.alert)
  const userTriggerState = useSelector((state) => state.general.user.trigger)
  const currentUser = Parse.User.current()
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(isComponentMounted) {
      ToastAlert(alertState.type,alertState.msg)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alertState])

  useEffect(()=>{

    const fetchUser = async () => {

      await Parse.Config.get()

      if(!currentUser) {
        await Parse.AnonymousUtils.logIn()
        .then((res)=>{
          res.set("isAnon", true)
          res.save()
          const userInfo = {
            isAnon: true,
          }
          dispatch(setUser(userInfo))
          setLoading(false);
        })
        .catch((err)=>{
            const error = {
                type: "error",
                msg: "Something went wrong."
            }
            dispatch(setAlert(error))
            setLoading(false);
        })
      }else if(currentUser.get('isAnon')){
        const userInfo = {
          isAnon: true
        }
        dispatch(setUser(userInfo))
        setLoading(false);
      }
      else{
        const userInfo = {
          isAnon: false,
          username: currentUser.get('username'),
          email: currentUser.get('email')
        }
        dispatch(setUser(userInfo))
        setLoading(false);
        console.log(currentUser)
      }
    }

    fetchUser()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[userTriggerState])

  if(loading) return (
    <div className="Main">
      <IconContext.Provider value={{ color: "blue", className: "rotateIcon", size:"7em" }}>
      <div className="flex h-screen">
          <div className="m-auto">
              <AiOutlineLoading3Quarters/>
          </div>
      </div>
      </IconContext.Provider>
    </div>
  );
  
  return (
    <div className="Main min-h-screen flex flex-col">
        <Header/>
        <div className="container mx-auto p-3">
            <Outlet/>
        </div>
        <div className='grow shrink-0 box-border'></div>
        <ToastContainerDiv />
        <FooterF/>
    </div>
  );
}

export default MainPage;
