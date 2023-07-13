import React from 'react'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ToastAlert = (type,text) => {
    if(type) {
      toast[type](text, {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
      });
    }
}


const ToastContainerDiv = () => {
  return (
    <div>
        <ToastContainer/>
    </div>
  )
}

export default ToastContainerDiv;