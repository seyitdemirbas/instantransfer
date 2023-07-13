import React from 'react'
import { Button, Spinner } from 'flowbite-react';

function ButtonWithLoading(props) {
  return (
    <Button gradientMonochrome="teal" disabled={props.loadingState ? true : false} type="submit">
    {props.loadingState
      ? <div className="mr-3">
        <Spinner
          size="sm"
          light={true}
        />
      </div>
      : props.buttonName
    }
    </Button>
  )
}

export default ButtonWithLoading