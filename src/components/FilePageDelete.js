import React,{useState} from 'react'
import { Button, Modal,Spinner } from 'flowbite-react'
import { useDispatch } from 'react-redux'
import { deleteFileFromDatabase } from '../store/slices/filePageSlice'
import { useNavigate } from 'react-router'

export const FilePageDelete = (props) => {
const [modalState, setModalState] = useState(false)
const dispatch = useDispatch()
const navigate = useNavigate()

const handleClick = async () => {
    const params = {routeName : props.fileRoute}
    setModalState(false)
    const resultAction = await dispatch(deleteFileFromDatabase(params))
    if(deleteFileFromDatabase.fulfilled.match(resultAction)) {
        navigate('/static/recentfiles', {replace:true})
    }
}

  return (
    <React.Fragment>
        <Button gradientMonochrome="failure" disabled={props.Loading.deleteFileValue ? true : false} onClick={()=>setModalState(true)}>
            {props.Loading.deleteFileValue
            ?
            <div>
                <Spinner
                size="sm"
                light={true}
                />
            </div>
            : 'Delete This File'
            }
        </Button>

        <Modal
        show={modalState}
        size="md"
        popup={true}
        onClose={()=>setModalState(false)}
        >
        <Modal.Header />
        <Modal.Body>
        <div className="text-center">
            
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            Are you sure you want to delete this file?
            </h3>
            <div className="flex justify-center gap-4">
            <Button
                color="failure"
                // eslint-disable-next-line
                onClick={handleClick} 
            >
                Yes, I'm sure
            </Button>
            <Button
                color="gray"
                onClick={()=>setModalState(false)}
            >
                No, cancel
            </Button>
            </div>
        </div>
        </Modal.Body>
        </Modal>
    </React.Fragment>
  )
}
