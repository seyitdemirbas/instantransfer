import { Button } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'

function NotFound(props) {
  const title = props.title + (props.isAnon ? ' Login to see' : '')
  return (
    <section className="flex items-center h-full sm:p-16 dark:bg-gray-900 dark:text-gray-100">
      <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8 space-y-8 text-center sm:max-w-md">
          <p className="text-3xl">{title}</p>
          <div className='flex flex-row gap-3'>
          <Link to="/">
              <Button gradientMonochrome="teal">
                  Back to Home
              </Button>
          </Link>
          {props.login && props.isAnon &&
            <Link to="/static/login">
              <Button gradientMonochrome="teal">
                  Login
              </Button>
            </Link>
          }
          </div>
      </div>
    </section>
  )
}

export default NotFound