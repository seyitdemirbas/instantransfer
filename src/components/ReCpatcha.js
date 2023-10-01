import React from 'react'
import ReCAPTCHA from "react-google-recaptcha";
import Parse from 'parse';

function ReCpatcha(props) {
  return (
    <ReCAPTCHA
    ref={props.recaptchaRef}
    sitekey= {process.env.REACT_APP_CPATCHA_SITE_KEY}
    />  
  )
}

export default ReCpatcha