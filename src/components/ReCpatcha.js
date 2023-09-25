import React from 'react'
import ReCAPTCHA from "react-google-recaptcha";
import Parse from 'parse';

function ReCpatcha(props) {
  return (
    <ReCAPTCHA
    ref={props.recaptchaRef}
    sitekey= '6LfMD6cnAAAAABEb4j4AMW-EoZCpviyjpjgJHueB'
    />  
  )
}

export default ReCpatcha