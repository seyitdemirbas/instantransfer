import React, { useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Table} from 'flowbite-react';
import { IconContext } from "react-icons";
import { AiOutlineLoading3Quarters} from 'react-icons/ai';
import RecentFilesItem from './RecentFilesItem';
import { getFilesFromDatabase, setIsRendered } from '../store/slices/myFilesSlice';


const RecentFiles = () => {
  const files = useSelector(state => state.myFiles.recentfilelist);
  const loading = useSelector(state => state.myFiles.loading);
  const isRendered = useSelector(state => state.myFiles.isRendered.value);
  const dispatch = useDispatch();

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
      {/* <div className='overflow-x-auto'> */}
      <Table className= 'overflow-x-auto' striped={true}>
        <Table.Head>
          <Table.HeadCell>
              Name
          </Table.HeadCell>
          <Table.HeadCell className='hidden md:table-cell'>
              Size
          </Table.HeadCell>
          <Table.HeadCell>
              Route
          </Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">
              Go to File
            </span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {files.length > 0
          ?files.map(files=>{
            return <RecentFilesItem key={files.id} {...files} />
          })
          :<Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800"><Table.Cell>There is no files.</Table.Cell></Table.Row>
          }
        </Table.Body>
      </Table>
      {/* </div> */}
      </React.Fragment>
  
    )
  }
}


export default RecentFiles;
