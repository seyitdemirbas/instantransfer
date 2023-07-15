import React from 'react'
import { Footer } from 'flowbite-react';
import { BsTwitter,BsGithub } from 'react-icons/bs';
import Parse from 'parse';

function FooterF() {
  const TwitterHref = Parse.Config.current().get('TwitterLink')
  const GithubHref = Parse.Config.current().get('GithubLink')

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
                href={TwitterHref ? TwitterHref : '#'}
                target='_blank'
                icon={BsTwitter}
                />
                <Footer.Icon
                href={GithubHref ? GithubHref : '#'}
                target='_blank'
                icon={BsGithub}
                />
            </div>
            </div>
        </div>
    </Footer>
  )
}

export default FooterF