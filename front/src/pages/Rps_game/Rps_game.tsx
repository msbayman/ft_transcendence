import React from 'react'
import { useState } from 'react'

function Rps_game() {

  const [userChoice, setUserChoice] = useState('')
  const [score, setScore] = useState(0)



  const [computerChoice, setComputerChoice] = useState('')
  const [result, setResult] = useState('')



  const generateComputerChoice = () => {
    const choices = ['rock', 'paper', 'scissors']
    const randomChoice = Math.floor(Math.random() * 3)
    setComputerChoice(choices[randomChoice])
    checkResult(choices[randomChoice])
  }

  const checkResult = (computerChoice: string) => {
    if (userChoice === computerChoice) {
      setResult('draw')
    } else if (
      (userChoice === 'rock' && computerChoice === 'scissors') ||
      (userChoice === 'paper' && computerChoice === 'rock') ||
      (userChoice === 'scissors' && computerChoice === 'paper')
    ) {
      setResult('win')
      setScore(score + 1)
    } else {
      setResult('lose')
      setScore(score - 1)
    }
  }

  const handleUserChoice = (choice: string) => {
    setUserChoice(choice);

    generateComputerChoice();
    console.log('userChoice: ', userChoice);
  }



  return (
    <div className='bg-[url(background.svg)] bg-cover bg-center h-screen w-full flex justify-center items-center'>
      <div className='flex justify-center items-center'>

        <div className='absolute '>
          <img src="table2.svg" alt="table" />
        </div>

        <div className='absolute bottom-[28rem]'>
          <img src="bg-picture.svg" alt="a" />
        </div>



        <div className='flex items-end justify-center gap-[4rem] relative left-5 top-[15rem]'>
          <div className='relative'>
            <img className='z-0 transition-all duration-200 hover:scale-125 cursor-pointer'
              src="RPS/Rock.svg"
              alt="ROCK"
              onClick={() => { handleUserChoice("rock") }} />
          </div>

          <div className='relative top-7'>
            <img className='z-0 transition-all duration-200 hover:scale-125 cursor-pointer'
              src="RPS/Paper.svg"
              alt="PAPER"
              onClick={() => { handleUserChoice("paper") }} />
          </div>

          <div className='relative top-7'>
            <img className='z-0 transition-all duration-200 hover:scale-125 cursor-pointer'
              src="RPS/Scissors.svg"
              alt="SCISSORS"
              onClick={() => { handleUserChoice("scissors") }} />
          </div>
        </div>
      </div>
      <div className='absolute'>
        <div className={result == "win" ? "relative bottom-9 text-white font-luckiest text-6xl" : "hidden"}>
          YOU WIN
        </div>
        <div className={result == "lose" ? "relative bottom-9 text-white font-luckiest text-6xl" : "hidden"}>
          YOU LOSE
        </div>
        <div className={result == "draw" ? "relative bottom-9 text-white font-luckiest text-6xl" : "hidden"}>
          DRAW
        </div>
      </div>

    </div>

  )
}

export default Rps_game