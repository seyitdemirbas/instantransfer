import React, { useEffect, useState } from 'react'
import { Navbar,Dropdown,Avatar, Toast } from 'flowbite-react';
import { IconContext } from "react-icons";
import { HiExclamation } from 'react-icons/hi';
import { NavLink, Link} from 'react-router-dom'
import logo from '../logo.png';
import { useSelector,useDispatch } from 'react-redux';
import { setAlert, setUserTrigger } from '../store/slices/generalSlice';
import Parse from 'parse';
import { resetRecentFileList } from '../store/slices/myFilesSlice';


function Header() {
    const userInfoState = useSelector((state) => state.general.user.info)
    const isAnon = useSelector((state) => state.general.user.info.isAnon)
    const [isShown, setIsShown] = useState(false)
    const [isFetch, setIsFetch] = useState(false)
    const isVerified = isFetch ? (Parse.User.current() ? Parse.User.current().get('emailVerified') : true) : true
    const dispatch = useDispatch()

    // console.log(Parse.User.currentAsync() && Parse.User.currentAsync().get('emailVerified'))

    useEffect(() => {
        const fetchCurrentUserDB = async () =>{
            Parse.User.current().fetch()
            .then(res=>setIsFetch(true))
            .catch(err=>console.log(err))
        }
        fetchCurrentUserDB()
    }, []);
    
    useEffect(()=>{
        !isVerified ? setIsShown(true) : setIsShown(false)
    },[isVerified])

    let NavbarLinkClassName = "block py-2 pr-4 pl-3 md:p-0 border-b border-gray-100  text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-white";
    let NavbarLinkClassNameActive = "block py-2 pr-4 pl-3 md:p-0 bg-blue-700 text-white dark:text-white md:bg-transparent md:text-blue-700"

    const handleLogOut = () => {
        Parse.User.logOut()
        .then((res)=>{
            dispatch(resetRecentFileList())
            dispatch(setUserTrigger())
        })
        .catch(()=>{
            const error = {
                type: "error",
                msg: "Something went wrong."
            }
            dispatch(setAlert(error))
        })
    }

    const handleVerifyRequest = async (e) => {
        e.preventDefault();
        const email = Parse.User.current().get('email')
        await Parse.User.requestEmailVerification(email)
        .then((res)=>{
            setIsShown(false)
            const error = {
                type: "success",
                msg: "Email verification request sended."
            }
            dispatch(setAlert(error))
        })
        .catch((err)=>{
            const error = {
                type: "error",
                msg: err.message
            }
            dispatch(setAlert(error))
        })
    }

  return (
    <React.Fragment>
        {!isAnon && isShown && 
            <Toast className='bg-orange-300 rounded-b-lg rounded-tl-none rounded-tr-none mx-2 w-auto max-w-none'>
                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
                    <IconContext.Provider value={{ color: "orange"}}>
                        <HiExclamation/>
                    </IconContext.Provider>
                </div>
                <div className="text-black ml-3 text-sm font-normal">
                    Your email address is not verified. Please check your email adress: <span className='font-bold'>{userInfoState.email}</span>. If you have not received a verification email, <span className='font-bold cursor-pointer hover:text-[#1f2937]' onClick={handleVerifyRequest}>click here for resend</span>.
                </div>
                <Toast.Toggle />
            </Toast>
        }
        <Navbar
        fluid={true}
        rounded={true}
        >
            <Navbar.Brand href='/'>
                <img
                    src={logo}
                    className="mr-3 h-6 sm:h-9"
                    alt="Site Logo"
                />
                <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white hover:text-blue-700">
                    {Parse.Config.current().get('SiteName')}
                </span>
            </Navbar.Brand>
            <div className="flex md:order-2">
            <Dropdown
                arrowIcon={false}
                inline={true}
                label={<Avatar alt="User settings" rounded={true}/>}
            >
                <Dropdown.Header>
                <span className="block text-sm">
                    {
                    userInfoState.isAnon ? 'Anonymous' : userInfoState.username
                    }
                </span>
                {
                    userInfoState.isAnon ? '' : <span className="block truncate text-sm font-medium">{userInfoState.email}</span>
                }
                </Dropdown.Header>
                { userInfoState.isAnon &&
                    <React.Fragment>
                        <Link to="static/register">
                            <Dropdown.Item>Register</Dropdown.Item>
                        </Link>
                        <Link to="static/login">
                            <Dropdown.Item>Login</Dropdown.Item>
                        </Link>
                    </React.Fragment>
                }
                { !userInfoState.isAnon &&
                    <React.Fragment>
                        <Link to="static/settings">
                            <Dropdown.Item>Settings</Dropdown.Item>
                        </Link>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={handleLogOut}>
                        Sign out
                        </Dropdown.Item>
                    </React.Fragment>
                }
            </Dropdown>
            <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                <li>
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive ? NavbarLinkClassNameActive : NavbarLinkClassName
                        }
                        end>
                        Upload
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="static/recentfiles"
                        className={({ isActive }) =>
                            isActive ? NavbarLinkClassNameActive : NavbarLinkClassName
                        }
                        end>
                        Recent Files
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="static/contact"
                        className={({ isActive }) =>
                            isActive ? NavbarLinkClassNameActive : NavbarLinkClassName
                        }
                        end>
                        Contact Us
                    </NavLink>
                </li>
                <li>
                <NavLink
                    to="static/about"
                    className={({ isActive }) =>
                        isActive ? NavbarLinkClassNameActive : NavbarLinkClassName
                    }
                    end>
                    About
                </NavLink>
                </li>
                    
            </Navbar.Collapse>
        </Navbar>
    </React.Fragment>
  )
}

export default Header