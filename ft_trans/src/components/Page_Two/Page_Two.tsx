import React from 'react'

import './Page_Two.css'
import Squar_P2_Small from '../Squar_P2_Small/Squar_P2_Small'
import Squar_P2_Big from '../Squar_P2_Big/Squar_P2_Big'
function Page_Two() {
  return (
    <>
        <div className="main_p_2">
          <div className="top_p2">
            <Squar_P2_Small/>
            <Squar_P2_Big/>
            <Squar_P2_Small/>
          </div>
          <div className="bottom_p2">

          </div>
        </div>
    </>
  )
}

export default Page_Two