// import React from 'react'
import './Play_Page.css'
import OneVsOne from "../assets/1v1.svg"
import TwoVsTwo from "../assets/2v2.svg"
import Tournemant from "../assets/tourn.svg"
import Bot from "../assets/Bot.svg"



const Play_Page = () => {
  return (
    <div className='main'>
      <div className='utils'>
        
        <h1 className='bg-sky-500 ~px-4/8 ~py-2/4 ~text-sm/3xl ' >Issam</h1>
      </div>
      <div className='here relative grid grid-cols-1 lg:grid-cols-2 gap-10 border'>
        <div className='modes ~sm/lg'>
          <img className='image' src={OneVsOne} />
          <p className='one '>1 V 1</p>
        </div>
        <div className='modes ~sm/lg'>
          <img className='image' src={TwoVsTwo} />
          <p className='two'>2 V 2</p>
        </div>
        <div className='modes ~sm/lg'>
          <img className='image' src={Bot} />
          <p className='bot'>VS BOT</p>
        </div>
        <div className='modes ~sm/lg'>
          <img className='image' src={Tournemant} />
          <p className='tourn'>TOURN</p>
        </div>
      </div>
    </div>

  )
}

export default Play_Page