import React from 'react'
import Upload from './Upload'
import SEO from './HelmetSeo'
import Parse from 'parse'

function HomePage() {
  const siteName = Parse.Config.current().get('SiteName')
  return (
    <React.Fragment>
      <SEO
        title= {process.env.REACT_APP_META_TITLE}
        description={process.env.REACT_APP_META_DESCRIPTION}
        name={siteName}
        type='article' />
      <Upload/>
    </React.Fragment>
  )
}

export default HomePage