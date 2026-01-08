import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

function Login() {
  const { oauthLogin, login, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (loading) {
    return <div className="loading">Učitavanje...</div>
  }

  const handleEmailLogin = (e) => {
    e.preventDefault()
    login({ email, password })
  }

  return (
    <div className="auth-wrapper">
      <h1 className="page-title">PRIJAVA</h1>

      <div className="auth-container">
        <div className="auth-card">
          <form onSubmit={handleEmailLogin} className="auth-form">
            <div className="auth-field">
              <label>EMAIL</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Unesite email"
                required
              />
            </div>
            
            <div className="auth-field">
              <label>LOZINKA</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Unesite lozinku"
                required
              />
            </div>

            <button id="register" className="auth-button primary small-btn" type="submit">
              PRIJAVI SE
            </button>

            <button id="login" className="auth-button small-btn" type="button" onClick={() => oauthLogin('google')}>
              GOOGLE PRIJAVA
            </button>
            
            <button id="login" className="auth-button small-btn" type="button" onClick={() => oauthLogin('github')}>
              GITHUB PRIJAVA
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login