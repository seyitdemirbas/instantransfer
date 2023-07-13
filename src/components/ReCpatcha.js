import React from 'react'
import ReCAPTCHA from "react-google-recaptcha";
import Parse from 'parse';

function ReCpatcha(props) {
  return (
    <ReCAPTCHA
    ref={props.recaptchaRef}
    sitekey= {Parse.Config.current().get('CpatchaSiteKey')}
    />  
  )
}

export default ReCpatcha