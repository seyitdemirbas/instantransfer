import React from 'react'
import { Link } from 'react-router-dom'
import { Table } from 'flowbite-react';
import { formatBytes } from './generalFunctions';


const RecentFilesItem = (props) => {
  const {filename,filesize,fileroute} = props;

  return (
    <React.Fragment>
    
    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white max-w-[150px] truncate md:max-w-none">
            {filename}
        </Table.Cell>
        <Table.Cell className='hidden md:table-cell'>
            {formatBytes(filesize)}
        </Table.Cell>
        <Table.Cell>
            {fileroute}
        </Table.Cell>
        <Table.Cell className='whitespace-nowrap'>
            <Link className='bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 dark:hover:bg-blue-300' to={`/${fileroute}`}>Go to File</Link>
        </Table.Cell>
    </Table.Row>
    </React.Fragment>
  )
}

export default RecentFilesItem;