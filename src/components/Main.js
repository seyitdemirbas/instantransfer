import '../App.css';
import { Outlet} from 'react-router-dom'
import Header from './Header';
import FooterF from './Footer';
import React, {useEffect,useState} from 'react';
import {useComponentDidMount} from "./useComponentDidMount"
import ToastContainerDiv,{ToastAlert} from './ToastAlert';
import { useDispatch, useSelector } from 'react-redux';
import { setAlert, setUser } from '../store/slices/generalSlice';
import { AiOutlineLoading3Quarters} from 'react-icons/ai';
import { IconContext } from "react-icons";
import { useCookies } from 'react-cookie'
import axios from 'axios'


function MainPage() {
  const dispatch = useDispatch()
  const isComponentMounted = useComponentDidMount();
  const alertState = useSelector((state) => state.general.alert)
  const userTriggerState = useSelector((state) => state.general.user.trigger)
  const currentUser = useSelector((state) => state.general.user)
  const [loading, setLoading] = useState(true);
  const [cookies,setCookie,removeCookie] = useCookies(['user_token']);


  useEffect(() => {
    if(isComponentMounted) {
      if(typeof alertState.type === 'string' && typeof alertState.msg === 'string'){
        ToastAlert(alertState.type,alertState.msg)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alertState])

  useEffect(()=>{
    const fetchUser = async () => {
      const serverUrl = process.env.REACT_APP_SERVER_URL
      if(cookies.user_token) {
        await axios({
          method: "GET",
          headers: {
            'x-access-token' : cookies.user_token
          },
          url: serverUrl + "users/getCurrentUser", // route name
        })
        .then((res)=>{
          const userInfo = {
            isAnon : res.data.isanon,
            email : res.data.email ? res.data.email : null,
            token : cookies.user_token,
            id: res.data.user_id
          }
          dispatch(setUser(userInfo))
          setLoading(false);
        })
        .catch((err)=>{
            console.log(err)
            if(err.response.status === 401) {
              removeCookie('user_token')
              const error = {
                  type: "error",
                  msg: "Your User token is expired. Please Re-Login."
              }
              dispatch(setAlert(error))
            }else{
              const error = {
                type: "error",
                msg: "Something went wrong. User info not gathered."
            }
            dispatch(setAlert(error))
            }
            setLoading(false);
        })
      }else{
        await axios({
          method: "GET",
          url: serverUrl + "users/registerAnon", // route name
        })
        .then((res)=>{
          console.log(res)
          const userInfo = {
            isAnon : res.data.isanon,
            token : res.data.token,
            id: res.data._id
          }
          setCookie('user_token', res.data.token, {path : '/', maxAge : 259200})
          dispatch(setUser(userInfo))
          setLoading(false);
        })
        .catch((err)=>{
            const error = {
                type: "error",
                msg: "Something went wrong. User info not gathered."
            }
            dispatch(setAlert(error))
            setLoading(false);
        })
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
    <React.Fragment>
      <ToastContainerDiv />
      <div className="Main min-h-screen flex flex-col">
          <Header/>
          <div className="container mx-auto p-3">
              <Outlet/>
          </div>
          <div className='grow shrink-0 box-border'></div>
          <FooterF/>
      </div>
    </React.Fragment>
  );
}

export default MainPage;
