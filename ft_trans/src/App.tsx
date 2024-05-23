import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Nav_Bar from './components/Nav_Bar/Nav_Bar'
import Page_One from './components/Page_One/Page_One'
import Page_Two from './components/Page_Two/Page_Two'
import Squar_P2_Small from './components/Squar_P2_Small/Squar_P2_Small'



function App() {

  return (
    <>
    {/* <Squar_P2_Small/> */}
    <Nav_Bar/>
    <Page_One/>
    <Page_Two/>
    </>
  )
}

export default App
