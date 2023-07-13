import React from 'react'
import { Footer } from 'flowbite-react';
import { BsFacebook,BsInstagram,BsTwitter,BsGithub } from 'react-icons/bs';
import Parse from 'parse';

function FooterF() {
  return (
    <Footer container={true}>
        <div className="w-full">
            <Footer.Divider />
            <div className="w-full sm:flex sm:items-center sm:justify-between">
            <Footer.Copyright
                href="#"
                by={Parse.Config.current().get('SiteName') + '™' }
                year={2022}
            />
            <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
                <Footer.Icon
                href="#"
                icon={BsFacebook}
                />
                <Footer.Icon
                href="#"
                icon={BsInstagram}
                />
                <Footer.Icon
                href="#"
                icon={BsTwitter}
                />
                <Footer.Icon
                href="#"
                icon={BsGithub}
                />
            </div>
            </div>
        </div>
    </Footer>
  )
}

export default FooterF