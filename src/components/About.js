import React from 'react'
import { Accordion } from 'flowbite-react'
import Parse from 'parse'
import SEO from './HelmetSeo'

function About() {
  // const siteName = Parse.Config.current().get('SiteName')
  const siteName = 'site name'
  return (
    <React.Fragment>
      <SEO
      title= {siteName + ' | About Page'}
      description={'A section on the website that provides information about the site. You can get a information about' + siteName}
      name={siteName}
      type='article' />
      <Accordion alwaysOpen={true}>
      <Accordion.Panel>
        <Accordion.Title>
          What is {siteName}
        </Accordion.Title>
        <Accordion.Content>
          <p className="mb-2 text-gray-800 dark:text-gray-400">
          Transfer your file over the web between devices in seconds. Upload your file to any membership with no strings attached and get a link that can be written and remembered quickly.
          </p>
        </Accordion.Content>
      </Accordion.Panel>
      <Accordion.Panel>
        <Accordion.Title>
          Can I change the file link?
        </Accordion.Title>
        <Accordion.Content>
          <p className="mb-2 text-gray-800 dark:text-gray-400">
            Of course. After uploading the file you are automatically redirected to the file page. Here you can quickly switch to another device by changing the file route to a name you can remember.
          </p>
        </Accordion.Content>
      </Accordion.Panel>
      <Accordion.Panel>
        <Accordion.Title>
          What is the storage time of the files?
        </Accordion.Title>
        <Accordion.Content>
          <p className="mb-2 text-gray-800 dark:text-gray-400">
            Your files are stored for 3 days.
          </p>
        </Accordion.Content>
      </Accordion.Panel>
    </Accordion>
  </React.Fragment>
  )
}

export default About