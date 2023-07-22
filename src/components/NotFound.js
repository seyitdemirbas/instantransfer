import { Button } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'

function NotFound(props) {
  return (
    <section className="flex items-center h-full sm:p-16 dark:bg-gray-900 dark:text-gray-100">
      <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8 space-y-8 text-center sm:max-w-md">
          <p className="text-3xl">{props.title}</p>
          <Link to="/">
              <Button gradientMonochrome="teal">
                  Back to Home
              </Button>
          </Link>
      </div>
    </section>
  )
}

export default NotFound