// import React from 'react'
import './Play_Page.css'
import OneVsOne from "../assets/1v1.svg"
import TwoVsTwo from "../assets/2v2.svg"
import Tournemant from "../assets/Tourn.svg"
import Bot from "../assets/vsBot.svg"



const Play_Page = () => {
  return (
    <div className='main'>
      <div className='utils relative'>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className='here relative grid grid-cols-1 lg:grid-cols-2 gap-10 bottom-5'>
        <div className='modes ~sm/lg'>
          <img className='image' src={OneVsOne} />
        </div>
        <div className='modes ~sm/lg'>
          <img className='image' src={TwoVsTwo} />
        </div>
        <div className='modes ~sm/lg'>
          <img className='image' src={Bot} />
        </div>
        <div className='modes ~sm/lg'>
          <img className='image' src={Tournemant} />
        </div>
      </div>
    </div>

  )
}

export default Play_Page