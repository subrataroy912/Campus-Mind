import React from 'react'
import { Link } from 'react-router-dom'
import BrandLogo from './components/common/BrandLogo'
import { MdOutlinePublic } from 'react-icons/md'

function App() {
  return (
    <div className='min-h-screen bg-sky-500 flex flex-col items-center justify-center p-4'>

      <div className="flex items-center gap-4 rounded-lg bg-white p-6 shadow-md outline outline-black/5 dark:bg-gray-800">
        <span className="inline-flex shrink-0 rounded-full border border-pink-300 bg-pink-100 p-2 dark:border-pink-300/10 dark:bg-pink-400/10">
          <MdOutlinePublic color='white' />
        </span>
        <div>
          <p className="text-gray-700 dark:text-gray-400">
            For Testing Purpose All Routes Are Public
          </p>
        </div>
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
        <Link to="/dashboard" className="text-xl font-serif text-sky-600 hover:underline">
          Go to Dashboard
        </Link>
        <Link to="/auth" className="text-xl font-serif text-sky-600 hover:underline">
          Go to Login/Register
        </Link>
      </div>

    </div>
  )
}

export default App