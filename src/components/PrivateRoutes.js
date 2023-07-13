import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux';

const PrivateRoutes = () => {
    const isAnon = useSelector((state) => state.general.user.info.isAnon)
    return (
        !! isAnon ? <Navigate to="static/login" replace={true}/> : <Outlet/> 
    )
}

export default PrivateRoutes