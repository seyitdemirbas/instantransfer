import React from 'react'
import { Outlet, Navigate} from 'react-router-dom'
import { useSelector } from 'react-redux';

const PublicRoutes = () => {
    const isAnon = useSelector((state) => state.general.user.info.isAnon)
    return (
        !! isAnon ? <Outlet/> : <Navigate to="/" replace={true}/>
    )
}

export default PublicRoutes