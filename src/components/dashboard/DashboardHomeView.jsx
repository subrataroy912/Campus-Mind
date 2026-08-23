import React from 'react'
import { Link } from 'react-router-dom'
import ClassCard from './ClassCard'

function DashboardHomeView() {
  return (
    <div className='mx-2  h-full'>
      <div className='flex justify-between px-2 py-2 shadow'>
        <span className='font-bold'>My Classes</span>
        <Link className='bg-green-600 px-2 py-1 rounded-lg text-white'>Create Class</Link>
      </div>
      <div className='grid grid-cols-3 gap-4'>
        <ClassCard />
        <ClassCard />
        <ClassCard />
      </div>
      <div className='my-3'>
        <div className=' w-fit px-3'>
          <span className='font-bold block '>Join Classes</span>
          <div className='my-2 flex flex-col gap-2'>
            <input type='text'
              placeholder='Enter Class Code'
              className='block px-4 py-2 w-full bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-lg' />
            <button className='block mx-auto rounded-2xl bg-emerald-500 px-6 py-2 text-white cursor-pointer'>Join</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardHomeView