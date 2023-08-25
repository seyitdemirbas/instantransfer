import React from 'react'
import Upload from './Upload'
import SEO from './HelmetSeo'
import Parse from 'parse'

function HomePage() {
  const siteName = Parse.Config.current().get('SiteName')
  return (
    <React.Fragment>
      <SEO
        title= {siteName + ' | Upload a file and transfer between devices in seconds'}
        description={siteName + ' is Transfer your file over the web between devices in seconds. Upload your file to any membership, no strings attached, and get a link that can be written quickly!'}
        name={siteName}
        type='article' />
      <Upload/>
    </React.Fragment>
  )
}

export default HomePage