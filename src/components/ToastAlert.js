import React from 'react'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ToastAlert = (type,text) => {
    var types = ['info','success','warning','error','default']
    Array.prototype.contains = function(element){
      return this.indexOf(element) > -1;
    };
    if(types.contains(type)){
      if(type && text) {
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
}


const ToastContainerDiv = () => {
  return (
    <React.Fragment>
        <ToastContainer/>
    </React.Fragment>
  )
}

export default ToastContainerDiv;