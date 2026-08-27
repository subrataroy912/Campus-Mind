import React from 'react'
import { Link } from 'react-router-dom'
import BrandLogo from './components/common/BrandLogo'
import { MdOutlinePublic } from 'react-icons/md'

function App() {
  return (
    <div className='min-h-screen bg-sky-500 flex flex-col items-center justify-center p-4 relative pt-12'>
      
      {/* Running Warning Text Banner at the top */}
      <div className="absolute top-0 left-0 w-full bg-yellow-400 text-black py-1 font-bold text-sm shadow-md overflow-hidden z-50">
        <marquee behavior="scroll" direction="left" scrollamount="6">
          ⚠️ WARNING: For Testing Purposes All Routes Are Public!⚠️
        </marquee>
      </div>
      
      <div className='text-center mb-10 text-white'>
        <div className='flex justify-center mb-4'>
          <BrandLogo />
        </div>
        <h1 className='text-xl font-medium max-w-md mx-auto'>
          An Educational Platform where anyone can manage their academic activities digitally.
        </h1>
      </div>

      <div className='flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg gap-4'>
        <Link to="/dashboard" className="text-xl font-serif text-sky-600  shadow-lg shadow-black-sm">
          Go to Dashboard
        </Link>
        <Link to="/auth" className="text-xl font-serif text-sky-600 shadow-lg shadow-black-sm">
          Go to Login/Register
        </Link>
      </div>

    </div>
  )
}

export default App
