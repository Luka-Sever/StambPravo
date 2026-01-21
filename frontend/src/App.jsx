import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './App.css';

import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Head from './Head';
import Nav from './Nav';
import NotLoggedIn from './NotLoggedIn.jsx';
import AdminPage from './pages/Admin.jsx';
import Arhiva from './pages/Arhiva';
import Diskusija from './pages/Diskusija';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import NoviSastanak from './pages/NoviSastanak';
import Postavke from './pages/Postavke.jsx';
import Sastanci from './pages/Sastanci';

// Komponenta koja brani pristup ako korisnik nije ADMIN
function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return <div>Učitavanje...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) return <Navigate to="/" replace />;
  return children;
}

function Shell() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, loading } = useAuth()

  const hideNav = location.pathname === '/login' || location.pathname === '/admin' || location.pathname === '/postavke';
  useEffect(() => {
    if (!loading && isAuthenticated && location.pathname === '/login') {
      navigate('/')
    }
  }, [isAuthenticated, loading, location.pathname, navigate])

  if (loading) return <div>Učitavanje...</div>

  return (
    <>
      <Head />
      {!hideNav && !isAuthenticated && <NotLoggedIn notLoggedIn={true} />}
      {!hideNav && <Nav />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route path="/sastanci" element={<Sastanci />} />
        <Route path="/diskusija" element={<Diskusija />} />
        <Route path="/arhiva" element={<Arhiva />} />
        <Route path="/postavke" element={<Postavke />} />
        <Route
          path="/sastanci/novi"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'REP']}>
              <NoviSastanak />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Shell />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App