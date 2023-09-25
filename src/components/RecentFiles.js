import React, { useEffect,useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button,Modal} from 'flowbite-react';
import { IconContext } from "react-icons";
import { AiOutlineLoading3Quarters} from 'react-icons/ai';
import RecentFilesItem from './RecentFilesItem';
import { getFilesFromDatabase, setIsRendered } from '../store/slices/myFilesSlice';
import { deleteFileFromDatabase } from '../store/slices/filePageSlice';
import SEO from './HelmetSeo'
import Parse from 'parse';

const RecentFiles = () => {
  const files = useSelector(state => state.myFiles.recentfilelist);
  const loading = useSelector(state => state.myFiles.loading);
  const isRendered = useSelector(state => state.myFiles.isRendered.value);
  const dispatch = useDispatch();
  const [checkboxes, setCheckboxes] = useState([]);
  const [modalState, setModalState] = useState(false)
  const siteName = Parse.Config.current().get('SiteName')

  const handleCheckboxChange = (value, checked) => {
      console.log(checkboxes)
      if (checked) {
          setCheckboxes([...checkboxes, value]);
      } else {
          setCheckboxes(checkboxes.filter((item) => item !== value));
      }
  };

  const handleSubmit = async () => {
      setModalState(false)
      Array.from(checkboxes).forEach(async fileid => {
        const params = {id : fileid, isMultiple: true}
        const resultAction = await dispatch(deleteFileFromDatabase(params))
        if(deleteFileFromDatabase.fulfilled.match(resultAction)) {
          setCheckboxes(checkboxes.filter((item) => item !== fileid))
        }
      });
  };

  useEffect(()=>{
      if(!isRendered) {
        dispatch(getFilesFromDatabase())
        dispatch(setIsRendered(true))
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  if(loading.recentFilesValue) {
    return (
        <IconContext.Provider value={{ color: "blue", className: "rotateIcon", size:"7em" }}>
            <div className="flex justify-items-center items-center h-80">
                <div className="m-auto">
                    <AiOutlineLoading3Quarters/>
                </div>
            </div>
        </IconContext.Provider>
    )
  }else {
    return (
      <React.Fragment>
       <SEO
      title= {siteName + ' | Recent Files'}
      description={'A section on the website that provides information about the your recent files. You can list informations about your files and you can delete files.'}
      name={siteName}
      type='article' />

      <form onSubmit={(e)=>{
        e.preventDefault()
        setModalState(true)
        }
      }>
        <Table className= 'overflow-x-auto' striped={true}>
          <Table.Head>
            <Table.HeadCell>
                Name
            </Table.HeadCell>
            <Table.HeadCell className='hidden md:table-cell'>
                Size
            </Table.HeadCell> 
            <Table.HeadCell className='hidden md:table-cell'>
                Route
            </Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">
                Go to File
              </span>
            </Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">
                Select
              </span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
              {files.length > 0
              ?files.map(files=>{
                return <RecentFilesItem handleCheckboxChange={handleCheckboxChange} key={files.id} {...files}  />
              })
              :<Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800"><Table.Cell>There is no files.</Table.Cell></Table.Row>
              } 
          </Table.Body>
        </Table>
        {checkboxes.length > 0 &&
        <div className="mt-2 inline-block float-right">
          <Button type="submit" gradientMonochrome="failure">Delete File{checkboxes.length > 1 && 's'}</Button>  
        </div>
        }
      </form>

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
            Are you sure you want to delete selected file{checkboxes.length > 1 && 's'}?
            </h3>
            <div className="flex justify-center gap-4">
            <Button
                color="failure"
                // eslint-disable-next-line
                onClick={handleSubmit} 
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
}


export default RecentFiles;
