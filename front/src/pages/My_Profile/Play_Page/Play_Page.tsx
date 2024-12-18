// import React from 'react'
import './Play_Page.css'
import OneVsOne from "../assets/1v1.svg"
import TwoVsTwo from "../assets/2v2.svg"
import Tournemant from "../assets/tourn.svg"
import Bot from "../assets/Bot.svg"



const Play_Page = () => {
  return (
    <div className='main'>
      <div>
        <h1>Play</h1>
      </div>
      <div className='relative grid grid-flow-col grid-rows-2 grid-cols-2 gap-10'>
        <div className='modes'>
          <img className='image' src={OneVsOne} />
          <p className='one'>1 V 1</p>
        </div>
        <div className='modes'>
          <img className='image' src={Bot} />
          <p className='bot'>VS BOT</p>
        </div>
        <div className='modes'>
          <img className='image' src={TwoVsTwo} />
          <p className='two'>2 V 2</p>
        </div>
        <div className='modes'>
          <img className='image' src={Tournemant} />
          <p className='tourn'>TOURN</p>
        </div>
      </div>
    </div>

  )
}

export default Play_Page