import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Head from './Head'
import Welcome from './Welcome'
import NotLoggedIn from './NotLoggedIn'
import Nav from './Nav'
import AdminPage from './pages/Admin.jsx'


/*
  TODO: dodati Dark / Light mode
*/

function App() {
  return (
    <BrowserRouter>
      <Head/>
      <NotLoggedIn notLoggedIn={true}></NotLoggedIn>
      <Nav/>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App