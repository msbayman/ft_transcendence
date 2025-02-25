import React from 'react'

function Rps_game() {
  return (
    <div className='bg-[url(background.svg)]'>
      <h1>Rock Paper Scissors Game</h1>
      
      <div className='flex justify-center'>
        <div className='flex flex-col items-center'>
          <h2>Player</h2>
          <img src='rock.svg' alt='rock' />
          <img src='paper.svg' alt='paper' />
          <img src='scissors.svg' alt='scissors' />
        </div>
        <div className='flex flex-col items-center'>
          <h2>Computer</h2>
          <img src='rock.svg' alt='rock' />
          <img src='paper.svg' alt='paper' />
          <img src='scissors.svg' alt='scissors' />
        </div>
      </div>
    </div>
  )
}

export default Rps_game