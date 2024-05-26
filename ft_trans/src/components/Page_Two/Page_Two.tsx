import React from 'react'

// import './Page_Two.css'
import Squar_P2_Small from '../Squar_P2_Small/Squar_P2_Small'
import Squar_P2_Big from '../Squar_P2_Big/Squar_P2_Big'
function Page_Two() {
  return (
    <>
      <div className="main_p_2 overflow-x-hidden m-0 h-screen bg-cover bg-center flex flex-col justify-center items-center" style={{ backgroundImage: 'url("/Home_page/page_2_background.svg")' }}>
        <div className="top_p2 flex flex-wrap gap-2 justify-evenly items-center w-screen flex-[6] ">
          <Squar_P2_Small/>
          <Squar_P2_Big/>
          <Squar_P2_Small/>
          {/* <Squar_P2_Big/> */}
          {/* <Squar_P2_Small/> */}
        </div>
        <div className="bottom_p2 flex justify-center items-center w-screen flex-[4]">
        </div>
      </div>
    </>
  );
}

export default Page_Two