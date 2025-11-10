import { useState } from 'react'
import './App.css'

import Head from './Head'
import Welcome from './Welcome'
import NotLoggedIn from './NotLoggedIn'
import Nav from './Nav'

/*
  TODO: dodati Dark / Light mode
*/

function App() {
  return (
    <>
      <Head/>
      <NotLoggedIn notLoggedIn={true}></NotLoggedIn>
      <Nav/>
      <Welcome/>

    </>
  )
}

export default App
