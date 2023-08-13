import React from 'react'
import { Accordion } from 'flowbite-react'
import Parse from 'parse'

function About() {
  return (
    <Accordion alwaysOpen={true}>
    <Accordion.Panel>
      <Accordion.Title>
        What is {Parse.Config.current().get('SiteName')}
      </Accordion.Title>
      <Accordion.Content>
        <p className="mb-2 text-gray-800 dark:text-gray-400">
        Transfer your file over the web between devices in seconds. Upload your file to any membership with no strings attached and get a link that can be written and remembered quickly!
        </p>
      </Accordion.Content>
    </Accordion.Panel>
    <Accordion.Panel>
      <Accordion.Title>
        Can I change the file link?
      </Accordion.Title>
      <Accordion.Content>
        <p className="mb-2 text-gray-800 dark:text-gray-400">
          Of course! After uploading the file you are automatically redirected to the file page. Here you can quickly switch to another device by changing the file route to a name you can remember.
        </p>
      </Accordion.Content>
    </Accordion.Panel>
    <Accordion.Panel>
      <Accordion.Title>
        What is the storage time of the files?
      </Accordion.Title>
      <Accordion.Content>
        <p className="mb-2 text-gray-800 dark:text-gray-400">
          Your files are stored for 3 days. This is more than enough time to transfer the file!
        </p>
      </Accordion.Content>
    </Accordion.Panel>
  </Accordion>
  )
}

export default About