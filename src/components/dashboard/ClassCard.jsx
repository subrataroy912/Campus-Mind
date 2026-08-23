import React from 'react'
import classPage from "../../assets/classes-page.png"
import { Link } from 'react-router-dom'
export default function ClassCard() {
  return (
    <Link className='shadow'>
      <div>
        <img src={classPage} className='w-full'></img>
      </div>
      <div className='flex flex-col p-3'>
        <span className='block font-bold '>Class Name</span>
        <span className='block '>Created by Subrata</span>

      </div>

    </Link>
  )
}
