import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function Login() {
    const navigate = useNavigate()
    const { oauthLogin } = useAuth()
    const [submitting, setSubmitting] = useState(false)

    async function handleSubmit(event) {
        event.preventDefault()
        setSubmitting(true)
        try {
            oauthLogin('google')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="auth-wrapper">
            <h1 className="page-title">Prijava</h1>
            <div className="auth-container">
                <div className="auth-card">
                    <form onSubmit={handleSubmit} className="auth-form">
                        <button className="auth-button primary" type="submit" disabled={submitting}>
                            {submitting ? 'Slanje...' : 'Prijavi se putem Google'}
                        </button>
                    </form>
                </div>

                <div className="auth-socials">
                    <button className="auth-button dark" onClick={() => oauthLogin('github')}>Prijavi se putem GitHub</button>
                </div>
            </div>
        </div>
    )
}

export default Login
