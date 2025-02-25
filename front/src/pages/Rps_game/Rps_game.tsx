import React from 'react'

function Rps_game() {
  return (
    <div className='bg-[url(background.svg)] bg-cover bg-center h-screen w-full'>
      <h1>Rock Paper Scissors Game </h1>

      <div className='flex justify-center items-center'>
        <img src="table2.svg" alt="table" />
        <div className='absolute bottom-[41rem]'>
          <img src="bg-picture.svg" alt="a" />
        </div>
      </div>
    </div>
  )
}

export default Rps_game