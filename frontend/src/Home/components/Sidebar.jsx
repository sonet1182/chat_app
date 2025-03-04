import React from 'react'
import { FaSearch } from 'react-icons/fa'

function Sidebar() {
  return (
    <div className='h-full w-auto px-1'>

        <div className='flex justify-between gap-2'>
            <form className='w-auto flex items-center justify-between bg-white rounded-full'>
                <input type='text' placeholder='Search User' className='px-4 w-auto bg-transparent outline-none rounded-full'/>
                <button className='btn btn-circle bg-sky-700 hover:bg-gray-950'>
                    <FaSearch/>
                </button>
            </form>
        </div>
    </div>
  )
}

export default Sidebar