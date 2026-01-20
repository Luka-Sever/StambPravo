import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

function Login() {
  const { oauthLogin, login, loading } = useAuth()
  const [loginToken, setLoginToken] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  if (loading) {
    return <div className="loading">Učitavanje...</div>
  }

  const handleEmailUsernameLogin = async (e) => {
    e.preventDefault()
    setMessage('')
    
    try {
      await login({ loginToken, password })
    } catch {
      setMessage('Nevažeći podaci za prijavu. Molimo pokušajte ponovno.')
      setLoginToken('')
      setPassword('')
    }
  }

  return (
    <div className="auth-wrapper">
      <h1 className="page-title">PRIJAVA</h1>

      <div className="auth-container">
        <div className="auth-card">
          <form onSubmit={handleEmailUsernameLogin} className="auth-form">
            <div className="auth-field">
              <label>EMAIL ILI KORISNIČKO IME</label>
              <input 
                type="email"
                value={loginToken}
                onChange={(e) => setLoginToken(e.target.value)}
                placeholder="Unesite email ili korisničko ime"
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

            <button id="login-google" className="auth-button small-btn" type="button" onClick={() => oauthLogin('google')}>
              GOOGLE PRIJAVA
            </button>
            
            <button id="login-git" className="auth-button small-btn" type="button" onClick={() => oauthLogin('github')}>
              GITHUB PRIJAVA
            </button>

            {message && (
              <p className="status-message" aria-live="polite">
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login