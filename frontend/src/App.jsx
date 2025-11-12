import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './App.css';

import { useAuth } from './context/AuthContext.jsx';
import Head from './Head';
import Nav from './Nav';
import NotLoggedIn from './NotLoggedIn.jsx';
import AdminPage from './pages/Admin.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Welcome from './Welcome';


/*
  TODO: dodati Dark / Light mode
*/

function Shell() {
  const location = useLocation()
  const navigate = useNavigate()
  const hideNav = location.pathname === '/login'
  const { isAuthenticated } = useAuth()
  useEffect(() => {
    if (isAuthenticated && (location.pathname === '/login')) {
      navigate('/')
    }
  }, [isAuthenticated, location.pathname, navigate])
  return (
    <>
      <Head />
      {!hideNav && !isAuthenticated && <NotLoggedIn notLoggedIn={true} />}
      {!hideNav && <Nav />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/welcome" element={<Welcome />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  )
}

export default App